/* eslint-disable no-inline-styles/no-inline-styles */

import { Checkbox, MenuProps, Space } from 'antd';
import ELF from 'assets/images/ELF.png';
import Logo from 'components/Logo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getExploreLink, getOmittedStr, OmittedType } from 'utils';
import { DownOutlined } from '@ant-design/icons';
import Jump from 'assets/images/detail/jump.svg';
import qs from 'query-string';
import CloseOutlined from 'assets/images/explore/tag-close.svg';

import styles from './style.module.css';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { IActivitiesItem, IActivities, IFrom, ITo } from 'api/types';
import { fetchActivities } from 'api/fetch';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { MINUTES_PER_HOUR, MONTH_DAYS, TIME_FORMAT_24_HOUR, YEAR_MONTHS } from 'constants/time';
import Loading from 'components/Loading';
import CollapseForPC from 'components/Collapse';
import Table from 'baseComponents/Table';
import Dropdown from 'baseComponents/Dropdown';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import ActivityIcon from 'assets/images/v2/activity.svg';
import BurnIcon from 'assets/images/v2/table_burn.svg';
import CancelIcon from 'assets/images/v2/table_cancel.svg';
import DeleteIcon from 'assets/images/v2/table_delete.svg';
import IssueIcon from 'assets/images/v2/table_issue.svg';
import ListPriceIcon from 'assets/images/v2/table_listprice.svg';
import MakeOfferIcon from 'assets/images/v2/table_makeoffer.svg';
import TransferIcon from 'assets/images/v2/table_transfer.svg';
import SaleIcon from 'assets/images/v2/sale.svg';
import ClearIcon from 'assets/images/v2/clear_gray.svg';

import { Select } from 'antd';
const { Option } = Select;

export default function Activity(options: { rate: number }) {
  const { infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isMobile, isSmallScreen } = infoState;
  const { nftInfo } = detailInfo;
  const [page, setPage] = useState(0);
  const { rate } = options;
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [activitiesRes, setActivitiesRes] = useState<IActivities>({
    items: [],
    totalCount: 0,
  });
  const nav = useRouter();

  const [visible, setVisible] = useState(false);
  const [filterObj, setFilterObj] = useState<Record<string, boolean>>({
    Sale: true,
    ListWithFixedPrice: true,
  });

  const [tags, setTags] = useState<string[]>(['Sale', 'ListWithFixedPrice']);

  const activities = useMemo(() => {
    return activitiesRes.items;
  }, [activitiesRes.items]);

  const filterList: string[] = [
    'Issue',
    'Burn',
    'Transfer',
    'Sale',
    'ListWithFixedPrice',
    'DeList',
    'MakeOffer',
    'CancelOffer',
  ].concat(/SEED-*/.test(nftInfo?.nftSymbol || '') ? ['PlaceBid'] : []);

  const dropdownMenu: MenuProps | undefined = useMemo(() => {
    return {
      items: filterList.map((item) => {
        return {
          label: (
            <Checkbox
              className={styles['detail-activity-checkbox']}
              checked={filterObj[item]}
              onChange={(e) => onFilterChange(e.target.checked, item)}>
              {item}
            </Checkbox>
          ),
          key: item,
        };
      }),
    };
  }, [filterObj, filterList]);

  const getDateString = useCallback((timestamp: number) => {
    const duration = moment.duration(moment().valueOf() - timestamp);
    if (duration.asMinutes() < MINUTES_PER_HOUR) return `${duration.asMinutes().toFixed(0)} minutes ago`;
    if (duration.asHours() < TIME_FORMAT_24_HOUR) return `${duration.asHours().toFixed(0)} hours ago`;
    if (duration.asDays() < MONTH_DAYS) return `${duration.asDays().toFixed(0)} days ago`;
    if (duration.asMonths() < YEAR_MONTHS) return `${duration.asMonths().toFixed(0)} months ago`;
    return `${duration.asYears().toFixed(0)} years ago`;
  }, []);

  const getLogoUrl = (symbol: string) => {
    return symbol && symbol.toUpperCase() === 'ELF' ? ELF : '';
  };

  const getIconByType = (type: string) => {
    const iconMap = {
      Issue: <IssueIcon />,
      Burn: <BurnIcon />,
      Transfer: <TransferIcon />,
      Sale: <SaleIcon />,
      ListWithFixedPrice: <ListPriceIcon />,
      DeList: <DeleteIcon />,
      MakeOffer: <MakeOfferIcon />,
      CancelOffer: <CancelIcon />,
    };

    // ;
    return <span className="flex mr-[8px]">{iconMap[type] || null}</span>;
  };

  const columns = useMemo(
    () => [
      {
        title: 'Activity',
        width: isSmallScreen ? 120 : 200,
        dataIndex: 'type',
        render: (type: number) => (
          <p
            className={`flex items-center font-medium ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            {getIconByType(filterList[type])} {filterList[type]}
          </p>
        ),
      },
      {
        title: 'Quantity',
        dataIndex: 'amount',
        width: isSmallScreen ? 120 : 108,
        render: (text: string) => (
          <p
            className={`text-[var(--color-secondary)] font-medium ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            {text}
          </p>
        ),
      },
      {
        title: 'Price',
        width: 180,
        dataIndex: 'price',
        render: (text: string, record: IActivitiesItem) => {
          const usdPrice = record?.price * (rate || 1);
          return (
            <div className="text-textPrimary font-medium text-[14px] flex items-center overflow-x-auto h-full">
              <span
                className={`text-[var(--color-primary)]${
                  isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
                }`}>
                {formatTokenPrice(+text)}
              </span>
              <span
                className={`text-textPrimary font-medium ${
                  isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
                }`}>
                {record?.priceToken?.symbol}
              </span>
              <span className="text-textSecondary text-[12px]">({formatUSDPrice(Number(usdPrice))})</span>
            </div>
          );
        },
      },

      {
        title: 'From',
        dataIndex: 'from',
        width: isSmallScreen ? 120 : 200,
        render: (from: IFrom | null) => (
          <p
            className={`cursor-pointer text-[var(--brand-base)] font-medium from ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}
            onClick={() => from?.address && nav.push(`/account/${from?.address}#Collected`)}>
            {getOmittedStr(from?.name || '--', OmittedType.ADDRESS)}
          </p>
        ),
      },
      {
        title: 'To',
        dataIndex: 'to',
        width: isSmallScreen ? 120 : 192,
        render: (to: ITo | null) => (
          <>
            {to ? (
              <p
                className={`cursor-pointer text-[var(--brand-base)] font-medium from ${
                  isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
                }`}
                onClick={() => to?.address && nav.push(`/account/${to?.address}#Collected`)}>
                {getOmittedStr(to?.name || '', OmittedType.ADDRESS)}
              </p>
            ) : (
              '--'
            )}
          </>
        ),
      },
      {
        title: 'Date',
        key: 'date',
        dataIndex: 'timestamp',
        width: isSmallScreen ? 148 : 183,
        render: (timestamp: number, record: IActivitiesItem) => (
          <p
            className={`${styles.jump} text-[var(--color-primary)] font-medium from flex items-center ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            {getDateString(timestamp)}

            <a
              target="_blank"
              href={getExploreLink(record.transactionHash, 'transaction', nftInfo?.chainId)}
              rel="noreferrer">
              <div className="ml-[12px] w-[16px] h-[16px] cursor-pointer">
                <Jump />
              </div>
            </a>
          </p>
        ),
      },
    ],
    [getDateString, isMobile, isSmallScreen, nav, nftInfo?.chainId],
  );

  const handleTableScroll = (target: HTMLDivElement) => {
    if (target.id !== 'activity-table-wrap') return;
    const remainingDistance = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (remainingDistance < target.clientHeight) {
      if (loading || tableLoading) return;
      if (activities && activities?.length < activitiesRes.totalCount)
        if (activitiesRes?.items) {
          setTableLoading(true);
          setPage((v) => ++v);
        }
    }
  };

  const onFilterChange = (checked: boolean, item: string) => {
    setActivitiesRes({ items: [], totalCount: 0 });
    setFilterObj((v) => ({ ...v, [item]: checked }));
    setPage(0);
  };

  const getActivitiesList = async () => {
    if (!activitiesRes.items?.length) setLoading(true);
    try {
      const types = Object.keys(filterObj)
        .filter((key) => filterObj[key])
        .map((key) => filterList.findIndex((item) => item === key));

      const params = qs.stringify({
        nftInfoId: nftInfo?.id,
        types,
        skipCount: page * 100,
        maxResultCount: 100,
      });
      const result = await fetchActivities(params);
      setActivitiesRes((v) => ({
        items: (page && v?.items && v.items.concat(result?.items || [])) || result?.items,
        totalCount: result?.totalCount || 0,
      }));
    } catch (error) {
      /* empty */
    }
    setLoading(false);
    setTableLoading(false);
  };

  useEffect(() => {
    if (nftInfo?.id) {
      getActivitiesList();
    }
  }, [nftInfo?.id, filterObj, page]);

  return (
    <div id="activityWrap" className={`${styles.activity} ${isSmallScreen && styles['mobile-activity']}`}>
      <div className="flex justify-between items-center mb-[24px] flex-wrap">
        <h1 className="flex items-center text-[16px] font-medium">
          <ActivityIcon className="mr-[12px]" />
          Activity
        </h1>
        <div id="filter" className={`${styles.select} w-full lg:w-[320px] mt-[24px] lg:mt-0`}>
          <Select
            mode="multiple"
            value={tags}
            allowClear
            showArrow
            className="rounded-[12px] min-h-[48px] "
            clearIcon={<ClearIcon />}
            tagRender={(value: any) => {
              return (
                <div className={styles.tag}>
                  <span className="pl-[8px] pr-[4px]">{value.label}</span>
                  <ClearIcon
                    className=""
                    onClick={() => {
                      const newValues = tags.filter((tag) => tag !== value.label);
                      setActivitiesRes({ items: [], totalCount: 0 });
                      const newFilter = {} as any;
                      newValues.forEach((name: string) => {
                        newFilter[name] = true;
                      });
                      setFilterObj(newFilter);
                      setPage(0);
                      setTags(newValues);
                    }}
                  />
                </div>
              );
            }}
            style={{ width: '100%' }}
            optionLabelProp="label"
            popupClassName={styles.select}
            onChange={(value) => {
              setActivitiesRes({ items: [], totalCount: 0 });
              const newFilter = {} as any;
              value.forEach((name: string) => {
                newFilter[name] = true;
              });
              setFilterObj(newFilter);
              setPage(0);
              setTags(value);
            }}
            placeholder="Please select">
            {filterList.map((item, key) => (
              <Option key={key} value={item} label={item} className="bg-white">
                {item}

                {/* <Checkbox
                  className={styles['detail-activity-checkbox']}
                  checked={filterObj[item]}
                  // onChange={(e) => onFilterChange(e.target.checked, item)}
                >
                  {item}
                </Checkbox> */}
              </Option>
            ))}
          </Select>
          {/* <Dropdown
            trigger={['click']}
            overlayClassName={styles['detail-activity-dropdown']}
            menu={dropdownMenu}
            open={visible}
            onOpenChange={setVisible}>
            <div className={`filter flex justify-between`}>
              <p className="text-textPrimary">Filter</p>
              <DownOutlined />
            </div>
          </Dropdown> */}
        </div>
      </div>

      <div className="border-0">
        {/* {!!Object.keys(filterObj).filter((key) => filterObj[key]).length && (
          <div className={`${styles['filter-list']} flex px-[24px]`}>
            <Space wrap size={16}>
              {Object.keys(filterObj)
                .filter((key) => filterObj[key])
                .map((item) => (
                  <p className={`${styles['filter-item']} flex`} key={item}>
                    <span className={styles['filter-item__label']}> {item}</span>
                    <CloseOutlined onClick={() => onFilterChange(false, item)} />
                  </p>
                ))}
              <p
                className="px-[16px] py-[9px] text-sm font-medium text-[var(--text-item)] hover:text-textPrimary cursor-pointer"
                onClick={() => setFilterObj({})}>
                Clear All
              </p>
            </Space>
          </div>
        )} */}
        <div
          id="activity-table-wrap"
          className={`border-0 ${
            isSmallScreen ? 'max-h-[420px]' : 'max-h-[620px]'
          } rounded-bl-[12px] rounded-br-[12px] overflow-y-scroll`}
          onScrollCapture={(e) => handleTableScroll(e.target as HTMLDivElement)}>
          <Table
            rowKey={(record) => record.id}
            sticky={{
              offsetHeader: 0,
            }}
            emptyText={!tableLoading ? 'No activities yet' : ''}
            loading={false}
            columns={columns || []}
            scroll={{ x: 630, y: 620 }}
            pagination={false}
            dataSource={activities || []}
          />
          {tableLoading && (
            <div className="w-full py-[12px]">
              <Loading imgStyle="!h-[30px] !w-[30px]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
