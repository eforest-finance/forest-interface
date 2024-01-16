import { LeftOutlined } from '@ant-design/icons';
import { Col, Modal, Row } from 'antd';
import { IModalWhiteListProps } from 'store/reducer/saleInfo/type';
import useGetState from 'store/state/getState';

import styles from './style.module.css';

export default function CommonModal({
  leftElement = true,
  title,
  width,
  leftCallBack,
  className,
  onCancel,
  transitionName,
  closable,
  ...props
}: IModalWhiteListProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const getLeftIcon = () => {
    if (leftElement) {
      return <LeftOutlined />;
    } else {
      return null;
    }
  };

  const onBack = () => {
    if (!leftElement) return;
    leftCallBack?.();
  };

  return (
    <Modal
      open
      maskClosable={false}
      destroyOnClose
      footer={null}
      closable={closable}
      {...props}
      title={
        <>
          <Row>
            <Col className="common-modal-left-icon" onClick={onBack}>
              {getLeftIcon()}
            </Col>
            <Col className="text-center ml-[24px]">{title}</Col>
          </Row>
        </>
      }
      width={width ? width : '800px'}
      className={`forest-marketplace ${styles['common-modal']} ${className} ${isSmallScreen && styles['mobile-modal']}`}
      onCancel={(e) => onCancel?.(e)}
      transitionName={transitionName}
    />
  );
}
