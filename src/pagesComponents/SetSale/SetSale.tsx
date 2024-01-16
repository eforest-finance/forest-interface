import { useDetail } from 'pagesComponents/Detail/hooks/useDetail';
import BackTitle from './components/BackTitle';
import SetItemsWrap from './components/SetItemsWrap';
import useGetState from 'store/state/getState';
import { useParams } from 'next/navigation';
import { useLogoutListener } from 'hooks/useLogoutListener';

export default function SetSale() {
  const { id } = useParams() as {
    id: string;
  };
  useDetail({ id });
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
