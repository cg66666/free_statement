/*
 * @Description: file content
 * @Author: cg
 * @Date: 2023-09-16 19:34:11
 * @LastEditors: cg
 * @LastEditTime: 2025-01-02 14:08:10
 */
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: `/${env.VITE_PREFIX}/`,
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: Number(env.VITE_BASE_PORT),
      proxy: {
        '/statement': {
          target: env.VITE_BASE_URL, // 真实接口地址, 后端给的基地址
          changeOrigin: true // 允许跨域
        },
        '/SSO': {
          target: env.VITE_BASE_URL, // 真实接口地址, 后端给的基地址
          changeOrigin: true // 允许跨域
        }
      }
    },
    build: {
      outDir: 'free_statement'
    }
  };
});
