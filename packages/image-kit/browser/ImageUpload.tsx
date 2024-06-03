// React 前端界面 - ImageUpload.js
import { useEffect, useState } from 'react';
import { Upload, Progress, Button, Space } from '@arco-design/web-react';
import { IconPlus, IconEdit } from '@arco-design/web-react/icon';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import axios from 'axios';

export interface Props {
  onInit?: (imageList: string[]) => void;
}

const ImageUpload = ({ onInit }: Props) => {
  const [selectedFile, setSelectedFile] = useState<UploadItem>();
  const cs = `arco-upload-list-item${
    selectedFile && selectedFile.status === 'error' ? ' is-error' : ''
  }`;

  const onFileUpload = () => {
    if (!selectedFile?.originFile) {
      return;
    }
    const formData = new FormData();
    console.info(selectedFile);
    formData.append('image', selectedFile.originFile, selectedFile.name);
    console.info(formData);
    axios
      .post('http://localhost:3000/api/upload', formData)
      .then(response => {
        onInit?.(response.data.images);
        console.log(response);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    const main = async () => {
      const resp = await axios.get('http://localhost:3000/api/images');
      const { images } = resp.data;
      onInit?.(images);
    };
    main();
  }, []);

  return (
    <div className="flex items-center justify-between flex-col">
      <Upload
        action="/"
        fileList={selectedFile ? [selectedFile] : []}
        showUploadList={false}
        onChange={(_, currentFile) => {
          if (currentFile.originFile) {
            setSelectedFile({
              ...currentFile,
              url: URL.createObjectURL(currentFile.originFile),
            });
          } else {
            console.error('currentFile.originFile 不存在');
          }
        }}
        onProgress={currentFile => {
          setSelectedFile(currentFile);
        }}
      >
        <div className={cs}>
          {selectedFile?.url ? (
            <div className="arco-upload-list-item-picture custom-upload-avatar">
              <img src={selectedFile.url} />
              <div className="arco-upload-list-item-picture-mask">
                <IconEdit />
              </div>
              {selectedFile.status === 'uploading' &&
                selectedFile.percent &&
                selectedFile.percent < 100 && (
                  <Progress
                    percent={selectedFile.percent}
                    type="circle"
                    size="mini"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                    }}
                  />
                )}
            </div>
          ) : (
            <div className="arco-upload-trigger-picture">
              <div className="arco-upload-trigger-picture-text">
                <IconPlus />
                <div style={{ marginTop: 10, fontWeight: 600 }}>Upload</div>
              </div>
            </div>
          )}
        </div>
      </Upload>
      <Space size="large">
        <Button onClick={onFileUpload} type="primary">
          保存图片
        </Button>
      </Space>
    </div>
  );
};

export default ImageUpload;
