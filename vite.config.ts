import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  const { SENTRY_AUTH_TOKEN } = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    root: __dirname,
    base: './',
    plugins: [react(), sentryVitePlugin({
      authToken: SENTRY_AUTH_TOKEN,
      org: "openchat-ai-e588264b7",
      project: "javascript-react"
    })],
    build: {
      sourcemap: true,
    },
  }
})
