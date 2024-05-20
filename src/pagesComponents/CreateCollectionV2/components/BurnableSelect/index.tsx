import { Radio, RadioGroupProps, Row, Col } from 'antd5/';
import styles from './style.module.css';

export function BurnableSelect(props: RadioGroupProps) {
  return (
    <Radio.Group {...props}>
      <Row>
        <Col span={6}>
          <Radio value={true} className={styles['custom-radio']}>
            True
          </Radio>
        </Col>
        <Col span={6}>
          <Radio value={false} className={styles['custom-radio']}>
            False
          </Radio>
        </Col>
      </Row>
    </Radio.Group>
  );
}
