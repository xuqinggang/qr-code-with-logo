import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace';

const watch = {
  include: 'src/**',
  exclude: 'node_modules/**'
}

export default [
  // browser build
  {
    input: 'src/browser.js',

    output: [
      {
        format: 'cjs',
        exports: 'named',
        file: 'lib/browser.js'
      },
      {
        format: 'es',
        file: 'lib/browser.esm.js'
      },
    ],

    watch,

    plugins: [
      resolve({browser: true}),
      commonjs(),
      babel(),
      replace({
        RUN_ENV: JSON.stringify(process.env.RUN_ENV || 'browser'),
      }),
    ],

    external: ['qrcode'],
  },
  // browser build uglify
  {
    input: 'src/browser.js',
    output: [
      {
        format: 'umd',
        file: 'lib/qr-code-with-logo.browser.min.js',
        name: 'QrCodeWithLogo',
        globals: {
          'QrCodeWithLogo': 'QrCodeWithLogo',
        },
      },
    ],

    watch,

    plugins: [
      resolve({browser: true}),
      commonjs(),
      babel(),
      replace({
        RUN_ENV: JSON.stringify(process.env.RUN_ENV || 'browser'),
      }),
      uglify(),
    ],
  },
]
