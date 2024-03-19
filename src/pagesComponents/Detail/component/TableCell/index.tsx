import Tooltip from 'baseComponents/Tooltip';
import React from 'react';
import { ReactNode } from 'react';
import useGetState from 'store/state/getState';

function TableCell(props: { content: string | ReactNode; isLink?: boolean; tooltip?: string; onClick?: () => void }) {
  const { content, isLink = false, onClick, tooltip } = props;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <div
      className={`flex items-center text-sm font-medium ${
        isLink ? 'text-brandNormal cursor-pointer' : 'text-textPrimary cursor-default'
      } ${isSmallScreen && '!text-base !font-semibold'}`}>
      <Tooltip title={!isSmallScreen && tooltip}>
        <span onClick={onClick}>{content}</span>
      </Tooltip>
    </div>
  );
}

export default React.memo(TableCell);
