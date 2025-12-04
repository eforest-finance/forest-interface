import { Col, Modal, ModalProps, Row } from 'antd';
import clsx from 'clsx';
import { LeftOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import { useSelector } from 'store/store';
import { prefixCls } from 'constants/theme';
export default function CommonModal(
  props: ModalProps & {
    children?: any;
    className?: string;
    leftCallBack?: () => void;
    leftElement?: ReactNode;
    transitionName?: string;
  },
) {
  const { leftCallBack, width, title, leftElement, transitionName } = props;
  const { isSmallScreen } = useSelector((store) => store.info);
  return (
    <Modal
      maskClosable={false}
      centered={props.centered ? props.centered : !isSmallScreen}
      destroyOnClose
      footer={null}
      {...props}
      width={width ? width : '800px'}
      className={clsx(
        'forest-marketplace',
        'common-modals',
        {
          'common-modal-center': isSmallScreen && props.centered,
        },
        props.className,
      )}
      transitionName={transitionName ?? isSmallScreen ? `${prefixCls}-move-down` : undefined}
      title={
        <Row justify="space-between">
          {leftCallBack || leftElement ? (
            <Col className="common-modal-left-icon" flex={1} onClick={leftCallBack}>
              {leftElement || <LeftOutlined />}
            </Col>
          ) : null}
          <Col flex={2} className="text-center">
            {title}
          </Col>
          {leftCallBack || leftElement ? <Col flex={1} /> : null}
        </Row>
      }
    />
  );
}
