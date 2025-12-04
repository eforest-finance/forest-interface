import { useEffect, useRef } from 'react';

import Input from 'baseComponents/Input';
import Button from 'baseComponents/Button';

import { Form } from 'antd5/';
import Modal from 'baseComponents/Modal';
import type { FormInstance } from 'antd/es/form';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface ModalFormProps {
  defaultMetaData: any[];
  open: boolean;
  onCancel: () => void;
}

const useResetFormOnOpenOrCloseModal = ({
  form,
  open,
  defaultMetaData,
}: {
  form: FormInstance;
  open: boolean;
  defaultMetaData: any[];
}) => {
  const prevOpenRef = useRef<boolean>();
  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);
  const prevOpen = prevOpenRef.current;

  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
    if (open && !prevOpen) {
      form.setFieldsValue({
        metaData: !defaultMetaData?.length
          ? [
              {
                key: '',
                value: '',
              },
            ]
          : defaultMetaData,
      });
    }
  }, [form, prevOpen, open]);
};

export const ModalForm: React.FC<ModalFormProps> = ({ open, onCancel, defaultMetaData }) => {
  const [form] = Form.useForm();

  useResetFormOnOpenOrCloseModal({
    form,
    open,
    defaultMetaData,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Add Traits"
      subTitle="Traits represent the attributes of your item. They appear as filters on your collection page and are also listed on your item page."
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <div className="flex justify-center">
          <Button size="ultra" type="primary" className=" w-64" onClick={onOk}>
            Save
          </Button>
        </div>
      }>
      <div className="flex mb-4 gap-6 text-textPrimary font-semibold text-xl mr-10">
        <span className="flex-1">Trait Name</span>
        <span className="flex-1">Trait Parameters</span>
      </div>
      <Form form={form} layout="vertical" name="metaDataForm" autoComplete="off">
        <Form.List name="metaData">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className="flex">
                  <div className="flex-1 flex gap-x-6">
                    <Form.Item
                      {...restField}
                      className="flex-1"
                      name={[name, 'key']}
                      rules={[{ required: true, message: 'Missing trait key' }]}>
                      <Input placeholder={`Trait ${index + 1}`} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      className="flex-1"
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Missing trait value' }]}>
                      <Input placeholder={`Parameters ${index + 1}`} />
                    </Form.Item>
                  </div>
                  <MinusCircleOutlined
                    className="ml-4 w-6 h-6 text-xl mt-3 text-textSecondary"
                    onClick={() => remove(name)}
                  />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="text"
                  className=" !text-textPrimary !px-0 !inline-flex items-center text-lg font-medium"
                  onClick={add}
                  icon={<PlusCircleOutlined className=" text-2xl" />}>
                  Add Trait
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
