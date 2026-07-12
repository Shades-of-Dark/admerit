import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.CLIENT_PORT),
      proxy: {
        '/api': {
          target: `http://localhost:${env.SERVER_PORT}`,
          changeOrigin: true,
        },
        '/log-in': {
          target: `http://localhost:${env.SERVER_PORT}`,
          changeOrigin: true,
        },
        '/log-out': {
          target: `http://localhost:${env.SERVER_PORT}`,
          changeOrigin: true,
        },
        '/guest-login': {
          target: `http://localhost:${env.SERVER_PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});