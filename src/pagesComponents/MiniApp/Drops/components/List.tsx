import styles from '../style.module.css';
import Image from 'next/image';
import Title from 'assets/images/v2/title.png';
import Card from './Card';
import { useEffect, useState } from 'react';

const List = () => {
  const [listData, setList] = useState<any>([
    {
      img: '',
      title: '',
      status: '',
      reward: 1000,
      eligibility: 111,
    },
    {
      img: '',
      title: '',
      status: '',
      reward: 1000,
      eligibility: 111,
    },
    {
      img: '',
      title: '',
      status: '',
      reward: 1000,
      eligibility: 111,
    },
  ]);
  const fetchList = async () => {
    return;
  };
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className={``}>
      {listData.map((data, key) => {
        return (
          <div key={key} className="mt-[24px]">
            <Card />
          </div>
        );
      })}
    </div>
  );
};

export default List;
