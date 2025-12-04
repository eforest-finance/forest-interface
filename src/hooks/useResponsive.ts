import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

export default function useResponsive() {
  const { width } = useWindowSize();
  const isMin = useMemo(() => {
    return width < 500;
  }, [width]);
  const isXS = useMemo(() => {
    return width < 600;
  }, [width]);

  const isSM = useMemo(() => {
    return width < 640;
  }, [width]);
  const isPcMin = useMemo(() => {
    return width <= 500;
  }, [width]);
  const isMD = useMemo(() => {
    return width < 768;
  }, [width]);
  const isLG = useMemo(() => {
    return width < 1024;
  }, [width]);
  const isXL = useMemo(() => {
    return width < 1360;
  }, [width]);
  const is2XL = useMemo(() => {
    return width < 1440;
  }, [width]);
  const is3XL = useMemo(() => {
    return width < 1760;
  }, [width]);
  const is4XL = useMemo(() => {
    return width < 1920;
  }, [width]);
  const is5XL = useMemo(() => {
    return width < 2240;
  }, [width]);
  const is6XL = useMemo(() => {
    return width < 2560;
  }, [width]);

  return {
    isMin,
    isXS,
    isMD,
    isSM,
    isPcMin,
    isLG,
    isXL,
    is2XL,
    is3XL,
    is4XL,
    is5XL,
    is6XL,
    width,
  };
}

export { useResponsive };
