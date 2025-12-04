import { FormItemProps, ModalProps } from 'antd';
import { ReactNode } from 'react';
import { IExtraInfoId } from 'contract/type';
import { DraggerProps } from 'antd/lib/upload';
import { IWhiteListTagsResponse, IWhitelistExtraInfosResponse } from 'api/types';

export interface IPriceTagInfo {
  price?: number;
  symbol?: null | string;
}

export interface ITagInfoBase {
  addressCount?: number;
  chainId?: number;
  id?: string;
  info?: null | string;
  name?: null | string;
  priceTagInfo?: IPriceTagInfo;
  tagHash?: null | string;
}

export interface IWhitelistInfoBase {
  chainId: string;
  id: string;
  projectId: string;
  strategyType: number;
  whitelistHash: string;
}

export interface IProjectWhiteListItemDto {
  address?: null | string;
  chainId?: number;
  id?: string;
  tagInfo?: ITagInfoBase;
  whitelistInfo?: IWhitelistInfoBase;
}

export interface IProjectWhiteListItem extends IProjectWhiteListItemDto {
  tagName?: string;
  key: string;
}
export interface IProjectWhiteList {
  totalCount: number;
  items: IProjectWhiteListItem[];
}

export interface IUserLevelItem extends ITagInfoBase {
  key?: string;
}

export interface ITagInfoList {
  value: {
    info: string;
    tagName: string;
  }[];
}

export enum StrategyType {
  Basic = 'BASIC',
  Price = 'PRICE',
  Customize = 'CUSTOMIZE',
}

export interface IWhitelistInfo {
  chainId: Chain;
  whitelistHash: string | null;
  projectId: string | null;
  isAvailable: boolean;
  isCloneable: boolean;
  remark: string | null;
  creator: string | null;
  strategyType: StrategyType;
}

export type IFilterTool = {
  tag?: string;
  search?: string;
};

export interface IWhiteListState {
  chainId?: Chain;
  whitelistId?: string;
  projectId?: string;
  account?: string;
  projectWhiteList?: IWhitelistExtraInfosResponse;
  adminAddress?: string;
  userLevelList?: IWhiteListTagsResponse;
  tagInfoList?: {
    label: string;
    value: string;
  }[];
  refresh?: number;
  whitelistInfoList?: IWhitelistExtraInfosResponse;
  whitelistInfo?: IWhitelistInfo;
  initViewTool?: IFilterTool;
  initRemoveTool?: IFilterTool;
}

export interface IWhiteListConfig {
  chainId?: Chain;
  whitelistId?: string;
  adminAddress?: string;
  account?: string;
}

export enum MODAL_ACTION_TYPE {
  HIDE = '',
  ADD_WHITELIST = 'ADD_WHITELIST',
  RM_WHITELIST = 'RM_WHITELIST',
  RESET_WHITELIST = 'RESET_WHITELIST',
  USER_LEVEL_SETTING = 'USER_LEVEL_SETTING',
  VIEW_THE_WHITELIST = 'VIEW_THE_WHITELIST',
}

export interface IModalAction {
  type: MODAL_ACTION_TYPE;
  modalState?: IModalWhiteListProps;
}

export enum ADD_RM_TYPE {
  Alone = 'Alone',
  Batch = 'Batch',
}

export interface IModalWhiteListProps extends ModalProps {
  className?: string;
  leftCallBack?: () => void;
  leftElement?: boolean;
  transitionName?: string;
  children?: ReactNode;
  customizeAddTagFormItem?: ICustomizeAddTagFormItem[];
  addType?: ADD_RM_TYPE;
  removeType?: ADD_RM_TYPE;
  draggerProps?: DraggerProps;
}

export interface ICustomizeAddTagFormItem extends FormItemProps {
  customizeItem: ReactNode;
}

export interface IViewTheWhiteListProps {
  whitelistId?: string;
  projectId?: string;
  whiteListModal?: IModalWhiteListProps;
  account?: string;
  adminAddress?: string;
}

export interface IManagerItem {
  chainId: string;
  id: string;
  manager: string;
  whitelistInfo: IWhitelistInfoBase;
}

export interface IUpdateExtraInfoInput {
  whitelistId: string;
  extraInfoList: IExtraInfoId;
}

export interface ITagInfoListDto {
  addressCount?: number;
  chainId?: number;
  id?: string;
  info?: null | string;
  name?: null | string;
  priceTagInfo?: IPriceTagInfo;
  tagHash?: null | string;
  whitelistInfo?: IWhitelistInfoBase;
}

export enum AllTagItem {
  value = 'ALL',
  label = 'ALL',
}

export interface IWhiteListConfig {
  chainId?: Chain;
  whitelistId?: string;
  adminAddress?: string;
  account?: string;
}
