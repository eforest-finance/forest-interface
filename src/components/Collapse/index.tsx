import { CollapsePanelProps, CollapseProps } from 'antd';
import { AELFDProvider, Collapse, ICollapseProps } from 'aelf-design';
import styles from './index.module.css';
import { themeCollapseConfig } from './config';
import { themeColor } from 'styles/themeColor';
interface ICollapse extends Omit<ICollapseProps, 'className'> {
  items: CollapsePanelProps[];
  wrapClassName?: string;
}

const { Panel } = Collapse;
const CollapseForPC = ({ items = [], ...params }: ICollapse) => {
  return (
    <AELFDProvider
      prefixCls="forest"
      theme={{
        components: {
          Collapse: {
            headerBg: themeColor.fillPageBg,
            contentBg: themeColor.fillPageBg,
            headerPadding: 0,
            borderRadius: 12,
          },
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
