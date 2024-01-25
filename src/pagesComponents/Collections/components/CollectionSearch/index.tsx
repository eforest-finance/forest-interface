import { InputRef } from 'antd';
import Input from 'baseComponents/Input';
import ClockCircleOutlined from 'assets/images/explore/search-icon.svg';
// import Clear from 'assets/images/explore/Clear.svg';
import { Ref, forwardRef } from 'react';
import { IInputProps } from 'aelf-design';

function CollectionSearch(params: IInputProps & React.RefAttributes<InputRef>, ref: Ref<InputRef> | undefined) {
  return (
    <Input
      {...params}
      ref={ref}
      prefix={<ClockCircleOutlined />}
      // allowClear={{ clearIcon: <Clear /> }}
      placeholder="Search a collection name"
    />
  );
}

export default forwardRef(CollectionSearch);
