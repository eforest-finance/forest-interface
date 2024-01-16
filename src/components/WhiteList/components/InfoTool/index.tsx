import { Input } from 'antd';
import { forwardRef, ReactNode, useCallback, useImperativeHandle, useState } from 'react';
import { useSetState, useUpdateEffect } from 'react-use';
import TagSelect from '../TagSelect';
import useGetState from 'store/state/getState';
import { DANGEROUS_CHARACTERS_REG } from 'constants/common';

const { Search } = Input;

export type FilterToolType = {
  tag?: string;
  search?: string;
};

const InfoTool = forwardRef(
  (
    {
      initState,
      onReset,
      getStateInfo,
      expandAction,
    }: {
      initState?: FilterToolType;
      onReset?: () => void;
      getStateInfo?: (value: FilterToolType) => void;
      expandAction?: ReactNode;
    },
    ref,
  ) => {
    const [state, setState] = useSetState<FilterToolType>(initState);
    const { infoState } = useGetState();
    const { isSmallScreen } = infoState;
    const tagSelectChange = useCallback(
      (value: string) => {
        setState({ tag: value });
        onReset?.();
      },
      [onReset, setState],
    );
    const onSetState = useCallback(
      (value: FilterToolType) => {
        setState(value);
      },
      [setState],
    );
    const getState = useCallback(() => state, [state]);

    useImperativeHandle(ref, () => ({
      getState,
      onSetState,
    }));

    useUpdateEffect(() => {
      getStateInfo?.(state);
    }, [getStateInfo, state]);

    const [search, setSearch] = useState<string>();

    const onSearch = (e: string) => {
      if (DANGEROUS_CHARACTERS_REG.test((search ?? state?.search) || '')) {
        setState({ search: e });
        onReset?.();
      }
    };

    const onSearchChange = (value: string) => {
      setSearch(value);
    };

    return (
      <div className={`filter-action-wrapper items-center gap-[16px] ${isSmallScreen ? 'flex flex-col' : 'flex'}`}>
        <div className="filter-select">
          <TagSelect
            value={state?.tag}
            showAll
            getPopupContainer={(props) => props?.parentNode ?? document.body}
            className="tool-whitelist-tag"
            onChange={tagSelectChange}
          />
        </div>
        <Search
          className="search-wrapper"
          placeholder="search"
          enterButton="Search"
          value={search ?? state?.search}
          onChange={(e) => onSearchChange(e.target.value)}
          onSearch={onSearch}
          status={!DANGEROUS_CHARACTERS_REG.test((search ?? state?.search) || '') ? 'error' : ''}
        />
        {expandAction}
      </div>
    );
  },
);

export default InfoTool;
