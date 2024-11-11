import styles from '../style.module.css';
import Footer from '../components/Footer';
import Image from 'next/image';
import Title from 'assets/images/v2/title.png';
import Top from 'assets/images/v2/Cloud_Top2_3x.png';
import List from './components/List';
import useTelegram from 'hooks/useTelegram';
import { useEffect, useMemo } from 'react';
import { TelegramPlatform } from '@portkey/did-ui-react';

const Drops = () => {
  const { isInTelegram } = useTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  useEffect(() => {
    if (isInTG) {
      const TG = TelegramPlatform.getTelegram();
      TG.WebApp.BackButton.hide();
    }
  }, [isInTG]);

  return (
    <div className={`relative z-0 min-h-screen bg-[#AFADF8] ${styles['mini-app']}`}>
      <div className="absolute -z-10 w-full h-fit bg-[#C8C6FA]">
        <Image alt="" className="mt-[34px] w-full h-auto" src={Top}></Image>
      </div>
      <div className="flex w-full justify-center">
        <Image alt="" className="w-[279px] h-auto mt-[48px] mb-[20px]" src={Title}></Image>
      </div>
      <List />
      <div className="w-full h-[95px]">
        <Footer />
      </div>
    </div>
  );
};

export default Drops;
