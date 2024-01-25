import React from 'react';
import { AELFDProvider, Button as AelfButton, IButtonProps } from 'aelf-design';
import styles from './index.module.css';
import { themeButtonConfig } from './config';

function Button(props: IButtonProps) {
  return (
    <AELFDProvider
      prefixCls="ant"
      theme={{
        components: {
          Button: themeButtonConfig,
        },
      }}>
      <AelfButton
        {...props}
        className={`${styles.button} ${props.size === 'ultra' ? 'font-semibold' : 'font-medium'} ${
          props.size === 'mini' && styles['forest-btn-mini']
        } ${props.className}`}
      />
    </AELFDProvider>
  );
}

export default React.memo(Button);
