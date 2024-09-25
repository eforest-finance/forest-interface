import UlIcon from 'assets/images/v2/ul.svg';
import HonourLabel, { stylesMap } from 'baseComponents/HonourLabel';
import { useCallback } from 'react';
import useTraits, { CollectionType } from './useTraits';
import ELF from 'assets/images/elf.svg';
import useDetailGetState from 'store/state/detailGetState';

const Traits = () => {
  const { traitsType, traitsData } = useTraits();

  const { detailInfo } = useDetailGetState();

  const { nftTraitInfos, nftInfo, nftRankingInfos } = detailInfo;

  // nftTraitInfos?.generation

  const NormalTrait = useCallback(({ data }) => {
    const [key, value] = data;
    return (
      <div className="mb-[8px] border-lineBorder h-[48px] w-[537px] flex items-center  justify-between rounded-lg border border-solid py-[13px] px-[24px] ">
        <span>{key}</span>
        <span>{value}</span>
        {/* <span>
          Nature Breath <span>(1.28%)</span>
        </span> */}
      </div>
    );
  }, []);

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
        className={`${styleColor} border border-solid  h-[48px] w-[537px] flex items-center  justify-between rounded-lg  py-[13px] px-[24px]  mb-[8px]`}>
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
        className={`bg-[${option[0]}] h-[48px] w-[537px] flex items-center  rounded-lg  py-[13px] px-[24px] mb-[8px]`}
        style={{
          backgroundColor: option[0],
        }}>
        <span
          style={{
            color: option[1],
          }}
          className={`text-[${option[1]}] w-[120px]`}>
          {key}
        </span>
        <span className="text-[14px] flex justify-center font-medium  text-textPrimary w-[120px]">
          <ELF className="w-[16px] mr-[4px]" />
          {price}
        </span>
        <span className="flex items-center flex-1 justify-end">
          {value} <span className="text-textSecondary text-[12px]">({percent})</span>
        </span>
      </div>
    );
  }, []);

  const renderTraitsByType = () => {
    switch (traitsType) {
      case CollectionType.SGR:
        return (
          <>
            <RarityTrait text={nftInfo?.describe || ''} />
            <NormalTrait data={['Generation', nftTraitInfos?.generation]} />
            <div className="">
              {traitsData.map((data, key) => {
                return <ColorTrait key={key} data={data} />;
              })}
            </div>
          </>
        );

      case CollectionType.SEED:
        return (
          <>
            {traitsData.map((data, key) => {
              return <NormalTrait key={key} data={data} />;
            })}
          </>
        );

      case CollectionType.NORMAL:
        return (
          <>
            {traitsData.map((data, key) => {
              return <ColorTrait key={key} data={data} />;
            })}
          </>
        );

      default:
        break;
    }
  };

  return (
    <div>
      <h1 className="flex items-center font-medium text-textPrimary text-[16px] my-[24px]">
        <UlIcon className="mr-[12px]" /> Traits
      </h1>
      {renderTraitsByType()}
      {/* <RarityTrait /> */}
    </div>
  );
};

export default Traits;
