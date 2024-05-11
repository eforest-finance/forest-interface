import { Collapse, Divider, Form, Typography } from 'antd5/';
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
import { setNFTName, setTokenId } from 'store/reducer/create/item';
import { store } from 'store/store';
import ClearIcon from 'assets/images/explore/tag-close.svg';
import Arrow from 'assets/images/icon/arrow.svg';
import clsx from 'clsx';

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

  const uniqueMetaData = (targetMetaData: any[]) => {
    const resArr: any[] = [];

    const keysCountMap: {
      [key: string]: number;
    } = {};
    targetMetaData.forEach((itm: any) => {
      if (!keysCountMap[itm.key]) {
        keysCountMap[itm.key] = 1;
      } else {
        keysCountMap[itm.key] += 1;
      }
    });
    targetMetaData.forEach((itm) => {
      if (keysCountMap[itm.key] === 1) {
        resArr.push(itm);
      }
      if (keysCountMap[itm.key] > 1) {
        keysCountMap[itm.key] = keysCountMap[itm.key] - 1;
      }
    });

    return resArr;
  };

  return (
    <Form.Provider
      onFormFinish={(name, { values, forms }) => {
        console.log('onFormFinish', name, values, forms);
        if (name === 'metaDataForm') {
          const { basicForm } = forms;

          const targetMetaData = values.metaData.map((itm: any) => ({ key: itm.key, value: itm.value }));
          const resMetaData = uniqueMetaData(targetMetaData);

          basicForm.setFieldsValue({
            metaData: resMetaData,
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
        onValuesChange={(changedValues) => {
          if (!!changedValues.tokenId) {
            store.dispatch(setTokenId(changedValues.tokenId));
          }
          if (!!changedValues.tokenName) {
            store.dispatch(setNFTName(changedValues.tokenName));
          }
        }}
        onFinish={(values) => {
          onCreateHandler?.(values);
        }}>
        <Form.Item
          label="Choose a collection for the NFT"
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
              description="Token ID is the unique identifier of an item in the protocol. It is required to fill it in with numbers."
            />
          }
          name="tokenId"
          rules={[
            () => ({
              validator(_, value) {
                if (!value?.trim?.()) {
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

        <Collapse
          ghost
          expandIcon={({ isActive }) => (
            <span className={clsx(styles['arrow-icon-custom'], isActive ? '-rotate-180' : 'rotate-0')}>
              <Arrow />
            </span>
          )}>
          <Panel header="Advanced settings" key="1">
            <Form.Item
              label={
                <FormItemLabel
                  title="External link (Optional)"
                  description="Forest will display the link on the item's detail page, enabling users to access more information with a simple click. It is recommended to provide a link to a webpage that contains detailed information about your project."
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
                  description="The description will be displayed at the item's details page under its image. Markdown syntax is supported."
                />
              }
              name="description">
              <TextArea
                maxLength={1000}
                className="resize-none"
                placeholder="Please provide a detailed description of your item."
              />
            </Form.Item>

            {/* Create a hidden field to make Form instance record this */}
            <Form.Item name="metaData" hidden />
            <Form.Item
              label={
                <div className="flex w-full justify-between items-center">
                  <FormItemLabel title="NFT Traits" description="Add traits to your NFT!" />
                  <Button
                    size="ultra"
                    className="h-14 w-14 !px-0 border-lineBorder !inline-flex !items-center !justify-center"
                    onClick={showEditMetaDataModal}>
                    {!!singleCreateFormInstance.getFieldValue?.('metaData')?.length ? (
                      <EditIcon className=" fill-textPrimary" />
                    ) : (
                      <AddIcon className=" fill-textPrimary" />
                    )}
                  </Button>
                </div>
              }
              shouldUpdate={(prevValues, curValues) => prevValues.metaData !== curValues.metaData}>
              {({ getFieldValue }) => {
                const metaData: any[] = getFieldValue('metaData') || [];
                return metaData.length ? (
                  <ul className="flex gap-2 flex-wrap">
                    {metaData.map((trait, index) => (
                      <li
                        key={index}
                        className=" relative w-48 h-24 flex flex-col gap-y-1 items-center justify-center bg-fillHoverBg rounded-md">
                        <Typography.Text ellipsis={true} className=" px-2 text-sm font-medium text-textSecondary ">
                          {trait.key}
                        </Typography.Text>
                        <Typography.Text ellipsis={true} className=" px-2 text-lg font-medium text-textPrimary ">
                          {trait.value}
                        </Typography.Text>

                        <ClearIcon
                          className=" absolute right-2 top-2 cursor-pointer"
                          onClick={() => {
                            metaData.splice(index, 1);
                            singleCreateFormInstance.setFieldsValue({
                              metaData,
                            });
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null;
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
