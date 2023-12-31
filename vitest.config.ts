import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
        env: {
            NODE_ENV: 'test',
        },
    },
})