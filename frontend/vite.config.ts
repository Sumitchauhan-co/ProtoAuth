import { defineConfig } from 'vite';
import react from '@tailwindcss/vite'; // Assuming standard Vite 4+ ecosystem structure
import viteReact from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [viteReact(), react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rolldownOptions: {
            output: {
                manualChunks(id) {
                    // 1. Isolate React framework core so it loads independently
                    if (
                        id.includes('node_modules/react/') ||
                        id.includes('node_modules/react-dom/')
                    ) {
                        return 'framework-core';
                    }

                    // 2. Isolate navigation and routing frameworks
                    if (
                        id.includes('node_modules/react-router-dom') ||
                        id.includes('node_modules/@remix-run')
                    ) {
                        return 'framework-router';
                    }

                    // 3. Optional: Group heavy crypto/OIDC authentication clients if they are bottlenecking
                    if (
                        id.includes('node_modules/oidc-client-ts') ||
                        id.includes('node_modules/jose')
                    ) {
                        return 'auth-crypto-engine';
                    }

                    // 4. Group all remaining dependencies together
                    if (id.includes('node_modules')) {
                        return 'vendor-libs';
                    }
                },
            },
        },
    },
});
