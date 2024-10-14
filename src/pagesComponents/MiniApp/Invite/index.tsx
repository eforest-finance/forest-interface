import styles from '../style.module.css';
import Footer from '../components/Footer';
import Title from 'assets/images/miniApp/invite/title.svg';
import Work from 'assets/images/miniApp/invite/work.svg';
import BtnBg from 'assets/images/miniApp/rules/btnBg.png';
import Box from 'assets/images/miniApp/rules/box.png';
import Invitation from 'assets/images/miniApp/invite/invitation.svg';
import BoxBg from 'assets/images/miniApp/rules/boxBg.png';
import Refresh from 'assets/images/miniApp/invite/refresh.svg';
import InviteBtn from 'assets/images/miniApp/invite/inviteBtn.png';
import InviteBtnSm from 'assets/images/miniApp/invite/InviteBtnSm.png';
import Copy from 'assets/images/miniApp/invite/copy.svg';
import Person from 'assets/images/miniApp/invite/person.svg';

const btnStyle = {
  backgroundImage: `url(${BtnBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const BoxStyle = {
  backgroundImage: `url(${Box.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const SmallBoxStyle = {
  backgroundImage: `url(${BoxBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const titleStyle = {
  webkitTextStrokeWidth: '1px',
  webkitTextStrokeColor: '#5C489D',
  color: '#fff',
  // textShadow: '0px 4px 0px #A09DF7',
};

const InviteBtnStyle = {
  backgroundImage: `url(${InviteBtn.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const InviteBtnSmStyle = {
  backgroundImage: `url(${InviteBtnSm.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const Invite = () => {
  return (
    <div className={styles['mini-app']}>
      <div className="w-full min-h-screen text-center bg-[#B1A7D0] py-[48px] px-[16px]">
        <div>
          <Title />
        </div>
        <div className="flex items-center justify-center mt-[24px] pb-[24px] gap-[8px]">
          <div className="w-[198px] h-[40px] flex items-center justify-center" style={InviteBtnStyle}>
            <Person />
            <span style={titleStyle} className="text-[16px] leading-[19px] pl-[2px]">
              invite friends
            </span>
          </div>
          <div className="w-[40px] h-[40px] flex items-center justify-center" style={InviteBtnSmStyle}>
            <Copy />
          </div>
        </div>
        <div className="w-full mt-[24px] p-[20px]" style={BoxStyle}>
          <Work />
          <Invitation />
          <div className="text-[#5C489D] text-left text-[14px] p-[16px] my-[16px]" style={SmallBoxStyle}>
            <div className="mt-[12px]">Share your invitation link with your friends</div>
            <div className="mt-[12px]">Your friend has joined and started playing Forest</div>
            <div className="mt-[12px]">
              You receive 3% of the golden fruits your friend harvests. Your friend immediately receives 100 golden
              fruits.
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[24px] mb-[12px]">
          <div style={titleStyle} className="text-[24px]">
            your friends (10)
          </div>
          <Refresh />
        </div>
        <div className="w-full mt-[24px] p-[20px] text-[#5C489D] grid grid-cols-2 gap-[16px]" style={BoxStyle}>
          <span>Telegram Name</span>
          <span>Telegram Name</span>
          <span>Telegram Name</span>
          <span>Telegram Name</span>
          <span>Telegram Name</span>
          <span>Telegram Name</span>
          <span>Telegram Name</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Invite;
