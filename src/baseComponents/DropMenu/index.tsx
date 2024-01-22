import { Dropdown, IDropdownProps } from 'aelf-design';
import styles from './index.module.css';

interface IDropMenu extends Omit<IDropdownProps, 'overlayClassName'> {
  dropMenuClassName?: string;
}

const DropMenu = ({ children, ...params }: IDropMenu) => (
  <Dropdown overlayClassName={`${styles['dropdown-menu']} ${params.dropMenuClassName || ''}`} {...params}>
    {children}
  </Dropdown>
);

export default DropMenu;
