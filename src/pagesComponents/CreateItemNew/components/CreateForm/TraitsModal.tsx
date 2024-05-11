import { useEffect, useRef } from 'react';

import Input from 'baseComponents/Input';
import Button from 'baseComponents/Button';

import { Form } from 'antd';
import Modal from 'baseComponents/Modal';
import type { FormInstance } from 'antd/es/form';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { metadata } from 'app/layout';

interface ModalFormProps {
  defaultMetaData: any[];
  open: boolean;
  onCancel: () => void;
}

const useResetFormOnCloseModal = ({ form, open }: { form: FormInstance; open: boolean }) => {
  const prevOpenRef = useRef<boolean>();
  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);
  const prevOpen = prevOpenRef.current;

  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};

export const ModalForm: React.FC<ModalFormProps> = ({ open, onCancel, defaultMetaData }) => {
  const [form] = Form.useForm();

  useResetFormOnCloseModal({
    form,
    open,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Add Traits"
      subTitle="Traits describe attributes of your item. They appear as filters inside your collection page and are also listed out inside your item page."
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
        <span className="flex-1">Trait</span>
        <span className="flex-1">Trait Parameters</span>
      </div>
      <Form
        form={form}
        layout="vertical"
        name="metaDataForm"
        initialValues={{
          metaData: !defaultMetaData?.length
            ? [
                {
                  key: '',
                  value: '',
                },
              ]
            : defaultMetaData,
        }}>
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
                  <MinusCircleOutlined className="ml-4 w-6 h-6 text-2xl mt-3" onClick={() => remove(name)} />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="text"
                  className=" !text-textPrimary !px-0 !inline-flex items-center text-lg font-medium"
                  onClick={() => add()}
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