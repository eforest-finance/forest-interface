import { Col, Form, Row, Button, message, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import { useCallback, useState } from 'react';
import CommonModal from '../CommonModal';
import CustomFormItem from '../CustomFormItem';
import { decodeAddress, encodeProtoToBase64, messageHTML } from 'utils/aelfUtils';
import { timesDecimals } from 'utils/calculate';
import Required from 'assets/images/required.svg';

import { ICustomizeAddTagFormItem, StrategyType } from 'store/reducer/saleInfo/type';
import useGetState from 'store/state/getState';
import { jsonToBase64 } from 'components/WhiteList/utils';
import priceTag from 'components/WhiteList/types/priceTag.json';
import { ADDRESS_MAX_LENGTH, DANGEROUS_CHARACTERS_REG } from 'constants/common';
import { addExtraInfo } from 'components/WhiteList/hooks/managersAction';
import { useHaveTagName } from 'components/WhiteList/hooks/useHaveTagName';
import React from 'react';
import { IContractError, IPrice } from 'contract/type';
import { DEFAULT_ERROR, MAX_ADDRESS_ERROR } from 'constants/errorMessage';

interface IAddUserLevelProps {
  whitelistId?: string;
  projectId?: string;
  onBack?: () => void;
  policyType?: StrategyType;
  chainId?: Chain;
  customizeAddTagFormItem?: ICustomizeAddTagFormItem[];
}

const { Item: FormItem } = Form;
function AddUserLevel({
  whitelistId,
  customizeAddTagFormItem,
  projectId,
  chainId,
  policyType,
  onBack,
}: IAddUserLevelProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>();

  const [tagName, setTagName] = useState<string>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const symbolList = [
    {
      decimals: 8,
      symbol: 'ELF',
    },
  ];

  const isHas = useHaveTagName(tagName);
  const onFinish = useCallback(
    async (values: { tagName?: string; address?: string; price: IPrice }) => {
      try {
        if (isHas.validateStatus === 'error' || isHas.validateStatus === 'validating') return;
        if (!whitelistId) {
          message.error('Whitelist not found');
          return;
        }
        if (!projectId) {
          message.error('Failed to retrieve the parameter project id');
          return;
        }
        const { address, tagName } = values ?? {};
        const strArr = address?.split(',');
        if (!tagName) {
          message.error('Failed to retrieve the parameter rank name');
          return;
        }
        const addressList = strArr?.reduce((prev: string[], addr: string) => {
          if (addr) return [...prev, addr];
          return prev;
        }, []);

        if (addressList && addressList?.length > ADDRESS_MAX_LENGTH) {
          return message.error('The maximum number of addresses can be added is 100.');
        }

        if (addressList) {
          for (let index = 0; index < addressList.length; index++) {
            const element = addressList[index];
            if (!decodeAddress(element)) {
              return message.error('invalid addresses.');
            }
          }
        }

        const tagInfo = { ...values };
        delete tagInfo.tagName;
        delete tagInfo.address;
        let tagInfoForm = '{}';
        if (policyType === StrategyType.Price) {
          const { symbol, amount } = tagInfo?.price ?? {};
          tagInfoForm = encodeProtoToBase64(priceTag, 'PriceTag', {
            symbol,
            amount: timesDecimals(amount, symbolList?.find((item) => item?.symbol === symbol)?.decimals).toFixed(),
          });
        } else {
          tagInfoForm = jsonToBase64(tagInfo);
        }

        setLoading(true);
        const res = await addExtraInfo({
          whitelistId: whitelistId ?? '',
          projectId: projectId || '',
          tagInfo: {
            tagName: tagName ?? '',
            info: tagInfoForm,
          },
          addressList: {
            value: addressList || [],
          },
        });

        setLoading(false);
        if (res?.error) return message.error(res?.errorMessage?.message || DEFAULT_ERROR);
        if (res?.TransactionId) {
          messageHTML(res?.TransactionId, 'success', chainId);
        }
        onBack?.();
      } catch (error) {
        setLoading(false);
        const resError = error as IContractError;
        message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
      }
    },
    [chainId, isHas.validateStatus, onBack, policyType, projectId, symbolList, whitelistId],
  );

  const PriceItemValid: Rule[] = [
    { required: true, message: '' },
    () => ({
      validator(_, value) {
        for (const key in value) {
          if (!value?.[key]) {
            return Promise.reject(new Error(``));
          }
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <CommonModal className="top-[100px]" title={'Add Rank'} leftCallBack={() => onBack?.()} closable={false}>
      <Form
        className="add-white-modal user-level add-rank"
        onValuesChange={(change) => {
          if (change?.tagName) setTagName(change?.tagName);
        }}
        name="add_white_modal"
        onFinish={onFinish}
        autoComplete="off">
        <FormItem
          className="pricing-policy-tag"
          name="tagName"
          label={
            <>
              Whitelist rank name
              <Required />
            </>
          }
          rules={[
            { required: true, message: '' },
            { pattern: DANGEROUS_CHARACTERS_REG, message: 'Invalid rank name' },
          ]}
          validateStatus={isHas.validateStatus}
          help={isHas.errorMsg}>
          <Input placeholder="Rank Name" />
        </FormItem>

        {policyType == StrategyType.Price && (
          <FormItem className="price" name="price" rules={PriceItemValid} label="Price">
            <CustomFormItem symbolList={symbolList} />
          </FormItem>
        )}
        {/* TODO */}
        {customizeAddTagFormItem?.map((node, index) => (
          <FormItem {...node} key={index}>
            {node?.customizeItem}
          </FormItem>
        ))}

        <FormItem name="address" label="Wallet address" rules={[{ required: false }]}>
          <Input.TextArea placeholder={MAX_ADDRESS_ERROR} className="add-whitelist-input add-whitelist-address" />
        </FormItem>

        {!isSmallScreen ? (
          <Row justify="center" gutter={16} className="form-button-wrapper">
            <Col>
              <Button loading={loading} type="primary" htmlType="submit">
                Save
              </Button>
            </Col>
            <Col>
              <Button type="default" onClick={() => onBack?.()}>
                Return
              </Button>
            </Col>
          </Row>
        ) : (
          <div className="form-button-wrapper flex">
            <Button type="default" onClick={() => onBack?.()}>
              Return
            </Button>
            <Button loading={loading} type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        )}
      </Form>
    </CommonModal>
  );
}

export default React.memo(AddUserLevel);
