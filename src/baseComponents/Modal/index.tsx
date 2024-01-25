import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps, ConfigProvider } from 'antd';
import styles from './index.module.css';
import btnStyles from 'baseComponents/Button/index.module.css';
import Close from 'assets/images/icon/clear.svg';
import useGetState from 'store/state/getState';
export interface ModalProps extends AntdModalProps {
  subTitle?: string;
}
function Modal(props: ModalProps) {
  const { children, className, title, subTitle, wrapClassName } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <ConfigProvider prefixCls="ant">
      <AntdModal
        keyboard={false}
        maskClosable={false}
        destroyOnClose={true}
        closeIcon={<Close />}
        width={800}
        {...props}
        className={`${styles.modal} ${isSmallScreen && styles['modal-mobile']} ${className}`}
        wrapClassName={`${styles['modal-wrap']} ${wrapClassName}`}
        okButtonProps={{
          className: `${btnStyles.button}`,
        }}
        cancelButtonProps={{
          className: `${btnStyles.button}`,
        }}
        title={
          <div>
            <div className="pr-8 break-words">{title}</div>
            {subTitle && <div className="text-min mt-2 text-dark-caption">{subTitle}</div>}
          </div>
        }>
        {children}
      </AntdModal>
    </ConfigProvider>
  );
}

export default React.memo(Modal);
