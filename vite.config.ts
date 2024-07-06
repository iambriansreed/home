import { defineConfig } from 'vite';
import fs from 'node:fs';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import data from './src/data';

data.skills.sort((a, b) => (a.progress > b.progress ? -1 : 1));
data.skillLevels.sort((a, b) => (a.id > b.id ? -1 : 1));

export default defineConfig({
    server: {
        port: 5555,
        host: '127.0.0.1',
        // https: {
        //     key: fs.readFileSync('./.cert/key.pem'),
        //     cert: fs.readFileSync('./.cert/cert.pem'),
        // },
    },
    preview: {
        port: 8080,
        host: '127.0.0.1',
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
