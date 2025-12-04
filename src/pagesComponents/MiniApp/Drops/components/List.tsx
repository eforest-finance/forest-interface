import styles from '../style.module.css';
import Image from 'next/image';
import Title from 'assets/images/v2/title.png';
import Card from './Card';
import { Key, useEffect, useState } from 'react';
import { fetchMiniAppActivityList } from 'api/fetch';

import { useSelector } from 'react-redux';
import { getUserInfo } from 'store/reducer/userInfo';

const List = () => {
  // [
  //   {
  //     img: '',
  //     title: '',
  //     status: '',
  //     reward: 1000,
  //     eligibility: 111,
  //   },
  //   {
  //     img: '',
  //     title: '',
  //     status: '',
  //     reward: 1000,
  //     eligibility: 111,
  //   },
  //   {
  //     img: '',
  //     title: '',
  //     status: '',
  //     reward: 1000,
  //     eligibility: 111,
  //   },
  // ]

  const { address } = useSelector(getUserInfo);
  const [listData, setListData] = useState<any>([]);
  const fetchList = async () => {
    const list = await fetchMiniAppActivityList({ address });
    setListData(list);
  };
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className={``}>
      {listData.map((item: any, key: number) => {
        return (
          <div key={key} className="mt-[24px]">
            <Card item={item} />
          </div>
        );
      })}
    </div>
  );
};

export default List;
