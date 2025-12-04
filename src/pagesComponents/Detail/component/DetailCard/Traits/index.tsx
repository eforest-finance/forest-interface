import UlIcon from 'assets/images/v2/ul.svg';
import HonourLabel, { HonourTypeEnum, stylesMap } from 'baseComponents/HonourLabel';
import { useCallback } from 'react';
import useTraits, { CollectionType } from './useTraits';
import ELF from 'assets/images/elf.svg';
import useDetailGetState from 'store/state/detailGetState';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import { Tooltip } from 'antd';

function sortRule(a: any, b: any) {
  return a[3]?.split('%')[0] * 1 - b[3]?.split('%')[0] * 1;
}

const Traits = () => {
  const { isSmallScreen } = useSelector(selectInfo);
  const { traitsType, traitsData, noTraits } = useTraits();

  const sortTraitsData = traitsType !== CollectionType.SEED ? traitsData.sort(sortRule) : traitsData;

  const { detailInfo } = useDetailGetState();

  const { nftTraitInfos, nftInfo, nftRankingInfos } = detailInfo;

  const router = useRouter();

  // nftTraitInfos?.generation

  const goToItems = (key: string, value: string) => {
    nftInfo?.nftCollection?.id && router.push(`/explore-items/${nftInfo?.nftCollection?.id}?traits=${key}-${value}`);
  };

  const NormalTrait = useCallback(
    ({ data }) => {
      const [key, value] = data;
      return (
        <div className="text-[14px] mb-[8px] border-lineBorder h-[48px] w-full lg:w-[535px] flex items-center  justify-between rounded-lg border border-solid py-[13px] px-[24px] ">
          <span>{key}</span>
          <span>{value}</span>
          {/* <span>
          Nature Breath <span>(1.28%)</span>
        </span> */}
        </div>
      );
    },
    [nftInfo?.nftCollection?.id, router],
  );

  const RarityTrait = useCallback(({ text }: { text: string }) => {
    // const text = 'Emerald,4,II';
    const name = text.split(',')[0];

    let styleColor = undefined;
    for (const honourName in stylesMap) {
      if (text.includes(honourName)) {
        styleColor = stylesMap[honourName as any as HonourTypeEnum];
      }
    }

    return (
      <div
        className={`${styleColor} text-[14px] border border-solid  h-[48px] w-full lg:w-[535px] flex items-center  justify-between rounded-lg  py-[13px] px-[24px]  mb-[8px]`}>
        <span className={`text-rarity${name}`}>Rarity</span>
        <span className="flex items-center">
          <HonourLabel className="!border-0 !text-[14px]" text={text || ''} theme="white" />
          {/* <span className="text-textSecondary text-[12px]">(1.28%)</span> */}
        </span>
      </div>
    );
  }, []);

  const ColorTrait = useCallback(({ data }) => {
    const [key, price, value, percent, option] = data;
    return (
      <div
        className={`bg-[${option[0]}] text-[14px]  h-[48px] w-full lg:w-[535px] flex items-center  rounded-lg  py-[13px] px-[24px] mb-[8px] cursor-pointer`}
        style={{
          backgroundColor: option[0],
        }}>
        <span
          style={{
            color: option[1],
          }}
          className={`text-[${option[1]}] lg:w-[120px]`}>
          {key}
        </span>
        {!isSmallScreen && (
          <>
            {price !== '--' && (
              <Tooltip title="The lowest listing price of items with this attribute.">
                <span className="text-[14px] flex justify-start font-medium text-textPrimary max-w-[120px]">
                  <ELF className="w-[16px] mr-[4px]" />
                  {price}
                </span>
              </Tooltip>
            )}
          </>
        )}

        <span className="flex items-center justify-end ml-auto">
          {value}
          <Tooltip title="The percentage of items with this attribute out of the total quantity.">
            <span className="text-textSecondary text-[12px]">({percent})</span>
          </Tooltip>
        </span>
      </div>
    );
  }, []);

  const renderTraitsByType = () => {
    switch (traitsType) {
      case CollectionType.SGR:
        return (
          <>
            {nftInfo?.describe && <RarityTrait text={nftInfo?.describe || ''} />}
            <NormalTrait data={['Generation', nftTraitInfos?.generation]} />

            <div className="">
              {sortTraitsData.map((data, key) => {
                return <ColorTrait key={key} data={data} />;
              })}
            </div>
          </>
        );

      case CollectionType.SEED:
        return (
          <>
            {sortTraitsData.map((data, key) => {
              return <NormalTrait key={key} data={data} />;
            })}
          </>
        );

      case CollectionType.NORMAL:
        return (
          <>
            {sortTraitsData.map((data, key) => {
              return <ColorTrait key={key} data={data} />;
            })}
          </>
        );

      default:
        break;
    }
  };

  if (noTraits) {
    return null;
  }

  return (
    <div>
      <h1 className="flex items-center font-medium text-textPrimary text-[16px] my-[24px]">
        <UlIcon className="mr-[12px]" /> Traits
      </h1>
      <div className="w-full md:max-h-[384px] lg:max-h-[384px] overflow-x-hidden overflow-y-scroll">
        {renderTraitsByType()}
      </div>
    </div>
  );
};

export default Traits;
