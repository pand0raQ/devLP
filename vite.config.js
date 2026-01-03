import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                app1: resolve(__dirname, 'apps/app1/index.html'),
                app1Support: resolve(__dirname, 'apps/app1/support.html'),
                app1Privacy: resolve(__dirname, 'apps/app1/privacy.html'),
                app1Terms: resolve(__dirname, 'apps/app1/terms.html'),

                app2: resolve(__dirname, 'apps/app2/index.html'),
                app2Support: resolve(__dirname, 'apps/app2/support.html'),
                app2Privacy: resolve(__dirname, 'apps/app2/privacy.html'),
                app2Terms: resolve(__dirname, 'apps/app2/terms.html'),

                app3: resolve(__dirname, 'apps/app3/index.html'),
                app3Support: resolve(__dirname, 'apps/app3/support.html'),
                app3Privacy: resolve(__dirname, 'apps/app3/privacy.html'),
                app3Terms: resolve(__dirname, 'apps/app3/terms.html'),

                app4: resolve(__dirname, 'apps/app4/index.html'),
                app4Support: resolve(__dirname, 'apps/app4/support.html'),
                app4Privacy: resolve(__dirname, 'apps/app4/privacy.html'),
                app4Terms: resolve(__dirname, 'apps/app4/terms.html'),
            },
        },
    },
});
