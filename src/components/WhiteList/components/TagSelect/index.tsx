import { Form, Select, SelectProps } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import useDetailGetState from 'store/state/detailGetState';
import { store } from 'store/store';
import { setWhiteListInfo } from 'store/reducer/saleInfo/whiteListInfo';
import { fetchTagInfoListById } from 'components/WhiteList/hooks/useTagInfoList';
import { AllTagItem } from 'store/reducer/saleInfo/type';

interface ITagSelectProps extends SelectProps {
  className?: string;
  required?: boolean;
  showAll?: boolean;
  label?: string;
}

export default function TagSelect({
  className,
  value,
  required,
  onChange,
  label,
  showAll = false,
  ...props
}: ITagSelectProps) {
  const { whiteListInfo: whiteListInfoStore } = useDetailGetState();
  const { whitelistInfo, chainId, tagInfoList } = whiteListInfoStore;
  const fetchTagInfoList = useCallback(async () => {
    try {
      if (!whitelistInfo?.whitelistHash) return;
      const res:
        | {
            value?: string | null;
            label?: string | null;
          }[]
        | undefined = await fetchTagInfoListById({
        whitelistId: whitelistInfo?.whitelistHash,
        projectId: whitelistInfo?.projectId,
        chainId,
      });
      store.dispatch(setWhiteListInfo({ tagInfoList: res }));
    } catch (error) {
      console.debug(error, '====error');
    }
  }, [whitelistInfo?.whitelistHash, whitelistInfo?.projectId, chainId]);
  useEffect(() => {
    fetchTagInfoList();
  }, [fetchTagInfoList]);
  const selectOption = useMemo(() => {
    if (!showAll) return tagInfoList;
    return [AllTagItem, ...(tagInfoList ?? [])];
  }, [showAll, tagInfoList]);
  return (
    <Form.Item
      name="tagId"
      label={label}
      className="!mb-0"
      rules={[{ required: required, message: 'Please select a tag.' }]}>
      <Select
        {...props}
        className={`add-whitelist-tag ${className}`}
        getPopupContainer={(props) => props?.parentNode ?? document.body}
        options={selectOption ?? []}
        onChange={onChange}
        defaultValue={value ? value : showAll ? AllTagItem.value : value}
        value={value ? value : showAll ? AllTagItem.value : value}
      />
    </Form.Item>
  );
}
