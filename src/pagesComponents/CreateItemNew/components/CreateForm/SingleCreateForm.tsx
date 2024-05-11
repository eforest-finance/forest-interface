import { Collapse, Divider, Form, Space } from 'antd';
import { CollectionSelect } from '../CollectionSelect';

import styles from './style.module.css';
import Input, { TextArea } from 'baseComponents/Input';
import Button from 'baseComponents/Button';
import BigNumber from 'bignumber.js';
import { externalLinkReg } from 'constants/common';
import { useState } from 'react';
import AddIcon from 'assets/images/icons/add.svg';
import EditIcon from 'assets/images/icons/edit.svg';
import { ModalForm } from './TraitsModal';

const { Panel } = Collapse;

const NUMBER_MAX = '9007199254740991';

interface ISingleCreateFormProps {
  optionsForCollection: any[];
  onCreateHandler: (values: any) => void;
}

function FormItemLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-y-2">
      <span className=" text-lg font-medium text-textPrimary">{title}</span>
      {!description ? null : <span className=" text-sm font-medium text-textSecondary">{description}</span>}
    </div>
  );
}

export function SingleCreateForm({ optionsForCollection, onCreateHandler }: ISingleCreateFormProps) {
  const [open, setOpen] = useState(false);

  const [singleCreateFormInstance] = Form.useForm();

  const [metaDataForEdit, setMetaDataForEdit] = useState<any>();

  const showEditMetaDataModal = () => {
    const metaData = singleCreateFormInstance.getFieldValue('metaData');
    console.log('showEditMetaDataModal', metaData);
    setMetaDataForEdit(metaData);
    setOpen(true);
  };

  const hideEditMetaDataModal = () => {
    setMetaDataForEdit([]);
    setOpen(false);
  };

  const onFinish = (values: any) => {
    console.log('Finish:', values);
  };

  return (
    <Form.Provider
      onFormFinish={(name, { values, forms }) => {
        console.log('onFormFinish', name, values, forms);
        if (name === 'metaDataForm') {
          const { basicForm } = forms;
          basicForm.setFieldsValue({
            metaData: values.metaData,
          });
          setOpen(false);
        }
      }}>
      <Form
        layout="vertical"
        size="large"
        form={singleCreateFormInstance}
        name="basicForm"
        className={styles['custom-form']}
        requiredMark={false}
        onFinish={(values) => {
          onCreateHandler?.(values);
        }}>
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

        <Form.Item
          label="Item name"
          name="tokenName"
          rules={[
            {
              required: true,
              message: 'Please input your item name',
            },
            {
              pattern: /^[A-Za-z0-9]+$/,
              message: 'Invalid name. Please enter only letters and numbers.',
            },
          ]}>
          <Input placeholder="Item name" maxLength={30} />
        </Form.Item>

        <Form.Item
          label={<FormItemLabel title="Quantity" description="The number of items that can be created." />}
          name="quantity"
          rules={[
            () => ({
              validator(_, value) {
                if (!value?.trim?.()) {
                  return Promise.reject(new Error('Please input your quantity'));
                }
                if (!/^[1-9][0-9]*$/.test(value)) {
                  return Promise.reject(new Error('Please enter a positive whole number'));
                }

                const bigValue = new BigNumber(value.trim());

                if (bigValue.gt(new BigNumber(NUMBER_MAX))) {
                  return Promise.reject(
                    new Error('Maximum limit exceeded for creating NFT items. Please enter a smaller number.'),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}>
          <Input placeholder="Quantity" maxLength={30} />
        </Form.Item>

        <Form.Item
          label={
            <FormItemLabel
              title="Token ID"
              description="Token ID is the unique identifier of item in protocol.It is required to fill in with numbers."
            />
          }
          name="tokenId"
          rules={[
            () => ({
              validator(_, value) {
                if (!value.trim()) {
                  return Promise.reject(new Error('Please input your tokenId'));
                }
                if (!/^[1-9][0-9]*$/.test(value)) {
                  return Promise.reject(new Error('Please enter a positive whole number'));
                }

                const bigValue = new BigNumber(value.trim());

                if (bigValue.gt(new BigNumber(999999))) {
                  return Promise.reject(new Error('Please enter a smaller number.'));
                }
                return Promise.resolve();
              },
            }),
          ]}>
          <Input placeholder="Token ID" max={999999} min={1} />
        </Form.Item>

        <Divider />

        <Collapse ghost>
          <Panel header="Advanced settings" key="1">
            <Form.Item
              label={
                <FormItemLabel
                  title="External link (Optional)"
                  description="Forest will include a link to this URL on this item's detail page, sthat users can click to learn more about it. You are welcome to link to your owiwebpage with more details."
                />
              }
              name="externalLink"
              rules={[
                {
                  pattern: externalLinkReg,
                  message: 'Invalid external link.',
                },
              ]}>
              <Input allowClear placeholder="http://yoursite.io/item/123" maxLength={100} />
            </Form.Item>

            <Form.Item
              label={
                <FormItemLabel
                  title="Description (Optional)"
                  description="The description will appear on the item detail page below its image. Markdown syntax is supported (Up to 1,000 characters)."
                />
              }>
              <TextArea
                maxLength={1000}
                className="resize-none"
                placeholder="Please provide a detailed description of your item."
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="flex justify-between items-center">
                  <FormItemLabel title="NFT Traits" description="Add the Traits of the NFT!" />
                  <Button
                    size="ultra"
                    className="h-14 w-14 !px-0 border-lineBorder !inline-flex !items-center !justify-center"
                    onClick={showEditMetaDataModal}>
                    <AddIcon className=" fill-textPrimary" />
                    <EditIcon className=" fill-textPrimary" />
                  </Button>
                </div>
              }
              shouldUpdate={(prevValues, curValues) => prevValues.metaData !== curValues.metaData}>
              {({ getFieldValue }) => {
                const metaData: any[] = getFieldValue('metaData') || [];
                console.log('metaData render', metaData);
                return metaData.length ? (
                  <ul className="flex gap-2 flex-wrap">
                    {metaData.map((trait, index) => (
                      <li
                        key={index}
                        className=" w-48 h-24 flex flex-col gap-y-1 items-center justify-center bg-fillHoverBg rounded-md">
                        <span className=" text-sm font-medium text-textSecondary">{trait.key} </span>
                        <span className=" text-lg font-medium text-textPrimary">{trait.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className=" text-textSecondary">No metaData yet.</span>
                );
              }}
            </Form.Item>
          </Panel>
        </Collapse>

        <div className="flex justify-end fixed bottom-0 left-0 right-0 p-4 border-0 border-t border-solid border-lineBorder bg-fillPageBg mdl:relative mdl:p-0 mdl:border-t-0">
          <Button type="primary" size="ultra" htmlType="submit" isFull={true} className="mdl:!w-44">
            Create
          </Button>
        </div>
      </Form>

      <ModalForm open={open} onCancel={hideEditMetaDataModal} defaultMetaData={metaDataForEdit} />
    </Form.Provider>
  );
}
