import { Collapse, Divider, Form } from 'antd5/';
import { TextPrompt } from '../TextPrompt';
import Arrow from 'assets/images/icon/arrow.svg';

import styles from './style.module.css';
import clsx from 'clsx';
import { NegativePrompt } from '../NegativePrompt';
import { SelectStyle } from '../SelectStyle';
import { SelectSize } from '../SelectSize';
import Input from 'baseComponents/Input';
import Button from 'baseComponents/Button';
import ELFICon from 'assets/images/explore/aelf.svg';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

const { Panel } = Collapse;

interface IAIFormProps {
  onCreate: (value: any) => void;
  aiImageFee: number | string;
}

function FormItemLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-y-2">
      <span className=" text-lg font-medium text-textPrimary">{title}</span>
      {!description ? null : <span className=" text-sm font-medium text-textSecondary">{description}</span>}
    </div>
  );
}

export function AIForm({ onCreate, aiImageFee }: IAIFormProps) {
  const { login, isLogin } = useCheckLoginAndToken();
  const [form] = Form.useForm();

  const handleFormSubmit = () => {
    form.submit();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      size="large"
      className={styles['custom-form']}
      requiredMark={false}
      initialValues={{
        paintingStyle: 'Pixel',
        size: '256x256',
        number: 1,
      }}
      onFinish={onCreate}>
      <Form.Item
        label="Text Prompt"
        name="promt"
        rules={[
          {
            required: true,
            message: 'Please input text prompt',
          },
        ]}>
        <TextPrompt />
      </Form.Item>

      <Divider />

      <Form.Item name="paintingStyle" hidden />
      <Form.Item name="size" hidden />
      <Form.Item name="number" hidden />
      <Form.Item name="negativePrompt" hidden />
      <Collapse
        ghost
        expandIcon={({ isActive }) => (
          <span className={clsx(styles['arrow-icon-custom'], isActive ? '-rotate-180' : 'rotate-0')}>
            <Arrow />
          </span>
        )}>
        <Panel header="Advanced settings" key="1">
          <Form.Item label="Negative Prompt" name="negativePrompt">
            <NegativePrompt />
          </Form.Item>

          <Form.Item
            name="paintingStyle"
            label={
              <FormItemLabel
                title="Select a Style"
                description="Please select the style of the image you want to generate."
              />
            }>
            <SelectStyle />
          </Form.Item>

          <Form.Item
            name="size"
            label={
              <FormItemLabel
                title="Select a Size"
                description="Please select a size of the image you want to generate."
              />
            }>
            <SelectSize />
          </Form.Item>

          <Form.Item
            name="number"
            rules={[
              () => ({
                validator(_, value) {
                  if (!String(value).trim() || !/^[1-9][0-9]*$/.test(value) || Number(String(value).trim()) > 10) {
                    return Promise.reject(new Error('Please enter a valid quantity (1-10).'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            label={
              <FormItemLabel
                title="Sample Image Quantity"
                description="Input the number of sample images to be generated. "
              />
            }>
            <Input placeholder="Please enter a quantity ranging from 1-10." />
          </Form.Item>
        </Panel>
      </Collapse>

      <div className="flex justify-end fixed bottom-0 left-0 right-0 p-4 border-0 border-t border-solid border-lineBorder bg-fillPageBg mdl:relative mdl:p-0 mdl:border-t-0">
        <div className=" inline-flex flex-col gap-2 w-full items-center mdl:w-auto ">
          <span className=" inline-flex items-center text-xs font-medium text-textSecondary">
            Each image costs <ELFICon className=" scale-75" /> {aiImageFee} ELF.
          </span>
          <Button
            type="primary"
            size="ultra"
            isFull={true}
            className="mdl:!w-44"
            onClick={() => {
              if (!isLogin) {
                login();
              } else {
                handleFormSubmit();
              }
            }}>
            Generate
          </Button>
        </div>
      </div>
    </Form>
  );
}
