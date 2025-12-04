import { Input } from 'antd';
import { isValidNumber } from 'components/WhiteList/utils/reg';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { useDebounce, useSetState } from 'react-use';
import { IRangInputState } from 'store/types/reducer';

export interface IRangeInputProps {
  initState?: IRangInputState;
  onValueChange?: (value?: IRangInputState) => void;
}

const RangeInput = forwardRef(({ initState, onValueChange }: IRangeInputProps, ref) => {
  const [state, setState] = useSetState<IRangInputState>(initState);
  const minHandler = (value: string) => {
    if (value && !isValidNumber(value)) return;
    setState({ min: value });
  };

  const maxHandler = (value: string) => {
    if (value && !isValidNumber(value)) return;
    setState({ max: value });
  };

  const onSetState = useCallback(
    (value: IRangInputState) => {
      setState(value);
    },
    [setState],
  );
  const getState = useCallback(() => state, [state]);
  useImperativeHandle(ref, () => ({
    getState,
    onSetState,
  }));
  useDebounce(() => onValueChange?.(state), 300, [state]);
  return (
    <div className="flex items-center justify-between range-wrapper gap-[16px]">
      <Input placeholder="Min" value={state?.min} onChange={(e) => minHandler(e.target.value)} />
      <span className="text border border-solid border-[var(--line-box)] inline-block min-w-[16px]" />
      <Input placeholder="Max" value={state?.max} onChange={(e) => maxHandler(e.target.value)} />
    </div>
  );
});

export default RangeInput;
