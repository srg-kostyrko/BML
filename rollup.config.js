import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

const plugins = [
  // Allow json resolution
  json(),
  // Compile TypeScript files
  typescript(),
  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  commonjs(),
  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  // https://github.com/rollup/rollup-plugin-node-resolve#usage
  resolve(),

  // Resolve source maps to the original source
  sourceMaps(),

  terser(),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      name: 'binaryMarkup',
      format: 'umd',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'src/index.ts',
    output: { file: pkg.module, format: 'es', sourcemap: true },
    plugins,
  },
];
