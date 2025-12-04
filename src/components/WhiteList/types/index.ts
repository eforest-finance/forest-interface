import { DraggerProps } from 'antd/lib/upload';
import { IModalWhiteListProps } from 'store/reducer/saleInfo/type';

export interface IAddRmWhiteProps {
  whiteListModal: IModalWhiteListProps;
  draggerProps?: DraggerProps;
  whitelistId?: string;
  adminAddress?: string;
}
