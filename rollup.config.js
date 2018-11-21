import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  cache: false,
  input: 'lib/index.js',
  output: {
    file: 'dist/bml.js',
    name: 'bml',
    format: 'iife',
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      sourceMap: false,
    }),
    terser(),
  ],
};
