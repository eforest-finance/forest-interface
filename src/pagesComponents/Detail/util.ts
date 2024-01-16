import { dispatch } from 'store/store';
import { refreshPage } from 'store/reducer/detail/detailInfo';

export function refreshDetailPage() {
  setTimeout(() => {
    dispatch(refreshPage());
  }, 8000);
}
