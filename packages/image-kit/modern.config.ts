import path from 'path';
import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

export default defineConfig({
  plugins: [moduleTools(), tailwindcssPlugin()],
  buildConfig: {
    buildType: 'bundleless',
    define: {
      BROWSER_DIR: path.join(__dirname, './browser'),
    },
    copy: {
      patterns: [
        {
          from: './src/browser',
          to: './browser',
          context: __dirname,
        },
      ],
    },
    externals: ['sharp'],
  },
});
