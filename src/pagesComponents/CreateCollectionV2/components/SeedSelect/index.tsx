import type { SelectProps } from 'antd/es/select';
import { Select, Option } from 'baseComponents/Select';
import { Spin, Empty, Divider, message } from 'antd';
import { useJumpTSM } from 'hooks/useJumpTSM';
import Jump from 'assets/images/detail/jump.svg';
import { useRequest } from 'ahooks';
import { fetchAllChainSymbolList } from 'api/fetch';
import useGetState from 'store/state/getState';
import { useState } from 'react';
import { SupportedELFChainId } from 'constants/chain';
import clsx from 'clsx';
import ELFSVG from 'assets/images/elf.svg';
import styles from './style.module.css';

interface ISeedSelectProps extends SelectProps {
  options: any[];
  id?: string;
  disabledOnMainChain?: boolean;
  fetcherMySeeds?: (Keyword: string) => void;
  searching?: boolean;
}

interface ValueType {
  key?: string;
  label: React.ReactNode;
  value: string | number;
}

function EmptySeed({ searchKeyword }: { searchKeyword?: string }) {
  if (!searchKeyword) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No owned SEEDs were found." />;
  }

  return (
    <div className="flex flex-col gap-y-4 py-6 justify-center items-center">
      <span className="text-textSecondary text-sm">You do not own the SEED.</span>
    </div>
  );
}

export function SeedSelect({ id, onChange }: Omit<ISeedSelectProps, 'options'>) {
  const { walletInfo } = useGetState();
  const [keyword, setSearchKeyWord] = useState<string>('');

  const jumpTSM = useJumpTSM();
  const { data: options, loading } = useRequest(
    () => {
      if (!walletInfo.aelfChainAddress || !walletInfo.address)
        return Promise.resolve({
          items: [],
          totalCount: 0,
        });
      return fetchAllChainSymbolList({
        addressList: [walletInfo.aelfChainAddress, walletInfo.address],
        seedOwnedSymbol: keyword || '',
      });
    },
    {
      debounceLeading: true,
      debounceWait: 500,
      refreshDeps: [walletInfo.aelfChainAddress, walletInfo.address, keyword],
    },
  );

  return (
    <Select
      id={id}
      placeholder="Select a Collection's Symbol"
      popupClassName={styles['seed-select-popup']}
      optionLabelProp="value"
      labelInValue
      showSearch
      onSearch={setSearchKeyWord}
      notFoundContent={
        loading ? (
          <div className="h-20 flex justify-center items-center">
            <Spin size="small" />
          </div>
        ) : (
          <EmptySeed searchKeyword={keyword} />
        )
      }
      onChange={onChange}
      dropdownRender={(menu) => {
        return (
          <>
            {menu}
            <Divider className="!my-0" />
            <div
              className="flex py-2 items-center justify-center text-textPrimary text-sm font-medium cursor-pointer"
              onClick={() => jumpTSM('/')}>
              <span>Buy on Symbol Market</span>
              <Jump className="fill-textPrimary ml-2" />
            </div>
          </>
        );
      }}>
      {options?.items.map((option) => {
        const disabled = option.chainId !== SupportedELFChainId.MAIN_NET;
        return (
          <Option key={option.seedSymbol} value={option.symbol} disabled={disabled}>
            <div
              className="flex justify-between text-sm px-1 py-6"
              onClick={() => {
                if (!disabled) return;
                message.info(
                  'You need to transfer your SEED from the sidechain to the mainchain before it can be used to create an NFT Collection.',
                );
              }}>
              <span className={clsx(!disabled ? 'text-textPrimary' : 'text-textDisable', 'font-medium')}>
                {option.seedSymbol}
              </span>
              <span className={clsx(!disabled ? 'text-textSecondary' : 'text-textDisable')}>{option.symbol}</span>
              {!disabled ? (
                <span className="w-[140px]"></span>
              ) : (
                <span className="flex items-center text-textDisable">
                  SideChain {option.chainId}
                  <ELFSVG width="24" height="24" className="ml-2 opacity-60" />
                </span>
              )}
            </div>
          </Option>
        );
      })}
    </Select>
  );
}
