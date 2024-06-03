import path from 'path';
import { fs, getPort } from '@modern-js/utils';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';

export const KitName = 'image-kit';

export const ASSETS_RELATIVE_PATH = `${KitName}-assets`;

export const createServer = async () => {
  // 启动 Node 服务
  const app = express();
  const port = await getPort(3000); // 你可以选择一个适合你的端口号
  app.use(async (req, res, next) => {
    console.info(`access url: ${req.url}`);
    next();
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 允许所有来源
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  });

  // 解析 application/json 类型的请求体
  app.use(express.json());

  // 解析 application/x-www-form-urlencoded 类型的请求体
  app.use(express.urlencoded({ extended: true }));

  const assetsAbsPath = path.join(process.cwd(), ASSETS_RELATIVE_PATH);
  const imageKitAbsPath = path.join(process.cwd(), `.${KitName}`);
  const imageDtsFileAbsPath = path.join(imageKitAbsPath, './image.d.ts');

  const findAllImageFilesName = async (dirPath: string) => {
    // 支持的图片格式
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

    // 读取目录下的所有文件和文件夹
    const files = await fs.readdir(dirPath);

    // 过滤出图片文件
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(imageFile => {
        const { name } = path.parse(imageFile);
        return name;
      });

    // 输出图片文件名称
    console.log('Image files:', imageFiles);
    return imageFiles;
  };

  const initAndUpdateImageDtsFile = async () => {
    const imageFileNames = await findAllImageFilesName(assetsAbsPath);
    const dtsContent = `import '${KitName}';

        interface MmAssetsImagesData {
            ${imageFileNames.map(name => `"${name}": {};`).join('\n')}
        }

        declare module '${KitName}' {
            interface AssetsImagesData extends MmAssetsImagesData {}
        }`;
    await fs.ensureFile(imageDtsFileAbsPath);
    await fs.writeFile(imageDtsFileAbsPath, dtsContent, 'utf-8');
  };

  const ensureFileName = async (
    absDir: string,
    fileName: string,
    count?: number,
  ): Promise<string> => {
    const { ext, name } = path.parse(fileName);
    if (typeof count === 'number') {
      if (await fs.pathExists(path.join(absDir, `${name} ${count}${ext}`))) {
        return ensureFileName(absDir, fileName, count + 1);
      } else {
        return `${name} ${count}${ext}`;
      }
    } else if (await fs.pathExists(path.join(absDir, fileName))) {
      return ensureFileName(absDir, fileName, 1);
    } else {
      return `${name}${ext}`;
    }
  };

  // // 设置 multer 存储配置
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      await fs.ensureDir(assetsAbsPath);
      cb(null, assetsAbsPath); // 图片上传后保存的目录
    },
    filename: async (req, file, cb) => {
      console.info(path.parse(file.originalname));
      const addedImageFileName = await ensureFileName(
        assetsAbsPath,
        file.originalname,
      );

      cb(null, addedImageFileName);
    },
  });

  const upload = multer({ storage });

  initAndUpdateImageDtsFile();

  app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (req.file) {
      await initAndUpdateImageDtsFile();
      const imageFileNames = await findAllImageFilesName(assetsAbsPath);
      res.status(200).json({
        message: 'Image uploaded successfully',
        file: req.file,
        images: imageFileNames,
      });
    } else {
      res.status(400).json({ message: 'Image upload failed' });
    }
  });

  app.get('/api/images', async (req, res) => {
    const imageFileNames = await findAllImageFilesName(assetsAbsPath);
    res
      .status(200)
      .json({ message: 'get all image files', images: imageFileNames });
  });

  app.post('/api/image/resize', async (req, res) => {
    console.info('api/image/resize', req.body);
    const { imageName, ...resizeOptions } = req.body as sharp.ResizeOptions & {
      imageName?: string;
    };
    if (!imageName) {
      res.status(500).json({
        message: 'imageName is empty',
      });
      return;
    }
    const imageFileAbsPath = path.join(assetsAbsPath, `${imageName}.jpg`);
    const originFileBuffer = await fs.readFile(imageFileAbsPath);
    console.info('imageFileAbsPath', imageFileAbsPath);
    try {
      await sharp(originFileBuffer)
        .resize(resizeOptions)
        .toFile(imageFileAbsPath);
      res.status(200).json({
        message: 'resize successfully',
      });
    } catch (e) {
      console.info(e);
      res.status(500).json({
        message: JSON.stringify(e),
      });
    }
  });

  app.get('/api/image/metadata', async (req, res) => {
    console.info('api/image/metadata', req.query);
    const { imageName } = req.query as {
      imageName?: string;
    };
    if (!imageName) {
      res.status(500).json({
        message: 'imageName is empty',
      });
      return;
    }
    const imageFileAbsPath = path.join(assetsAbsPath, `${imageName}.jpg`);
    const originFileBuffer = await fs.readFile(imageFileAbsPath);
    console.info('imageFileAbsPath', imageFileAbsPath);
    const metadata = await sharp(originFileBuffer).metadata();
    res.status(200).json({
      message: 'Successfully',
      metadata,
    });
  });

  app.get('/', (req, res) => {
    res.send('Node server is running');
  });
  return app.listen(port, () => {
    console.log(`Node server is listening on port ${port}`);
  });
};
