import { useRouter } from 'next/navigation';

import Home from 'assets/images/miniApp/home.svg';
import Friends from 'assets/images/miniApp/friends.svg';
import Drops from 'assets/images/miniApp/drops.svg';

const Footer = () => {
  const router = useRouter();

  const goToHome = () => {
    router.push('/mini-app');
  };

  const goToRules = () => {
    router.push('/mini-app/rules');
  };
  const goToInvite = () => {
    router.push('/mini-app/invite');
  };
  const goToDrops = () => {
    router.push('/mini-app/drops');
  };

  return (
    <div className="fixed left-0 bottom-0 w-full flex items-center justify-around">
      <div className="flex flex-col items-center" onClick={goToHome}>
        <Home />
        <span>FOREST</span>
      </div>
      {/* <button onClick={goToRules}>rules</button> */}
      <div className="flex flex-col items-center" onClick={goToInvite}>
        <Friends />
        <span>Invite</span>
      </div>

      <div className="flex flex-col items-center" onClick={goToDrops}>
        <Drops />
        <span>Drops</span>
      </div>
    </div>
  );
};

export default Footer;
