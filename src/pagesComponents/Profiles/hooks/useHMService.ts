import { useDebounceFn } from 'ahooks';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import useResponsive from 'hooks/useResponsive';
import { BoxSizeEnum } from 'pagesComponents/ExploreItem/constant';
import { useState } from 'react';

export function useHMService() {
  const { isLG } = useResponsive();
  const [size, setSize] = useState<BoxSizeEnum>(BoxSizeEnum.small);
  const [collapsedFilter, setCollapsedFilter] = useState<boolean>(isLG);
  // const [SearchParam, setSearchParam] = useState<string>('');
  // const [searchInputValue, setSearchInputValue] = useState<string>('');

  return {
    isLG,
    // searchInputValue,
    // setSearchInputValue,
    // searchInputValueChange,
    // SearchParam,
    // setSearchParam,
    size,
    setSize,
    collapsedFilter,
    setCollapsedFilter,
  };
}
