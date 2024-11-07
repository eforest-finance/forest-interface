import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import styles from './style.module.css';
import { EChartsOption } from 'echarts/types/dist/shared';
import { useTheme } from 'hooks/useTheme';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { MILLISECONDS_PER_DAY, MILLISECONDS_IN_WEEK } from 'constants/time';
import { fetchGetNftPrices } from 'api/fetch';
import { IPricePoint } from 'api/types';
import CollapseForPC from 'components/Collapse';
import { Select, Option } from 'baseComponents/Select';
import { INftInfo } from 'types/nftTypes';
echarts.use([
  LineChart,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
]);

interface IHistoryChart {
  theme: string;
  isSmallScreen: boolean | undefined;
  nftInfo: INftInfo | null;
  priceList: [number, number][];
}

const HistoryChart = memo(({ theme, nftInfo, priceList }: IHistoryChart) => {
  const chart = useRef<HTMLDivElement>(null);
  const [myChart, setMyChart] = useState<echarts.ECharts>();
  const [isLoading, setIsLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(new Date().getTime() - MILLISECONDS_IN_WEEK);

  const [pricesList, setPricesList] = useState<[number, number][]>(priceList);

  const echartsOption: EChartsOption = useMemo(
    () => ({
      xAxis: {
        type: 'time',
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#383D3D' : '#CECFD1',
          },
        },
        minInterval: MILLISECONDS_PER_DAY,
        axisLabel: {
          color: '#BDC1C1',
          formatter: '{MM}/{dd}',
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: [theme === 'dark' ? '#383D3D' : '#CECFD1'],
          },
        },
        axisLabel: {
          color: theme === 'dark' ? '#BDC1C1' : '#79807E',
        },
      },
      grid: {
        top: '30px',
        bottom: '24px',
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        position: 'top',
        backgroundColor: '#3E4659',
        textStyle: { color: '#fff' },
        borderWidth: 0,
        className: '!z-[998]',
        confine: true,
      },
      series: [
        {
          type: 'line',
          data: pricesList || [],
          symbol: pricesList.length !== 1 ? 'none' : 'circle',
          connectNulls: false,
          smooth: true,
          symbolSize: 8,
          color: theme === 'dark' ? '#1667C7' : '#1B76E2',
        },
      ],
    }),
    [pricesList, theme],
  );

  const getNftPrices = async () => {
    setIsLoading(true);
    try {
      if (!nftInfo?.id) {
        setIsLoading(false);
        return;
      }

      const result = await fetchGetNftPrices({
        nftInfoId: nftInfo?.id,
        timestampMin: firstTime,
        timestampMax: new Date().getTime(),
      });

      const rePricesList = result?.items.reduce((prev: [number, number][], curr: IPricePoint) => {
        const formatPrice = curr.price;
        prev.push([curr.timestamp, Number(formatPrice)]);
        return prev;
      }, []);

      const pricesList = rePricesList || [];
      setPricesList(pricesList);
    } catch (error) {
      /* empty */
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getNftPrices();
  }, [nftInfo?.id, firstTime]);

  useEffect(() => {
    if (!chart.current) {
      return;
    }
    if (!myChart) {
      const ele = echarts.init(chart.current as HTMLDivElement, undefined, {
        renderer: 'svg',
      });
      setMyChart(ele);
    } else {
      myChart.setOption(echartsOption);
      myChart.resize();
    }
  }, [echartsOption, pricesList, myChart]);

  useEffect(() => {
    if (!myChart) {
      return;
    }
    myChart.setOption(echartsOption);
    const resize = () => myChart.resize();
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('Width:', width, 'Height:', height);
        resize();
      }
    });

    if (chart.current) {
      resizeObserver.observe(chart.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [myChart, echartsOption]);

  const onTimeChange = (time: string) => {
    setFirstTime((time !== '0' && new Date().getTime() - Number(time) * MILLISECONDS_PER_DAY) || 0);
  };
  return (
    <div className=" lg:pt-[16px] border-0">
      <Select
        onChange={onTimeChange}
        getPopupContainer={(v) => v}
        defaultValue="7"
        popupClassName={styles['time-select-dropdown']}
        className="w-full lg:!w-[172px]"
        loading={isLoading}>
        <Option value="7">Last 7 Days</Option>
        <Option value="30">Last 30 Days</Option>
        <Option value="0">All Time</Option>
      </Select>
      <div ref={chart} id="price-chart" className="price-chart w-[100%] h-[18.2rem]" />
    </div>
  );
});

export default function PriceHistory() {
  const key = 'history';
  const [theme] = useTheme();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { detailInfo } = useDetailGetState();
  const [activeKey, setActiveKey] = useState('');
  const firstTime = new Date().getTime() - MILLISECONDS_IN_WEEK;
  const { nftInfo } = detailInfo;
  const [pricesList, setPricesList] = useState<[number, number][]>([]);

  const getNftPrices = useCallback(async () => {
    try {
      if (!nftInfo?.id) {
        return;
      }

      const result = await fetchGetNftPrices({
        nftInfoId: nftInfo?.id,
        timestampMin: firstTime,
        timestampMax: new Date().getTime(),
      });

      const rePricesList = result?.items.reduce((prev: [number, number][], curr: IPricePoint) => {
        const formatPrice = curr.price;
        prev.push([curr.timestamp, Number(formatPrice)]);
        return prev;
      }, []);

      const pricesList = rePricesList || [];
      setPricesList(pricesList);
      const isEmpty = !pricesList || !pricesList?.length;
      setActiveKey(isEmpty ? '' : key);
    } catch (error) {
      /* empty */
    }
  }, [nftInfo?.id]);

  useEffect(() => {
    getNftPrices();
  }, [getNftPrices]);

  return <HistoryChart theme={theme} priceList={pricesList} isSmallScreen={isSmallScreen} nftInfo={nftInfo} />;
}
