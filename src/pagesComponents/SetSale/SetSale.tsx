import { useDetail } from 'pagesComponents/Detail/hooks/useDetail';
import BackTitle from './components/BackTitle';
import SetItemsWrap from './components/SetItemsWrap';
import useGetState from 'store/state/getState';
import { useLogoutListener } from 'hooks/useLogoutListener';

export default function SetSale() {
  useDetail();
  const { infoState } = useGetState();

  useLogoutListener();

  const { isSmallScreen } = infoState;
  return (
    <div className="!min-h-[100vh]">
      {!isSmallScreen && <BackTitle />}
      <SetItemsWrap />
    </div>
  );
}
