const { createCanvas } = require('canvas');
const QrCodeWithLogo = require('../../lib');
console.time('test');
const canvas = createCanvas(400, 400);

// 带 LOGO的
// QrCodeWithLogo.default.toCanvas({
//   canvas,
//   content: 'http://blog.cloudself.cn/',
//   width: 380,
//   logo: {
//     src: 'https://cdn.blog.cloudself.cn/images/avatar.png',
//   }
// })
//   .then(() => {
//     console.log(canvas.toDataURL())
//   })


// 带 LOGO的，圆角，满配
QrCodeWithLogo.default.toCanvas({
  canvas,
  content: 'http://blog.cloudself.cn',
  width: 320,
  nodeQrCodeOptions: { // 兼容 node-qrcode
    margin: 4,
    color: {
      dark: '#ff4538',
      light: '#d2ffdb'
    }
  },
  logo: {
    src: 'https://cdn.blog.cloudself.cn/images/avatar.png',
    logoRadius: 14,
    borderRadius: 8,
    borderColor: '#BBBBBB99', // IE下 只能使用 6位的 RGB
    borderSize: 0.06 // 边框大小 相对二维码的比例
  }
})
  .then(() => {
    canvas.toDataURL();
    console.timeEnd('test');
  })
