import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace';

const watch = {
  include: 'src/**',
  exclude: 'node_modules/**'
}

export default [
  // server build
  {
    input: 'src/server.js',

    output: [
      {
        format: 'cjs',
        exports: 'named',
        file: 'lib/index.js'
      },
      {
        format: 'es',
        file: 'lib/index.esm.js'
      },
    ],

    watch,

    plugins: [
      resolve(),
      commonjs(),
      babel(),
      replace({
        RUN_ENV: JSON.stringify(process.env.RUN_ENV || 'browser'),
      }),
    ],
    external: ['qrcode', 'canvas']
  },
];
