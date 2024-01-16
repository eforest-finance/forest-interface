/* eslint-disable no-inline-styles/no-inline-styles */

import { Form, Upload, UploadProps } from 'antd';
import { DraggerProps } from 'antd/lib/upload/Dragger';
import { useCallback, useMemo } from 'react';
import UploadIcon from 'assets/images/icons/upload.svg';
import useGetState from 'store/state/getState';

const { Dragger } = Upload;

interface UploadFileProps extends DraggerProps {
  name?: string;
  label?: string;
}

export default function UploadFile({ name = 'address', ...draggerProps }: UploadFileProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const props: UploadProps = {
    name: 'file',
    beforeUpload() {
      return false;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    ...draggerProps,
  };
  const normFile = useCallback(
    (
      e:
        | File[]
        | {
            fileList: File[];
          },
    ) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    },
    [],
  );

  const UploadFormat = useMemo(() => (isSmallScreen ? Upload : Dragger), [isSmallScreen]);

  return (
    <div>
      <Form.Item
        label="Upload"
        name={name}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '' }]}>
        <UploadFormat {...props} accept="text/csv" maxCount={1}>
          <div className="grid gap-y-[16px]">
            <p className="flex items-center justify-center">
              <UploadIcon />
            </p>
            <p className="text-[var(--color-secondary)] font-medium text-[14px]">
              {/* Drag files around, or <span className="text-[var(--brand-light)]">click</span> upload */}
              {`Click "Upload" or drag files here`}
            </p>
          </div>
        </UploadFormat>
      </Form.Item>
    </div>
  );
}
