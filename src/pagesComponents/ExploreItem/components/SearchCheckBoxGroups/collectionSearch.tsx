import { Checkbox, List } from 'antd';
import Input from 'baseComponents/Input';
import { useState } from 'react';
import styles from './style.module.css';
import ClockCircleOutlined from 'assets/images/explore/search-icon.svg';
import Clear from 'assets/images/explore/Clear.svg';
import VirtualList from 'rc-virtual-list';
import { formatTokenPrice } from 'utils/format';
import { sleep } from 'utils';
import { FilterKeyEnum, FilterType } from 'pagesComponents/ExploreItem/constant';
import { ImageEnhance } from 'components/ImgLoading';

function CollectionSearchCheckBoxGroups({ dataSource = [], values = [], onChange }: SearchCheckboxChoiceProps) {
  const [searchItems, setSearchItems] = useState<any[]>(dataSource.slice(0));
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLoading(true);
    const keyWord = (e.target as HTMLInputElement).value.trim().toLowerCase();
    let res = dataSource;
    if (keyWord) {
      res = dataSource.filter(
        (itm) =>
          String(itm.tokenName).toLowerCase().includes(keyWord) || String(itm.symbol).toLowerCase().includes(keyWord),
      );
    }
    await sleep(300);
    setSearchLoading(false);
    setSearchItems(res);
  };

  const toggleSelect = (value: string, checked: boolean) => {
    const index = values.findIndex((itm) => itm === value);
    let res = [...values];
    if (checked && index === -1) {
      res = values.concat(value);
    }
    if (!checked && index > -1) {
      res = values.slice(0, index).concat(values.slice(index + 1));
    }

    const data = dataSource
      ?.filter((item) => {
        return res.some((s) => s === item.id);
      })
      .map((itm) => ({ value: itm.id, label: itm.id }));

    onChange?.({
      [`${FilterKeyEnum.Collections}`]: {
        type: FilterType.Checkbox,
        data,
      },
    });
  };

  return (
    <List
      className={styles['search-list']}
      split={false}
      itemLayout="vertical"
      loading={searchLoading}
      locale={{
        emptyText: 'No such collection found',
      }}
      header={
        <Input
          size="medium"
          prefix={<ClockCircleOutlined />}
          allowClear={{ clearIcon: <Clear /> }}
          placeholder="Search"
          onChange={search}
        />
      }>
      {searchItems.length ? (
        <VirtualList data={searchItems} itemKey="value">
          {(item) => (
            <List.Item>
              <Checkbox
                className="w-full"
                key={item.id}
                value={item.id}
                checked={values.includes(item.id)}
                onChange={(e) => {
                  console.log('onChange', e.target.value, e.target.checked);
                  toggleSelect(e.target.value, e.target.checked);
                }}>
                <div className="flex gap-x-2 !w-[310px]">
                  <ImageEnhance src={item.logoImage} className="!w-12 !h-12" />
                  <div className="flex-1 flex flex-col gap-y-1">
                    <span className=" font-semibold mb-1 text-textPrimary">{item.tokenName}</span>
                    <div className="flex justify-between text-textSecondary text-xs">
                      <span>Floor: {formatTokenPrice(item.floorPrice)} ELF</span>
                      {/* <span>Amount: {formatTokenPrice(item.itemTotal)}</span> */}
                    </div>
                  </div>
                </div>
              </Checkbox>
            </List.Item>
          )}
        </VirtualList>
      ) : null}
    </List>
  );
}

export default CollectionSearchCheckBoxGroups;
