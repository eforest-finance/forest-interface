import { Segmented, SegmentedProps as AntdSegmentedProps } from 'antd';
import styles from './style.module.css';

export type SegmentedProps = Omit<AntdSegmentedProps, 'ref' | 'options'>;
export function CreateSegmented(props: SegmentedProps) {
  return (
    <Segmented
      size="large"
      className={styles['segmented']}
      {...props}
      options={[
        {
          label: (
            <div className="flex h-12  justify-center items-center font-semibold  text-base ">Individual creation</div>
          ),
          value: 'single',
        },
        {
          label: <div className="flex h-12  justify-center items-center  font-semibold  text-base">Batch creation</div>,
          value: 'batch',
        },
      ]}
    />
  );
}
