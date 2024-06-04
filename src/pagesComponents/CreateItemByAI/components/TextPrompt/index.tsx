import { Input, Button } from 'antd5/';
import styles from './style.module.css';
import { InputTextAreaProps } from 'aelf-design';
import { useRequest } from 'ahooks';
import { fetchRandomAIPrompt } from 'api/fetch';
import { ChangeEvent } from 'react';

interface ITextPromptProps extends InputTextAreaProps {
  onSetRandomPrompt?: () => void;
}

export function TextPrompt(props: ITextPromptProps) {
  const { runAsync } = useRequest(fetchRandomAIPrompt, {
    manual: true,
  });

  return (
    <div className=" relative">
      <Input.TextArea
        className={styles['text-prompt']}
        maxLength={500}
        placeholder="Enter desired prompt here"
        rows={7}
        {...props}
      />
      <Button
        type="text"
        className=" !absolute bottom-3 right-3 !bg-fillCardBg hover:!bg-fillHoverBg hover:!text-brandHover !rounded-md text-textPrimary text-xs font-medium"
        onClick={() => {
          runAsync().then((data) => {
            props.onChange?.(data?.data as unknown as ChangeEvent<HTMLTextAreaElement>);
          });
        }}>
        Random Prompt
      </Button>
    </div>
  );
}
