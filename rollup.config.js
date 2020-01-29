import typescript from 'rollup-plugin-typescript2';
import pkg from "./package.json";

export default {
  input: "./src/javie.ts",
  output: [
    { file: pkg.module, format: 'esm' },
    { file: pkg.main, format: 'cjs' },
    { file: './dist/javie.iife.js', format: 'iife', name: 'Javie' },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [typescript()]
}
