import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path'
import { name } from './package.json'
const formattedName = name.match(/[^/]+$/)?.[0] ?? name
export default defineConfig({
    plugins: [react(),
    dts({
        include: ['lib'],
        insertTypesEntry: true,
    })
    ],
    mode: 'lib',
    base: './',
    build: {
        sourcemap: false,
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            name: formattedName,
            formats: ['umd'],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react/jsx-runtime', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react/jsx-runtime': 'react/jsx-runtime',
                    'react-dom': 'ReactDOM',
                },
            },
        }
    },
    logLevel: "info",
}
)
