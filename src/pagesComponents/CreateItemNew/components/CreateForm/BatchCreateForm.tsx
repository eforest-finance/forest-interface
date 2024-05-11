import { Form, message } from 'antd';
import { CollectionSelect } from '../CollectionSelect';

import styles from './style.module.css';
import Button from 'baseComponents/Button';
import UploadMeta from '../Upload/UploadMeta';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { store, useSelector } from 'store/store';

interface IBatchCreateFormProps {
  optionsForCollection: any[];
  metadataList?: any[];
  onCreateHandler: (values: any) => void;
  onChangeMetaList: (data: any) => void;
  createLoading?: boolean;
}
export function BatchCreateForm({
  metadataList,
  optionsForCollection,
  onCreateHandler,
  onChangeMetaList,
  createLoading,
}: IBatchCreateFormProps) {
  const [form] = Form.useForm();
  const { login } = useCheckLoginAndToken();
  const { batchFiles } = useSelector((store) => store.createItem);

  const handleFormSubmit = () => {
    if (!metadataList?.length) {
      message.error('Please upload metadata');
      return;
    }

    for (let i = 0; i < batchFiles!.length; i++) {
      const nftItem = batchFiles![i];
      if (nftItem.error) {
        message.error('wrong data');
        return;
      }
    }
    form.submit();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      size="large"
      className={styles['custom-form']}
      requiredMark={false}
      onFinish={onCreateHandler}>
      <Form.Item
        label="Choose a collection"
        name="collectionId"
        tooltip="The current version of the NFT Collection which was created prior to the product upgrade does not have the batch creation functionality. Users are advised to switch to individual NFT creation mode to continue creating NFTs."
        rules={[
          {
            required: true,
            message: 'Please Choose a colleciton',
          },
        ]}>
        <CollectionSelect options={optionsForCollection} disabledOnMainChain={true} />
      </Form.Item>

      <Form.Item label="Upload Metadata">
        <UploadMeta onChange={onChangeMetaList} />
      </Form.Item>

      <div className="flex justify-end fixed bottom-0 left-0 right-0 p-4 border-0 border-t border-solid border-lineBorder bg-fillPageBg mdl:relative mdl:p-0 mdl:border-t-0">
        <Button
          type="primary"
          size="ultra"
          isFull
          className="mdl:!w-44"
          loading={createLoading}
          onClick={() => {
            login({
              callBack: handleFormSubmit,
            });
          }}>
          Create
        </Button>
      </div>
    </Form>
  );
}
