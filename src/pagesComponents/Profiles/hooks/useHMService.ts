import { useDebounceFn } from 'ahooks';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import useResponsive from 'hooks/useResponsive';
import { BoxSizeEnum } from 'pagesComponents/ExploreItem/constant';
import { useState } from 'react';

export function useHMService() {
  const { isLG } = useResponsive();
  const [size, setSize] = useState<BoxSizeEnum>(BoxSizeEnum.small);
  const [collapsedFilter, setCollapsedFilter] = useState<boolean>(isLG);
  const [sort, setSort] = useState<string>(dropDownCollectionsMenu.data[0].value as string);
  const [SearchParam, setSearchParam] = useState<string>('');
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const { run: changeSearchParam } = useDebounceFn(
    (searchKeyWord: string) => {
      setSearchParam(searchKeyWord.trim());
    },
    {
      wait: 500,
    },
  );

  const searchInputValueChange = (e: any) => {
    setSearchInputValue(e.target.value);
    changeSearchParam(e.target.value);
  };

  return {
    isLG,
    searchInputValue,
    setSearchInputValue,
    searchInputValueChange,
    SearchParam,
    setSearchParam,
    size,
    setSize,
    sort,
    setSort,
    collapsedFilter,
    setCollapsedFilter,
  };
}
