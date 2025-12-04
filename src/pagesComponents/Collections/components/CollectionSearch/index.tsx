import { InputRef } from 'antd';
import Input from 'baseComponents/Input';
import { InputProps } from 'baseComponents/Input/Input';
import ClockCircleOutlined from 'assets/images/explore/search-icon.svg';
import Clear from 'assets/images/explore/Clear.svg';
import { Ref, forwardRef } from 'react';

function CollectionSearch(params: InputProps & React.RefAttributes<InputRef>, ref: Ref<InputRef> | undefined) {
  return (
    <Input
      placeholder="Search by names"
      {...params}
      ref={ref}
      prefix={<ClockCircleOutlined />}
      allowClear={{ clearIcon: <Clear /> }}
    />
  );
}

export default forwardRef(CollectionSearch);
