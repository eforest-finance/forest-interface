import { Collapse, CollapsePanelProps, CollapseProps } from 'antd';
import styles from './index.module.css';
import Down from 'assets/images/arrow-down.svg';
interface ICollapse extends Omit<CollapseProps, 'className' | 'expandIcon' | 'expandIconPosition'> {
  items: CollapsePanelProps[];
  wrapClassName?: string;
}

const { Panel } = Collapse;
const CollapseForPC = ({ items = [], ...params }: ICollapse) => {
  return (
    <Collapse
      className={`${styles['elf-collapse']} ${params.wrapClassName || ''} `}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <div className="duration-300">
          <Down className={`duration-300 relative flex items-center ${isActive && 'rotate-180'} `} />
        </div>
      )}
      {...params}>
      {items.map((item) => {
        return (
          <Panel {...item} key={item.key}>
            {item.children}
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default CollapseForPC;
