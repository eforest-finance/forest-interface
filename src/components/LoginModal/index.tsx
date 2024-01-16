import Modal from 'baseComponents/Modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { memo, useEffect, useState } from 'react';
import Button from 'baseComponents/Button';
import { Checkbox } from 'antd';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Loading from 'components/Loading';
import useGetState from 'store/state/getState';
import clsx from 'clsx';

function LoginModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const modal = useModal();
  const pathname = usePathname();

  const [loading, setLoading] = useState<boolean>(false);

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const [checked, setChecked] = useState<boolean>(false);

  const onChange = () => {
    setChecked((checked) => !checked);
  };

  const onOk = () => {
    try {
      setLoading(true);
      onConfirm();
    } catch (error) {
      modal.hide();
    }
  };

  useEffect(() => {
    if (!modal.visible) {
      setChecked(false);
      setLoading(false);
    }
  }, [modal.visible]);

  return (
    <Modal
      open={modal.visible}
      destroyOnClose={true}
      maskStyle={{
        zIndex: 999,
      }}
      wrapClassName="!z-[999]"
      title={
        isSmallScreen ? (
          <div className="h-[32px]" />
        ) : (
          <div className="flex items-center justify-center pl-8 text-5xl">Welcome</div>
        )
      }
      closable={false}
      footer={
        !loading && (
          <>
            <Button size="ultra" className="flex-1 min-w-0 mdTW:flex-none mdTW:min-w-[220px]" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              disabled={!checked}
              type="primary"
              size="ultra"
              className="flex-1 min-w-0 mdTW:flex-none mdTW:min-w-[220px]"
              onClick={onOk}>
              Continue
            </Button>
          </>
        )
      }>
      <div className="flex h-full flex-col items-center justify-center">
        {isSmallScreen && (
          <div className="flex items-center mt-[84px] mb-[48px] h-auto justify-center text-textPrimary text-5xl text-center font-semibold">
            Welcome
          </div>
        )}

        {loading && (
          <div className="w-full flex-1 flex items-center justify-center">
            <Loading imgStyle="!h-[42px] !w-[42px]" />
          </div>
        )}
        <div
          className={clsx(
            'max-w-[547px] pb-[30px] mdTW:pb-0 text-center text-lg text-textSecondary font-medium',
            !loading && 'flex-1',
          )}>
          By connecting your wallet and using Forest, you agree to our
          <Link target="_blank" href={`/term-service`} className="text-brandNormal hover:text-brandHover">
            &nbsp;Terms of Service
          </Link>
          &nbsp;and&nbsp;
          <Link target="_blank" href={`/privacy-policy`} className="text-brandNormal hover:text-brandHover">
            Privacy Policy
          </Link>
        </div>
        {!loading && (
          <div
            className="max-w-[392px] mb-[16px] mdTW:mb-0 bg-fillHoverBg py-[16px] px-[12px] flex items-center mt-[48px] rounded-[12px]"
            onClick={onChange}>
            <Checkbox checked={checked} />
            <span className="ml-[12px] text-lg text-textSecondary font-medium">
              I have read and accept the Terms of Service and Privacy Policy
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(LoginModal));
