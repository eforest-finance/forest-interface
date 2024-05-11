import { Form } from 'antd';
import { CollectionSelect } from '../CollectionSelect';

import styles from './style.module.css';
import Button from 'baseComponents/Button';

interface IBatchCreateFormProps {
  optionsForCollection: any[];
  onCreateHandler: (values: any) => void;
}
export function BatchCreateForm({ optionsForCollection, onCreateHandler }: IBatchCreateFormProps) {
  return (
    <Form layout="vertical" size="large" className={styles['custom-form']} onFinish={onCreateHandler}>
      <Form.Item
        label="Choose a collection"
        name="collectionId"
        rules={[
          {
            required: true,
            message: 'Please Choose a colleciton',
          },
        ]}>
        <CollectionSelect options={optionsForCollection} />
      </Form.Item>

      <div className="flex justify-end fixed bottom-0 left-0 right-0 p-4 border-0 border-t border-solid border-lineBorder bg-fillPageBg mdl:relative mdl:p-0 mdl:border-t-0">
        <Button type="primary" size="ultra" htmlType="submit" isFull className="mdl:!w-44">
          Create
        </Button>
      </div>
    </Form>
  );
}
