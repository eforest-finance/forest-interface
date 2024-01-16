import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Select, Option } from 'baseComponents/Select';
import { useDebounce } from 'react-use';
import { elementScrollToView } from 'utils/scrollIntoView';

export interface ISelectRequestConfig {
  searchText?: string;
  page?: number;
  pageSize?: number;
}

export interface IOptionItem {
  value: string;
  label: string;
  [key: string]: any;
}

interface ISelectSearchProps {
  className?: string;
  value?: any;
  placeholder?: string;
  style?: React.CSSProperties;
  defaultOptions?: Array<IOptionItem>;
  onSelect: (value: string, item?: any) => void;
  requestList?: (config: ISelectRequestConfig) => Promise<{
    total: number;
    items: Array<IOptionItem>;
  } | null>;
}

const Total = 10;
const debounceTime = 500;

const SelectSearch = (props: ISelectSearchProps) => {
  const { value, onSelect, requestList, className, placeholder, defaultOptions } = props;
  const [total, setTotal] = useState<number>(Total);
  const [data, setData] = useState<IOptionItem[]>(defaultOptions || []);

  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const fetchData = async (config: ISelectRequestConfig) => {
    setLoading(true);
    const { total = 0, items = [] } = (await requestList?.(config)) || {};
    setData(items);
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    if (defaultOptions?.length) {
      setData(defaultOptions);
    }
  }, [defaultOptions]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.persist();
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    return scrollHeight - scrollTop === clientHeight;
  };

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (handleScroll(e) && data.length < total) {
      const newPage = page + 1;
      setPage(newPage);
      fetchData({
        searchText,
        page: newPage,
      });
    }
  };

  const onSearchInputChange = (text: string) => {
    setSearchText(text);
    setPage(0);
    setData([]);
    setTotal(0);
  };

  useDebounce(
    () => {
      fetchData({
        searchText,
        page,
      });
    },
    debounceTime,
    [searchText],
  );

  const renderOptions = data?.map((item) => {
    return (
      <Option value={item.value} key={item.value} label={item.label}>
        {item.label}
      </Option>
    );
  });

  const handleSelect = (value: string) => {
    const selectItem = data.find((item) => item.value === value);
    onSelect(value, selectItem);
  };

  return (
    <Select
      className={className}
      showSearch
      style={props.style}
      onSearch={onSearchInputChange}
      notFoundContent={loading ? <Spin size="small" /> : ''}
      placeholder={placeholder}
      onPopupScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        handlePopupScroll(e);
      }}
      getPopupContainer={(v) => v}
      searchValue={searchText}
      filterOption={false}
      value={value}
      onFocus={(e) => {
        console.log(e);
        elementScrollToView(e.target);
      }}
      onSelect={handleSelect}>
      {renderOptions}
    </Select>
  );
};
export default React.memo(SelectSearch);
