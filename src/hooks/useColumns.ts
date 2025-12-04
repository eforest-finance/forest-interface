import { useMemo } from 'react';
import useResponsive from './useResponsive';
import { BoxSizeEnum } from 'pagesComponents/ExploreItem/constant';

export default function useColumns(collapsed: boolean, size: BoxSizeEnum) {
  const { isMin, isMD, isLG, is2XL, is3XL, is4XL, is5XL, is6XL } = useResponsive();
  const columns = useMemo(() => {
    let result = 0;
    if (isMin) {
      result = 2;
    } else if (isMD) {
      result = 2;
    } else if (isLG) {
      result = 3;
    } else if (is2XL) {
      result = 4;
    } else if (is3XL) {
      result = 5;
    } else if (is4XL) {
      result = 6;
    } else if (is5XL) {
      result = 7;
    } else if (is6XL) {
      result = 8;
    } else {
      result = 8;
    }
    if (!isLG && !collapsed) {
      result -= 1;
    }
    if (!isLG && size === BoxSizeEnum.large) {
      result -= 1;
    }
    console.log(result, collapsed, size, 'result');
    return result;
  }, [isMin, isMD, isLG, is2XL, is3XL, is4XL, is5XL, is6XL, collapsed, size]);

  return columns;
}
