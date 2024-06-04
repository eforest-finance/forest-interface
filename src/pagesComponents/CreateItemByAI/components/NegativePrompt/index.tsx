import { Input } from 'antd5/';
import styles from './style.module.css';
import { InputTextAreaProps } from 'aelf-design';

export function NegativePrompt(props: InputTextAreaProps) {
  return (
    <Input.TextArea
      className={styles['text-prompt']}
      maxLength={400}
      showCount={{
        formatter: ({ value, count, maxLength }) => {
          return (
            <span className="text-textDisable text-xs">
              {count}/{maxLength}
            </span>
          );
        },
      }}
      placeholder="Input negative prompts here"
      rows={7}
      {...props}
    />
  );
}
