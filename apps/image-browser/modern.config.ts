import path from 'path';
import { appTools, defineConfig } from '@modern-js/app-tools';
// import { bffPlugin } from '@modern-js/plugin-bff';
// import { expressPlugin } from '@modern-js/plugin-express';
import DevPlugin from 'image-kit/webpack-plugin';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  source: {
    alias: {
      'image-kit/assets': path.join(__dirname, './image-kit-assets'),
    },
    // include: [path.dirname(require.resolve('image-kit-comp'))],
  },
  runtime: {
    router: true,
  },
  plugins: [
    appTools({
      bundler: 'webpack', // Set to 'experimental-rspack' to enable rspack ⚡️🦀
      // bundler: 'experimental-rspack',
    }),
    // bffPlugin(),
    // expressPlugin(),
  ],
  tools: {
    webpack(_, { appendPlugins }) {
      console.info('asdfa');
      appendPlugins(new DevPlugin());
    },
  },
});
