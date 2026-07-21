import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const FFMPEG_CORE_VERSION = '0.12.10'
const FFMPEG_CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`

// Skip compression for files already small enough to upload comfortably.
const SKIP_COMPRESSION_BELOW_BYTES = 4 * 1024 * 1024

let ffmpegInstance: FFmpeg | null = null
let ffmpegLoadPromise: Promise<FFmpeg> | null = null

const getFfmpeg = async (): Promise<FFmpeg> => {
  if (ffmpegInstance) return ffmpegInstance

  if (!ffmpegLoadPromise) {
    ffmpegLoadPromise = (async () => {
      const ffmpeg = new FFmpeg()
      const coreURL = await toBlobURL(`${FFMPEG_CORE_BASE_URL}/ffmpeg-core.js`, 'text/javascript')
      const wasmURL = await toBlobURL(`${FFMPEG_CORE_BASE_URL}/ffmpeg-core.wasm`, 'application/wasm')
      await ffmpeg.load({ coreURL, wasmURL })
      ffmpegInstance = ffmpeg
      return ffmpeg
    })()
  }

  return ffmpegLoadPromise
}

export interface CompressVideoOptions {
  onProgress?: (ratio: number) => void
}

/**
 * Compresses a video file in the browser (via ffmpeg.wasm) before upload.
 * Falls back to the original file if the file is already small or if
 * compression fails for any reason (e.g. unsupported browser).
 */
export const compressVideoInBrowser = async (
  file: File,
  { onProgress }: CompressVideoOptions = {}
): Promise<File> => {
  if (!file.type.startsWith('video/') || file.size <= SKIP_COMPRESSION_BELOW_BYTES) {
    return file
  }

  try {
    const ffmpeg = await getFfmpeg()

    const progressHandler = ({ progress }: { progress: number }) => {
      onProgress?.(Math.min(1, Math.max(0, progress)))
    }
    ffmpeg.on('progress', progressHandler)

    const inputName = `input-${Date.now()}${getExtension(file.name)}`
    const outputName = `output-${Date.now()}.mp4`

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(file))

      await ffmpeg.exec([
        '-i', inputName,
        '-vf', "scale='min(1280,iw)':-2",
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '28',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        outputName
      ])

      const data = await ffmpeg.readFile(outputName)
      const compressedBlob = new Blob([data as BlobPart], { type: 'video/mp4' })

      // Only use the compressed result if it's actually smaller.
      if (compressedBlob.size > 0 && compressedBlob.size < file.size) {
        const compressedName = file.name.replace(/\.[^.]+$/, '') + '-compressed.mp4'
        return new File([compressedBlob], compressedName, { type: 'video/mp4' })
      }

      return file
    } finally {
      ffmpeg.off('progress', progressHandler)
      await Promise.all([
        ffmpeg.deleteFile(inputName).catch(() => {}),
        ffmpeg.deleteFile(outputName).catch(() => {})
      ])
    }
  } catch (error) {
    console.error('Video compression failed, uploading original file instead:', error)
    return file
  }
}

const getExtension = (filename: string) => {
  const match = filename.match(/\.[^.]+$/)
  return match ? match[0] : '.mp4'
}
