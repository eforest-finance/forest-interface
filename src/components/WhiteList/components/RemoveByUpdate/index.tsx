import { Button, Col, Form, message, Row } from 'antd';
import { DraggerProps } from 'antd/lib/upload/Dragger';
import { useCallback } from 'react';
import UploadFile from '../UploadFile';
import { messageHTML } from 'utils/aelfUtils';

import { StrategyType } from 'store/reducer/saleInfo/type';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { parseCSV } from 'components/WhiteList/utils/parseCSV';
import { removeFromWhiteList } from 'components/WhiteList/hooks/managersAction';
import { useHideModal } from 'components/WhiteList/hooks/useHideModal';
import { IContractError } from 'contract/type';
import { uniqBy } from 'lodash-es';
import { getOriginalAddress } from 'utils';
import { DEFAULT_ERROR } from 'constants/errorMessage';

interface RemoveByUpdateProps {
  whitelistId?: string;
  policyType?: StrategyType;
  draggerProps?: DraggerProps;
}

export default function RemoveByUpdate({ whitelistId, draggerProps }: RemoveByUpdateProps) {
  const hideModal = useHideModal();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { whiteListInfo } = useDetailGetState();
  const { chainId } = whiteListInfo;
  const [form] = Form.useForm();
  const onFinish = useCallback(
    async (values: { address: File[] }) => {
      if (!whitelistId) {
        message.error('Whitelist not found');
        return;
      }
      const { address } = values ?? {};
      let strArr: string[] = [];

      try {
        const parseRes = await parseCSV({
          file: address[0].originFileObj,
        });
        strArr = parseRes as string[];
      } catch (e) {
        console.error(e);
      }

      try {
        const rmList = uniqBy(strArr, getOriginalAddress).filter((item) => !!item);
        if (!rmList?.length) {
          message.error('Please enter valid addresses');
          return;
        }
        const res = await removeFromWhiteList(
          {
            whitelistId,
            extraInfoList: {
              addressList: {
                value: rmList,
              },
            },
          },
          chainId,
        );
        if (res?.error) return message.error(res?.errorMessage?.message || DEFAULT_ERROR);
        if (res?.TransactionId) {
          messageHTML(res?.TransactionId, 'success', chainId);
        }
        form.resetFields();
        hideModal();
      } catch (error) {
        const resError = error as IContractError;
        message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
      }
    },
    [chainId, form, whitelistId],
  );
  return (
    <Form form={form} className="remove-whitelist-upload" onFinish={onFinish} autoComplete="off">
      <UploadFile {...draggerProps} />
      {isSmallScreen ? (
        <div className="form-button-wrapper flex">
          <Button type="default" onClick={() => hideModal()}>
            Return
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      ) : (
        <Row justify="center" gutter={16} className="form-button-wrapper">
          <Col>
            <Button type="primary" htmlType="submit">
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
  );
}
