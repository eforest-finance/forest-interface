import { useSize } from 'ahooks';
import { Form, InputRef, Popover } from 'antd';
import Input from 'baseComponents/Input';
import FormItem from 'components/FormItem';
import { ReactNode, useRef, useState } from 'react';
import useGetState from 'store/state/getState';
import styles from './index.module.css';
import { InputProps } from 'baseComponents/Input/Input';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';

function TransferToInput(props: InputProps & { errorTip?: ReactNode; onClickAddress: any }) {
  const [open, setOpen] = useState(false);

  const size = useSize(document.getElementById('transferInput'));

  const input = useRef<InputRef | null>(null);

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const {
    walletInfo: { aelfChainAddress },
  } = useGetState();

  const address = () => {
    return (
      <div
        className="cursor-pointer text-[14px] leading-[22px] font-normal hover:bg-[var(--fill-hover-bg)] text-[var(--text-primary)] active:text-[var(--brand-normal)] px-[12px] py-[13px]"
        onClick={() => {
          props?.onClickAddress(addPrefixSuffix(aelfChainAddress || '', 'AELF'));
          setOpen(false);
        }}>
        <p className="font-medium">My Address</p>
        <p>
          {!isSmallScreen
            ? addPrefixSuffix(aelfChainAddress || '', 'AELF')
            : getOmittedStr(addPrefixSuffix(aelfChainAddress || '', 'AELF'), OmittedType.ADDRESS)}
        </p>
      </div>
    );
  };

  return (
    <div id="transferInput">
      <Form>
        <FormItem title="Transfer to" error={{ msg: props?.errorTip || '' }}>
          <Popover
            open={open && !!aelfChainAddress && !props.value}
            placement="bottom"
            content={address}
            showArrow={false}
            destroyTooltipOnHide={false}
            overlayStyle={{ width: size?.width, paddingTop: '4px' }}
            overlayInnerStyle={{
              boxShadow: 'none',
              borderRadius: '6px',
              border: '1px solid var(--line-border)',
              backgroundColor: 'var(--bg-menu)',
              padding: '4px 0px',
              maxHeight: '214px',
            }}
            overlayClassName={styles['transfer-input-popover']}>
            <Input
              ref={input}
              status={props.errorTip ? 'error' : ''}
              className="!mt-[16px]"
              size="large"
              allowClear
              placeholder="Please enter the recipient address"
              onFocus={() => {
                setOpen(true);
              }}
              {...props}
            />
          </Popover>
        </FormItem>
      </Form>
    </div>
  );
}

export default TransferToInput;
