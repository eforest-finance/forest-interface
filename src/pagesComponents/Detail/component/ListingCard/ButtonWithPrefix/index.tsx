import React, { MouseEvent } from 'react';

import Button from 'baseComponents/Button';

interface ButtonProps {
  onClick: () => void;
  title: string;
  prefix: any;
}

function ButtonWithPrefix(props: ButtonProps) {
  const { onClick, title, prefix } = props;
  return (
    <Button
      className={` relative !h-[48px] mdTW:mr-0 mr-[16px] lg:mb-2 lgTW:mb-0 lgTW:mr-[16px] mdTW:w-[206px] lgTW:w-[206px] w-full `}
      size="ultra"
      type="primary"
      onClick={onClick}>
      <div className="pr-[25px]">{title}</div>
      <div className="absolute top-0 right-0 w-[48px] h-[48px] rounded-r-lg overflow-hidden  bg-[#3183E5] flex items-center justify-center">
        {prefix}
      </div>
    </Button>
  );
}

export default React.memo(ButtonWithPrefix);
