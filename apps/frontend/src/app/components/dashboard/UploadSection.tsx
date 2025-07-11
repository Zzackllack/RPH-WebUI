'use client';

import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Progress, Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

export function UploadSection() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
    const { status } = info.file;

    if (status === 'done') {
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <Upload
        accept=".zip"
        fileList={fileList}
        onChange={handleChange}
        customRequest={({ file, onProgress, onError, onSuccess }) => {
          const formData = new FormData();
          formData.append('file', file as RcFile);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/resourcepacks`);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setProgress(percent);
              onProgress?.({ percent });
            }
          };

          xhr.onload = () => {
            if (xhr.status === 201) {
              onSuccess?.(JSON.parse(xhr.response), xhr);
            } else {
              onError?.(new Error(`Upload failed with status ${xhr.status}`));
            }
          };
          xhr.onerror = () => onError?.(new Error('Network error'));
          xhr.send(formData);
        }}
      >
        <Button icon={<UploadOutlined />}>Click or Drag to Upload ZIP</Button>
      </Upload>

      {fileList.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Upload Progress</h4>
          <Progress percent={progress} />
        </div>
      )}
    </div>
  );
}
