import { Input } from 'antd5/';
import styles from './style.module.css';
import { InputTextAreaProps } from 'aelf-design';

export function NegativePrompt(props: InputTextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: inputValue } = e.target;

    const reg = /[\u4E00-\u9FA5]/g;
    const resVal = inputValue.replace(reg, '');
    e.target.value = resVal;
    props.onChange?.(e);
  };

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
      onChange={handleChange}
    />
  );
}
