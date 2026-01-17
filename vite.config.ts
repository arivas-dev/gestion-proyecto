import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Solo agregar wayfinder si no estamos en modo build sin PHP (Railway)
// Durante el build, wayfinder intenta ejecutar PHP que no está disponible
const shouldSkipWayfinder = process.env.SKIP_WAYFINDER === 'true';

const plugins = [
    laravel({
        input: ['resources/css/app.css', 'resources/js/app.tsx'],
        ssr: 'resources/js/ssr.tsx',
        refresh: true,
    }),
    react({
        babel: {
            plugins: ['babel-plugin-react-compiler'],
        },
    }),
    tailwindcss(),
    ...(shouldSkipWayfinder ? [] : [wayfinder({
        formVariants: true,
    })]),
];

export default defineConfig({
    plugins,
    esbuild: {
        jsx: 'automatic',
    },
});
