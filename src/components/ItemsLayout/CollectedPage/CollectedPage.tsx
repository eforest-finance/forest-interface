import { useEffect } from 'react';
import { useHash } from 'react-use';
import { dropDownDateMenu } from '../assets';
import { FilterBtn } from '../components';
import ItemsContent from '../ItemsContent/ItemsContent';
import ItemsSide from '../ItemsSide/ItemsSide';
import { useSelector, dispatch } from 'store/store';
import { setDropDownMenu } from 'store/reducer/layoutInfo';
import BackTop from 'assets/images/backTop.svg';

export default function CollectedPage({ showAdd }: { showAdd?: boolean }) {
  // const [hash] = useHash();
  const hash = window.location.hash;
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);

  useEffect(() => {
    dispatch(setDropDownMenu(hash === '#Badge' ? dropDownDateMenu : null));
  }, [hash]);
  return (
    <>
      {!isSmallScreen && <ItemsSide />}
      <ItemsContent showAdd={showAdd} />
      {isSmallScreen &&
        (showAdd ? (
          <span
            className="back fixed bottom-[64px] right-[24px]"
            onClick={() => {
              (document.querySelector('body') as HTMLElement).scrollTop = 0;
            }}>
            <BackTop />
          </span>
        ) : (
          <FilterBtn />
        ))}
    </>
  );
}
