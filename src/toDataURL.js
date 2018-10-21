import { toCanvas } from './toCanvas'
import {isFunction, isString} from './utils'

let createCanvas;
if (RUN_ENV === 'server') {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
}

export const toDataURL = (options) => {
  let canvas;
  if (RUN_ENV === 'browser') {
    canvas = document.createElement('canvas');
  } else {
    canvas = createCanvas(400, 400)
  }
  options.canvas = canvas
  if (options.logo) {
    if (isString(options.logo)) {
      options.logo = { src: options.logo }
    }
    options.logo.crossOrigin = 'Anonymous'
  }
  return toCanvas(options)
    .then(() => {
      return canvas.toDataURL();
    });
}
