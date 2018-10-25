let createCanvas, loadImage;
if (RUN_ENV === 'server') {
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
}

/**
 *
 * helpers
 * change logs:
 * 2018/2/28 herbluo created
 */
export const drawLogo = ({
  canvas,
  content,
  logo
}) => {
  if (!logo || (logo && !logo.src)) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ctx = canvas.getContext('2d')

  let {
    logoSize = 0.15,
    borderColor,
    bgColor = borderColor || '#ffffff',
    borderSize = 0.05,
    crossOrigin,
    borderRadius = 8,
    logoRadius = 0,
    logoWidth,
    logoHeight,
    borderWidth = 2, // logo border 左右两边大小
    borderHeight, // logo border 上线两边大小
  } = logo;

  let logoSrc = typeof logo === 'string' ? logo : logo.src;
  // 没有设置logoWidth，则通过logoSize调整
  logoWidth = logoWidth || canvasWidth * logoSize;
  logoHeight = logoHeight || logoWidth;
  let logoX = (canvasWidth - logoWidth) / 2;
  let logoY = (canvasHeight - logoHeight) / 2;


  // logo border设置
  if (borderHeight === undefined) {
    borderHeight = borderWidth;
  }

  if (borderWidth !== 0 || borderHeight !== 0) {
    let logoBgWidth = (borderWidth * 2) + logoWidth;
    let logoBgHeight = (borderHeight * 2) + logoHeight;
    let logoBgX = (canvasWidth - logoBgWidth) / 2;
    let logoBgY = (canvasHeight - logoBgHeight) / 2;

    // logo border 底色
    canvasRoundRect(ctx)(logoBgX, logoBgY, logoBgWidth, logoBgHeight, borderRadius);
    ctx.fillStyle = bgColor;
    ctx.fill();
  }
  // logoBgWidth = logoBgWidth || (logoWidth + canvasWidth * borderSize);
  // logoBgHeight = logoBgHeight || (logoWidth + canvasWidth * borderSize);
  // let logoBgWidth = canvasWidth * (logoSize + borderSize);
  // let logoBgXY = canvasWidth * (1 - logoSize - borderSize) / 2;


  // 使用image绘制可以避免某些跨域情况
  const drawLogoWithImage = (image) => {
    ctx.drawImage(image, logoX, logoY, logoWidth, logoHeight)
  }

  // 使用canvas绘制以获得更多的功能
  const drawLogoWithCanvas = (image) => {
    let canvasImage
    if (RUN_ENV === 'browser') {
      canvasImage = document.createElement('canvas')
    } else {
      canvasImage = createCanvas(400, 400)
    }

    canvasImage.width = logoX + logoWidth;
    canvasImage.height = logoY + logoHeight;
    canvasImage.getContext('2d').drawImage(image, logoX, logoY, logoWidth, logoHeight)

    // 设置logoRadius和logo纹理
    canvasRoundRect(ctx)(logoX, logoY, logoWidth, logoHeight, logoRadius);
    ctx.fillStyle = ctx.createPattern(canvasImage, 'no-repeat');
    ctx.fill();
  }

  // 将 logo绘制到 canvas上
  return new Promise(((resolve, reject) => {
    if (RUN_ENV === 'browser') {
      // logo
      const image = new Image()
      if (crossOrigin || logoRadius) {
        image.setAttribute('crossOrigin', crossOrigin || 'anonymous')
      }
      image.src = logoSrc
      image.onload = () => {
        logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image)
        resolve()
      }
    } else {
      loadImage(logoSrc)
        .then(image => {
          logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image)
          resolve()
        })
    }
  }));
}

// copy来的方法，用于绘制圆角
const canvasRoundRect = ctx => (x, y, w, h, r) => {
  const minSize = Math.min(w, h)
  if (r > minSize / 2) {
    r = minSize / 2
  }
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  return ctx
}
