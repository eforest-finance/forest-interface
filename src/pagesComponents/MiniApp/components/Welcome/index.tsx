import styles from './style.module.css';
import Logo from 'assets/images/miniApp/welcome/title.svg';
import Text from 'assets/images/miniApp/welcome/text.svg';

import Cloud from 'assets/images/miniApp/welcome/cloud.png';
import ProgressBar_LR from 'assets/images/miniApp/welcome/ProgressBar_LR.svg';
import ProgressContainer_L from 'assets/images/miniApp/welcome/ProgressContainer_L.svg';

import ProgressContainer_R from 'assets/images/miniApp/welcome/ProgressContainer_R.svg';

const bg = {
  backgroundImage: `url(${Cloud.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom',
  backgroundSize: '100%',
};

const Welcome = () => {
  return (
    <div className="w-full h-screen bg-[#C8C6FA] relative" style={bg}>
      <div className="pt-[200px] h-screen">
        <div className="flex flex-col items-center gap-[16px] animate-pulse">
          <Logo />
          <Text />
        </div>
        <div className="w-[160px] m-auto text-center mt-[16px] relative">
          <div className={`flex items-center justify-center absolute top-[2px] left-[2px] `}>
            <ProgressBar_LR />
            <div className={`${styles.innerProgress} ${styles.progress} h-[16px]`}></div>
            <ProgressBar_LR />
          </div>
          <div className="flex items-center justify-center">
            <ProgressContainer_L />
            <div className={`${styles.containerProgress} w-[160px] h-[20px]`}></div>
            <ProgressContainer_R />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
