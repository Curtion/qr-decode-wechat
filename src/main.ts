import type { ImageSource, InternalObject, Result } from './types'

async function importOpenCV(): Promise<InternalObject> {
  const cv = await import('./wasm').then(r => r.cv)
  await cv.ready
  const qrcode_detector = await loadModels(cv)
  return {
    cv,
    qrcode_detector,
  }
}

let _promise: Promise<InternalObject>

async function getOpenCV() {
  if (!_promise) {
    _promise = importOpenCV()
  }
  return _promise
}

export async function ready() {
  await getOpenCV()
}

export async function decode(input: ImageSource): Promise<Result[]> {
  const { cv, qrcode_detector } = await getOpenCV()
  const inputImage = cv.imread(input, cv.IMREAD_GRAYSCALE)
  const points_vec = new cv.MatVector()
  const res = qrcode_detector.detectAndDecode(inputImage, points_vec)

  const data = []

  for (let i = 0; i < res.size(); i++) {
    const points = points_vec.get(i)
    data.push({
      text: res.get(i),
      rect: points
        ? {
            x: points.floatAt(0),
            y: points.floatAt(1),
            width: points.floatAt(4) - points.floatAt(0),
            height: points.floatAt(5) - points.floatAt(1),
          }
        : undefined,
    })
  }

  points_vec.delete()
  inputImage.delete()

  return data
}

async function loadModels(cv: any) {
  const models = await import('./wasm')

  cv.FS_createDataFile('/', 'detect.prototxt', models.detect_prototxt, true, false, false)
  cv.FS_createDataFile('/', 'detect.caffemodel', models.detect_caffemodel, true, false, false)
  cv.FS_createDataFile('/', 'sr.prototxt', models.sr_prototxt, true, false, false)
  cv.FS_createDataFile('/', 'sr.caffemodel', models.sr_caffemodel, true, false, false)

  // eslint-disable-next-line new-cap
  const qrcode_detector = new cv.wechat_qrcode_WeChatQRCode(
    'detect.prototxt',
    'detect.caffemodel',
    'sr.prototxt',
    'sr.caffemodel',
  )

  return qrcode_detector
}
