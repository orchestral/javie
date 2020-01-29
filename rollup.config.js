import typescript from 'rollup-plugin-typescript2';
import pkg from "./package.json";

export default {
    input: "./src/javie.ts",
    output: {
        file: pkg.main,
        format: 'esm'
    },
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [typescript()]
}
