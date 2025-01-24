export interface Result {
  text: string | null
  rect?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export type ImageSource =
  | ImageDataLike
  | ImageData
  | HTMLCanvasElement
  | HTMLImageElement

export interface InternalObject {
  cv: any
  qrcode_detector: any
}

export interface ImageDataLike {
  data: Uint8ClampedArray
  width: number
  height: number
}
