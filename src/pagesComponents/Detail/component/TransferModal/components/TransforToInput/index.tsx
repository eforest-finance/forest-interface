import { Form, InputRef } from 'antd';
import Input from 'baseComponents/Input';
import FormItem from 'components/FormItem';
import { ReactNode, useEffect, useRef } from 'react';
import useGetState from 'store/state/getState';
import { InputProps } from 'baseComponents/Input/Input';

function TransferToInput(props: InputProps & { errorTip?: ReactNode }) {
  const input = useRef<InputRef | null>(null);

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  useEffect(() => {
    if (props?.errorTip && isSmallScreen) {
      document.getElementById('transferInput')?.scrollIntoView({ block: 'end' });
    }
  }, [isSmallScreen, props?.errorTip]);

  return (
    <div id="transferInput">
      <Form>
        <FormItem title="Transfer to" error={{ msg: props?.errorTip || '' }}>
          <Input
            ref={input}
            status={props.errorTip ? 'error' : ''}
            className="!mt-[16px]"
            size="large"
            allowClear
            placeholder="Please enter the recipient address"
            {...props}
          />
        </FormItem>
      </Form>
    </div>
  );
}

export default TransferToInput;
