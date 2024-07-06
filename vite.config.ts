import { defineConfig } from 'vite';
import fs from 'node:fs';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import data from './src/data';

export default defineConfig({
    server: {
        port: 5555,
        https: {
            key: fs.readFileSync('./.cert/key.pem'),
            cert: fs.readFileSync('./.cert/cert.pem'),
        },
    },
    plugins: [
        ViteEjsPlugin(
            {
                ...data,
            },
            {
                ejs: {
                    beautify: true,
                },
            }
        ),
    ],
});
