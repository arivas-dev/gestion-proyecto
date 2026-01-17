import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Wayfinder se omite durante el build porque requiere PHP que no está disponible
// en la fase de build de Railway. Solo se usa en desarrollo local.
const shouldSkipWayfinder = 
    process.env.SKIP_WAYFINDER === 'true' || 
    process.env.NODE_ENV === 'production' ||
    process.env.CI === 'true';

export default defineConfig(async () => {
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
    ];

    // Solo agregar wayfinder en desarrollo local (cuando PHP está disponible)
    if (!shouldSkipWayfinder) {
        try {
            // Import dinámico para evitar que se ejecute durante el build
            const { wayfinder } = await import('@laravel/vite-plugin-wayfinder');
            plugins.push(wayfinder({
                formVariants: true,
            }));
        } catch (error) {
            // Ignorar si wayfinder no se puede cargar (PHP no disponible)
            console.warn('Wayfinder plugin skipped (PHP not available):', error);
        }
    }

    return {
        plugins,
        esbuild: {
            jsx: 'automatic',
        },
    };
});
