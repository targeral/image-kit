// import { fileURLToPath } from 'node:url';
import path from 'path';
import { createRsbuild } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
import tailwindcss from 'tailwindcss';

const startClient = async ({ assetsAbsPath }: { assetsAbsPath: string }) => {
  console.info('start image-kit client');
  const browserDir = path.join(__dirname, '../../browser');
  const rsbuild = await createRsbuild({
    cwd: browserDir,
    rsbuildConfig: {
      source: {
        alias: {
          'image-kit/assets': assetsAbsPath,
        },
        entry: {
          index: './index.tsx',
        },
      },
      server: {
        port: 3001,
      },
      plugins: [pluginReact(), pluginLess()],
      tools: {
        bundlerChain: chain => {
          chain.ignoreWarnings([_ => true]);
        },
        postcss: {
          postcssOptions: {
            plugins: [
              tailwindcss({
                config: path.join(browserDir, './tailwind.config.ts'),
              }),
            ],
          },
        },
      },
    },
  });
  await rsbuild.startDevServer();
  return rsbuild;
};

export { startClient };
