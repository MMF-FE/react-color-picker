import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import libInjectCss from './dev/libInjectCss'
import path from 'path'
import { name, dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh(), libInjectCss()],
    build: {
        // cssCodeSplit: true,
        // assetsInlineLimit: 6000,
        lib: {
            entry: path.resolve(__dirname, 'src/index.tsx'),
            name,
        },
        rollupOptions: {
            // 请确保外部化那些你的库中不需要的依赖
            external: [...Object.keys(dependencies)].filter(v => !['react-color-palette', 'react-linear-gradient-picker'].includes(v)),
            output: {
                exports: 'named',
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    react: 'react',
                    'react-dom': 'react-dom',
                    'prop-types': 'PropTypes'
                },
            },
        },
    },
})
