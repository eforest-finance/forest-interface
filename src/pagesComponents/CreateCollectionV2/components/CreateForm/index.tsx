import { Collapse, Divider, Form } from 'antd5/';
import Input, { TextArea } from 'baseComponents/Input';
import Button from 'baseComponents/Button';
import { externalLinkReg } from 'constants/common';
import styles from './style.module.css';
import { SeedSelect } from '../SeedSelect';
import Tooltip from 'baseComponents/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ChainSelect } from '../ChainSelect';
import { BurnableSelect } from '../BurnableSelect';
import Arrow from 'assets/images/icon/arrow.svg';
import clsx from 'clsx';
import useGetState from 'store/state/getState';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

const { Panel } = Collapse;

interface ICreateCollectionFormProps {
  onCreateHandler: (values: any) => void;
}

function FormItemLabel({
  title,
  description,
  desTooltip,
  titleTooltip,
}: {
  title: string;
  description?: string;
  desTooltip?: string;
  titleTooltip?: string;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <span className=" text-lg font-medium text-textPrimary">
        {title}{' '}
        {!titleTooltip ? null : (
          <Tooltip className="ml-1" title={titleTooltip} overlayInnerStyle={{ borderRadius: '6px' }}>
            <QuestionCircleOutlined className=" cursor-help" />
          </Tooltip>
        )}
      </span>
      {!description ? null : (
        <span className=" text-sm font-medium text-textSecondary">
          {description}{' '}
          {!desTooltip ? null : (
            <Tooltip className="ml-1" title={desTooltip} overlayInnerStyle={{ borderRadius: '6px' }}>
              <QuestionCircleOutlined className=" cursor-help" />
            </Tooltip>
          )}
        </span>
      )}
    </div>
  );
}

export function CreateForm({ onCreateHandler }: ICreateCollectionFormProps) {
  const [form] = Form.useForm();

  const { aelfInfo } = useGetState();
  const { login } = useCheckLoginAndToken();

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
        isBurnable: true,
        issueChainId: aelfInfo?.curChain,
      }}
      onFinish={(values) => {
        console.log('values', values);
        onCreateHandler?.(values);
      }}>
      <Form.Item
        label="Collection Name"
        name="tokenName"
        rules={[
          {
            required: true,
            message: 'Please input your collection name',
          },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: 'Invalid name. Please enter only letters and numbers.',
          },
        ]}>
        <Input placeholder="My Collection Name" maxLength={30} autoComplete="off" />
      </Form.Item>

      <Form.Item
        label={
          <FormItemLabel
            title="Token Symbol (Seed)"
            titleTooltip="Please select the symbol you want. You can obtain the corresponding symbol by purchasing Seed NFT"
          />
        }
        name="symbol"
        rules={[
          {
            required: true,
            message: 'Please Choose a colleciton',
          },
        ]}>
        <SeedSelect />
      </Form.Item>

      <Divider className="!mt-10 !mb-7" />
      {/* Create a hidden field to make Form instance record this */}
      <Form.Item name="isBurnable" hidden />
      <Form.Item name="issueChainId" hidden />

      <Collapse
        ghost
        expandIcon={({ isActive }) => (
          <span className={clsx(styles['arrow-icon-custom'], isActive ? '-rotate-180' : 'rotate-0')}>
            <Arrow />
          </span>
        )}>
        <Panel header="Advanced settings" key="1">
          <Form.Item
            label={
              <FormItemLabel
                title="External link (Optional)"
                description="Forest will display the link on the item's detail page, enabling users to access more information with a simple click. It is recommended to provide a link to a webpage that contains detailed information about your project."
              />
            }
            name="externalLink"
            rules={[
              {
                pattern: externalLinkReg,
                message: 'Invalid external link.',
              },
            ]}>
            <Input allowClear placeholder="http://yoursite.io/item/123" maxLength={100} />
          </Form.Item>

          <Form.Item
            label={
              <FormItemLabel
                title="Description (Optional)"
                description="The description will be displayed at the item's details page under its image. Markdown syntax is supported."
              />
            }
            name="description">
            <TextArea
              maxLength={1000}
              className="resize-none"
              placeholder="Please provide a detailed description of your item."
            />
          </Form.Item>

          <Form.Item
            label={
              <FormItemLabel
                title="Blockchain (Optional)"
                description="Select the blockchain you want to use as the default for adding new items to this collection."
                desTooltip="A blockchain is a digitally distributed ledger that records transactions and information across a decentralised network. There are various types of blockchains to choose from for deploying your contract. Once your contract is deployed on a blockchain, it cannot be altered."
              />
            }
            name="issueChainId"
            hidden>
            <ChainSelect disabled />
          </Form.Item>

          <Form.Item
            label={
              <FormItemLabel
                title="Burnable"
                description="Collections and NFTs that are not burnable cannot be bridged across chains."
              />
            }
            name="isBurnable"
            hidden>
            <BurnableSelect />
          </Form.Item>
        </Panel>
      </Collapse>

      <div className="flex justify-end fixed bottom-0 left-0 right-0 p-4 border-0 border-t border-solid border-lineBorder bg-fillPageBg mdl:relative mdl:p-0 mdl:border-t-0">
        <Button
          type="primary"
          size="ultra"
          onClick={() => {
            login({
              callBack: handleFormSubmit,
            });
          }}
          isFull={true}
          className="mdl:!w-44 ">
          Create
        </Button>
      </div>
    </Form>
  );
}
