import {promisify} from './utils'
import QRCode from 'qrcode'

let createCanvas;
if (RUN_ENV === 'server') {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
}

/**
 *
 * render
 * change logs:
 * 2018/2/28 herbluo created
 */
const toCanvas = promisify(QRCode.toCanvas)

export const renderQrCode = ({
  canvas,
  content,
  width = 0,
  nodeQrCodeOptions = {}
}) => {
  nodeQrCodeOptions.errorCorrectionLevel = getErrorCorrectionLevel(content)

  return getOriginWidth(content, nodeQrCodeOptions)
    .then(_width => {
      nodeQrCodeOptions.scale = width === 0 ? undefined : width / _width * 4
      return toCanvas(canvas, content, nodeQrCodeOptions)
    })
}

// 得到原QrCode的大小，以便缩放得到正确的QrCode大小
const getOriginWidth = (content, nodeQrCodeOption) => {
  let _canvas;
  if (RUN_ENV === 'browser') {
    _canvas = document.createElement('canvas');
  } else {
    _canvas = createCanvas(400, 400)
  }

  return toCanvas(_canvas, content, nodeQrCodeOption)
    .then(() => _canvas.width)
}

// 对于内容少的QrCode，增大容错率
const getErrorCorrectionLevel = (content) => {
  if (content.length > 36) {
    return 'M'
  } else if (content.length > 16) {
    return 'Q'
  } else {
    return 'H'
  }
}
