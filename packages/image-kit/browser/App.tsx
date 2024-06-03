import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
} from '@arco-design/web-react';
import axios from 'axios';
import type sharp from 'sharp';
import { type ImageName, Image } from '../src/index';
import ImageUpload from './ImageUpload';

import './main.css';

const FormItem = Form.Item<sharp.ResizeOptions>;
const { Option } = Select;

const fitOptions = [
  'contain',
  'cover',
  'fill',
  'inside',
  'outside',
] as (keyof sharp.FitEnum)[];

const Index = () => {
  const [imageList, setImageList] = useState<string[]>([]);
  const [currentImageName, setCurrentImageName] = useState<ImageName>();
  const [resizeOptions, setResizeOptions] = useState<sharp.ResizeOptions>({});
  const [imageMetaData, setImageMetaData] = useState<sharp.Metadata | null>(
    null,
  );
  const [form] = Form.useForm<sharp.ResizeOptions>();

  useEffect(() => {
    // if (currentImageName) {
    // }
  }, [currentImageName]);

  const handleInit = (images: string[]) => {
    setImageList(images);
  };

  const handleSelectImage = async (imageName: string) => {
    setCurrentImageName(imageName as ImageName);
    const { data } = await axios.get(
      `http://localhost:3000/api/image/metadata?imageName=${imageName}`,
    );
    const metadata = data.metadata as sharp.Metadata;
    console.info('metadata', metadata);
    setImageMetaData(metadata);
    setResizeOptions({
      height: metadata.height,
      width: metadata.width,
    });
    form.setFieldsValue({
      height: metadata.height,
      width: metadata.width,
    });
  };

  const handleUseResizeEffect = async () => {
    axios
      .post('http://localhost:3000/api/image/resize', {
        ...resizeOptions,
        imageName: currentImageName,
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => console.error(error));
  };
  console.info(resizeOptions);

  return (
    <div className="flex justify-between divide-x">
      <div className="basis-1/12">
        <ImageUpload onInit={handleInit} />
        <ul className="flex flex-col border border-solid border-gray-400 rounded divide-y p-3">
          {imageList.map(imageName => (
            <li
              // className="border border-solid border-blue-300"
              onClick={() => handleSelectImage(imageName)}
              key={imageName}
            >
              {imageName}
            </li>
          ))}
        </ul>
      </div>
      <div className="basis-8/12">
        <div className="text-lg font-semibold text-center">预览</div>
        {currentImageName && <Image name={currentImageName} />}
      </div>
      <div className="flex basis-3/12 items-center justify-between flex-col">
        <div className="text-2xl">图片信息</div>
        {imageMetaData ? (
          <ul>
            <li>图片格式：{imageMetaData.format}</li>
            <li>图片大小：{imageMetaData.size} bytes</li>
            <li>高：{imageMetaData.height}</li>
            <li>宽：{imageMetaData.width}</li>
            <li>色彩空间：{imageMetaData.space}</li>
            <li>page：{imageMetaData.pages ?? '空'}</li>
          </ul>
        ) : (
          '暂无数据'
        )}
        <div className="">
          <div className="text-2xl">Resize</div>
          <Form
            onValuesChange={(_, values) => {
              console.info(values);
              setResizeOptions(values);
            }}
            onChange={() => {
              console.info('change');
            }}
            initialValues={resizeOptions}
            autoComplete="off"
            form={form}
          >
            <FormItem
              label="Height"
              field="height"
              rules={[{ required: true, type: 'number', min: 0, max: 99 }]}
            >
              <InputNumber
                min={0}
                suffix="px"
                step={1}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
            </FormItem>
            <FormItem
              label="Width"
              field="width"
              rules={[{ required: true, type: 'number', min: 0, max: 99 }]}
            >
              <InputNumber
                min={0}
                suffix="px"
                step={1}
                style={{ width: 160, margin: '10px 24px 10px 0' }}
              />
            </FormItem>
            <FormItem label="Fit" field="fit">
              <Select style={{ width: 154 }}>
                {fitOptions.map(option => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem label="Position" field="position">
              <Input />
            </FormItem>
            <Button
              onClick={handleUseResizeEffect}
              type="primary"
              style={{ marginRight: 24 }}
            >
              生效
            </Button>
          </Form>
          {/* <div className="flex">
            长：
            <input
              value={resizeOptions.height}
              onChange={v => handleLChange(v.target.value, 'height')}
              type="text"
            ></input>
          </div>
          <div className="flex">
            宽：
            <input
              value={lw.w}
              onChange={v => handleLChange(v.target.value, 'w')}
              type="text"
            ></input>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Index;
