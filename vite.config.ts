import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.MISTRAL_API_KEY': JSON.stringify(env.MISTRAL_API_KEY),
        'process.env.ASSISTANT_AI_MODEL': JSON.stringify(env.ASSISTANT_AI_MODEL),
        'process.env.INSIGHT_ENGINE_AI_MODEL': JSON.stringify(env.INSIGHT_ENGINE_AI_MODEL),
        'process.env.PLAYGROUND_AI_MODEL': JSON.stringify(env.PLAYGROUND_AI_MODEL),
      },
      resolve: {
        alias: {
          // Fix: Replace __dirname with import.meta.url and path.dirname for Vite compatibility
          '@': dirname(fileURLToPath(import.meta.url)),
        }
      }
    };
});