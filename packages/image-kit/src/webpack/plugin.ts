import path from 'path';
import type { Server } from 'http';
import { fs } from '@modern-js/utils';
import type { Compiler } from 'webpack';
import type { RsbuildInstance } from '@rsbuild/core';
import { startClient } from '../browser-run/run';
import { ASSETS_RELATIVE_PATH, createServer } from './server';

class DevModePlugin {
  private server: Server | null = null;

  private client: RsbuildInstance | null = null;

  private isInitialCompile: boolean = true;

  apply(compiler: Compiler): void {
    const isDev = compiler.options.mode === 'development';
    compiler.hooks.beforeCompile.tapAsync(
      'DevModePlugin',
      async (compiler, callback) => {
        if (isDev) {
          console.log('Webpack is running in development mode');

          const assetsPath = path.resolve(process.cwd(), ASSETS_RELATIVE_PATH);
          if (!fs.existsSync(assetsPath)) {
            fs.mkdirSync(assetsPath, { recursive: true });
            console.log('Assets directory created at:', assetsPath);
          }

          // 启动 Node 服务
          // 如果服务器已经启动，先关闭它
          if (this.isInitialCompile) {
            console.info('isInitialCompile');
            this.server = await createServer();
            this.client = await startClient({ assetsAbsPath: assetsPath });
            this.isInitialCompile = false;
          }
          //   if (this.server) {
          //     this.server.close(async () => {
          //       console.log('Previous server instance closed');
          //       this.server = await createServer();
          //     });
          //   } else {
          //     console.info('create server');
          //     this.server = await createServer();
          //   }
        }
        callback();
      },
    );
  }
}

export default DevModePlugin;
