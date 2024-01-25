import { CollapsePanelProps } from 'antd';
import { AELFDProvider, Collapse, ICollapseProps } from 'aelf-design';
import styles from './index.module.css';
import { themeCollapseConfig } from './config';
interface ICollapse extends Omit<ICollapseProps, 'className'> {
  items: CollapsePanelProps[];
  wrapClassName?: string;
}

const { Panel } = Collapse;
const CollapseForPC = ({ items = [], ...params }: ICollapse) => {
  return (
    <AELFDProvider
      prefixCls="ant"
      theme={{
        components: {
          Collapse: themeCollapseConfig,
        },
      }}>
      <Collapse className={`${styles['forest-collapse']} ${params.wrapClassName || ''} `} {...params}>
        {items.map((item) => {
          return (
            <Panel {...item} key={item.key}>
              {item.children}
            </Panel>
          );
        })}
      </Collapse>
    </AELFDProvider>
  );
};

export default CollapseForPC;
