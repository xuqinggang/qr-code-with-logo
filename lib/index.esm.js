import QRCode from 'qrcode';

/**
 * copy自
 * http://blog.csdn.net/bdss58/article/details/67151775
 * promisify
 * change logs:
 * 2018/2/28 herbluo created
 */
var promisify = function promisify(f) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      args.push(function (err, result) {
        if (err) reject(err);else resolve(result);
      });
      f.apply(null, args);
    });
  };
};

function isString(o) {
  return typeof o === 'string';
}

var createCanvas = void 0;
{
  var canvas = require('canvas');
  createCanvas = canvas.createCanvas;
}

/**
 *
 * render
 * change logs:
 * 2018/2/28 herbluo created
 */
var toCanvas = promisify(QRCode.toCanvas);

var renderQrCode = function renderQrCode(_ref) {
  var canvas = _ref.canvas,
      content = _ref.content,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 0 : _ref$width,
      _ref$nodeQrCodeOption = _ref.nodeQrCodeOptions,
      nodeQrCodeOptions = _ref$nodeQrCodeOption === undefined ? {} : _ref$nodeQrCodeOption;

  nodeQrCodeOptions.errorCorrectionLevel = getErrorCorrectionLevel(content);

  return getOriginWidth(content, nodeQrCodeOptions).then(function (_width) {
    nodeQrCodeOptions.scale = width === 0 ? undefined : width / _width * 4;
    return toCanvas(canvas, content, nodeQrCodeOptions);
  });
};

// 得到原QrCode的大小，以便缩放得到正确的QrCode大小
var getOriginWidth = function getOriginWidth(content, nodeQrCodeOption) {
  var _canvas = void 0;
  {
    _canvas = createCanvas(400, 400);
  }

  return toCanvas(_canvas, content, nodeQrCodeOption).then(function () {
    return _canvas.width;
  });
};

// 对于内容少的QrCode，增大容错率
var getErrorCorrectionLevel = function getErrorCorrectionLevel(content) {
  if (content.length > 36) {
    return 'M';
  } else if (content.length > 16) {
    return 'Q';
  } else {
    return 'H';
  }
};

var createCanvas$1 = void 0,
    loadImage = void 0;
{
  var canvas$1 = require('canvas');
  createCanvas$1 = canvas$1.createCanvas;
  loadImage = canvas$1.loadImage;
}

/**
 *
 * helpers
 * change logs:
 * 2018/2/28 herbluo created
 */
var drawLogo = function drawLogo(_ref) {
  var canvas = _ref.canvas,
      content = _ref.content,
      logo = _ref.logo;

  if (!logo) {
    return;
  }

  var canvasWidth = canvas.width;
  var _logo$logoSize = logo.logoSize,
      logoSize = _logo$logoSize === undefined ? 0.15 : _logo$logoSize,
      borderColor = logo.borderColor,
      _logo$bgColor = logo.bgColor,
      bgColor = _logo$bgColor === undefined ? borderColor || '#ffffff' : _logo$bgColor,
      _logo$borderSize = logo.borderSize,
      borderSize = _logo$borderSize === undefined ? 0.05 : _logo$borderSize,
      crossOrigin = logo.crossOrigin,
      _logo$borderRadius = logo.borderRadius,
      borderRadius = _logo$borderRadius === undefined ? 8 : _logo$borderRadius,
      _logo$logoRadius = logo.logoRadius,
      logoRadius = _logo$logoRadius === undefined ? 0 : _logo$logoRadius;

  var logoSrc = typeof logo === 'string' ? logo : logo.src;
  var logoWidth = canvasWidth * logoSize;
  var logoXY = canvasWidth * (1 - logoSize) / 2;
  var logoBgWidth = canvasWidth * (logoSize + borderSize);
  var logoBgXY = canvasWidth * (1 - logoSize - borderSize) / 2;

  var ctx = canvas.getContext('2d');

  // logo 底色
  canvasRoundRect(ctx)(logoBgXY, logoBgXY, logoBgWidth, logoBgWidth, borderRadius);
  ctx.fillStyle = bgColor;
  ctx.fill();

  // 使用image绘制可以避免某些跨域情况
  var drawLogoWithImage = function drawLogoWithImage(image) {
    ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
  };

  // 使用canvas绘制以获得更多的功能
  var drawLogoWithCanvas = function drawLogoWithCanvas(image) {
    var canvasImage = void 0;
    {
      canvasImage = createCanvas$1(400, 400);
    }

    canvasImage.width = logoXY + logoWidth;
    canvasImage.height = logoXY + logoWidth;
    canvasImage.getContext('2d').drawImage(image, logoXY, logoXY, logoWidth, logoWidth);

    canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius);
    ctx.fillStyle = ctx.createPattern(canvasImage, 'no-repeat');
    ctx.fill();
  };

  // 将 logo绘制到 canvas上
  return new Promise(function (resolve, reject) {
    {
      loadImage(logoSrc).then(function (image) {
        logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image);
        resolve();
      });
    }
  });
};

// copy来的方法，用于绘制圆角
var canvasRoundRect = function canvasRoundRect(ctx) {
  return function (x, y, w, h, r) {
    var minSize = Math.min(w, h);
    if (r > minSize / 2) {
      r = minSize / 2;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
  };
};

var toCanvas$1 = function toCanvas(options) {
  return renderQrCode(options).then(function () {
    return options;
  }).then(drawLogo);
};

var createCanvas$2 = void 0;
{
  var canvas$2 = require('canvas');
  createCanvas$2 = canvas$2.createCanvas;
}

var toDataURL = function toDataURL(options) {
  var canvas = void 0;
  {
    canvas = createCanvas$2(400, 400);
  }
  options.canvas = canvas;
  if (options.logo) {
    if (isString(options.logo)) {
      options.logo = { src: options.logo };
    }
    options.logo.crossOrigin = 'Anonymous';
  }
  return toCanvas$1(options).then(function () {
    return canvas.toDataURL();
  });
};

/**
 * server side only have toCanvas
 * author xuqinggang
 * @date 2018-10-20 20:08
 */

var QrCodeWithLogo = {
  toCanvas: toCanvas$1,
  toDataURL: toDataURL
};

export default QrCodeWithLogo;
