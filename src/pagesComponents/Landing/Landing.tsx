import { useSelector } from 'react-redux';
import AboveTheFold from './component/AboveTheFold';
import ActionWrapper from './component/ActionWrapper';
import { RecommendSeeds } from './component/RecommendSeeds';
import { selectInfo, setShowDisconnectTip } from 'store/reducer/info';
import { useEffect } from 'react';
import { message } from 'antd';
import { store } from 'store/store';

export default function Landing() {
  const { showDisconnectTip } = useSelector(selectInfo);

  useEffect(() => {
    if (showDisconnectTip) {
      message.error('Account disconnected or logged out. To proceed, please connect the wallet or log in again.');
      store.dispatch(setShowDisconnectTip(false));
    }
  }, [showDisconnectTip]);

  return (
    <div className="bg-[var(--bg-page-landing)] !min-h-[100vh] px-[16px] mdb:px-[40px]">
      <AboveTheFold />
      <RecommendSeeds />
      <ActionWrapper />
    </div>
  );
}
