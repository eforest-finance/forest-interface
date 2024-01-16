import { Button, Col, Form, Input, message, Row } from 'antd';
import { useCallback, useState } from 'react';
import UploadFile from '../UploadFile';
import CommonModal from '../CommonModal';
import TagSelect from '../TagSelect';
import { decodeAddress, messageHTML } from 'utils/aelfUtils';

import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { parseCSV } from 'components/WhiteList/utils/parseCSV';
import { ADDRESS_MAX_LENGTH } from 'constants/common';
import { addToWhiteList } from 'components/WhiteList/hooks/managersAction';
import { ADD_RM_TYPE, StrategyType } from 'store/reducer/saleInfo/type';
import { useHideModal } from 'components/WhiteList/hooks/useHideModal';
import { IContractError } from 'contract/type';
import { getOriginalAddress } from 'utils';
import { uniqBy } from 'lodash-es';
import { DEFAULT_ERROR, MAX_ADDRESS_ERROR } from 'constants/errorMessage';

export default function AddWhiteList() {
  const hideModal = useHideModal();
  const { infoState } = useGetState();
  const { whiteListInfo: whiteListInfoStore, modalAction } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { chainId, whitelistInfo } = whiteListInfoStore;
  const { modalState } = modalAction;
  const { addType, leftCallBack, draggerProps } = modalState || {};

  const [loading, setLoading] = useState<boolean>();
  const [form] = Form.useForm();

  const onFinish = useCallback(
    async (values: { address?: string | File[]; tagId?: string }) => {
      try {
        if (!whitelistInfo?.whitelistHash) {
          message.error('Whitelist not found');
          return;
        }
        const { address, tagId } = values ?? {};
        let strArr: string[] = [];
        if (typeof address === 'string') {
          strArr = address?.split(',');
        } else {
          const parseRes = await parseCSV({
            file: address?.[0].originFileObj,
          });

          strArr = parseRes as string[];
        }

        const addressList = uniqBy(strArr, getOriginalAddress).filter((item) => !!item);
        if (!addressList?.length) {
          message.error('Please enter valid addresses');
          return;
        }
        if (addressList?.length > ADDRESS_MAX_LENGTH) {
          return message.error('The maximum number of addresses can be added is 100.');
        }

        for (const key in addressList) {
          if (!decodeAddress(addressList[key])) {
            return message.error('invalid addresses.');
          }
        }

        try {
          setLoading(true);
          const res = await addToWhiteList(
            {
              whitelistId: whitelistInfo?.whitelistHash ?? '',
              extraInfoList: {
                addressList: {
                  value: addressList,
                },
                id: tagId,
              },
            },
            chainId,
          );
          setLoading(false);
          if (res?.error) return message.error(res?.errorMessage?.message || DEFAULT_ERROR);
          if (res?.TransactionId) {
            messageHTML(res?.TransactionId, 'success', chainId);
          }
          form.resetFields();
          hideModal();
        } catch (error) {
          const resError = error as IContractError;
          setLoading(false);
          return message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
        }
      } catch (error) {
        message.error('Submission failed');
      }
    },
    [chainId, form, hideModal, whitelistInfo?.whitelistHash],
  );

  return (
    <CommonModal
      closable={false}
      leftCallBack={() => {
        hideModal({ callback: () => leftCallBack?.() });
      }}
      {...modalState}
      onCancel={(e) => {
        hideModal({ callback: () => modalState?.onCancel?.(e) });
      }}>
      <Form
        form={form}
        className="add-white-modal grid gap-y-[40px] add-rank"
        name="add_white_modal"
        onFinish={onFinish}
        autoComplete="off">
        {whitelistInfo?.strategyType !== StrategyType.Basic && (
          <Form.Item name="tagId" label="Whitelist rank name" rules={[{ required: true, message: '' }]}>
            <TagSelect />
          </Form.Item>
        )}

        {(!addType || addType === ADD_RM_TYPE.Alone) && (
          <Form.Item name="address" label="Wallet address" rules={[{ required: true, message: '' }]}>
            <Input.TextArea placeholder={MAX_ADDRESS_ERROR} className="add-whitelist-input add-whitelist-address" />
          </Form.Item>
        )}
        {(!addType || addType === ADD_RM_TYPE.Batch) && (
          <Form.Item label="">
            <UploadFile {...draggerProps} />
          </Form.Item>
        )}
        {isSmallScreen ? (
          <div className="form-button-wrapper flex">
            <Button type="default" onClick={() => hideModal()}>
              Return
            </Button>
            <Button loading={loading} type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        ) : (
          <Row justify="center" gutter={16} className="form-button-wrapper">
            <Col>
              <Button loading={loading} type="primary" htmlType="submit">
                Save
              </Button>
            </Col>
            <Col>
              <Button type="default" onClick={() => hideModal()}>
                Return
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    </CommonModal>
  );
}
