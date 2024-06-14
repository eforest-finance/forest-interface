import { useAntdTable, useRequest } from 'ahooks';
import { fetchFailedAIArtsNFT, fetchRetryGenerateAIArts } from 'api/fetch';
import Button from 'baseComponents/Button';
import Table from 'baseComponents/Table';
import { Breadcrumb } from 'antd5/';
import Progressing from 'pagesComponents/CreateItemByAI/components/Progressing';
import { message, Typography } from 'antd';
import { IFailedAIArt } from 'api/types';
import styles from './style.module.css';
import RetryModal from 'pagesComponents/CreateItemByAI/components/RetryModal';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Result {
  total: number;
  list: IFailedAIArt[];
}

const getTableData = ({ current, pageSize }: { current: number; pageSize: number }): Promise<Result> => {
  return fetchFailedAIArtsNFT({
    SkipCount: (current - 1) * pageSize,
    MaxResultCount: pageSize,
  }).then((res) => ({
    total: res.totalCount,
    list: res.items,
  }));
};

export default function FailedAIOrderPage() {
  const router = useRouter();

  const { tableProps } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const currentTransactionId = useRef<string>();

  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const { run: retryGenerate } = useRequest(fetchRetryGenerateAIArts, {
    manual: true,
    onError: (error, params) => {
      console.log('params', params);
      currentTransactionId.current = params[0];
      setShowTryAgainModal(true);
      console.log(error);
      setIsRetrying(false);
    },
    onSuccess: () => {
      setTimeout(() => {
        message.success('create success');
        setIsRetrying(false);
        router.push('/create-nft-ai');
      }, 2000);
    },
  });

  console.log('rerender ', isRetrying);

  const [showTryAgainModal, setShowTryAgainModal] = useState(false);

  const handleRetry = () => {
    setShowTryAgainModal(false);
    if (currentTransactionId.current) {
      setIsRetrying(true);
      retryGenerate(currentTransactionId.current);
    }
  };

  const columns: any = [
    {
      key: 'prompt',
      title: 'Text Prompt',
      dataIndex: 'prompt',
      with: 320,
      ellipsis: {
        showTitle: false,
      },
      render: (prompt: string) => (
        <Typography.Text
          ellipsis={{
            tooltip: {
              title: prompt,
              overlayInnerStyle: { borderRadius: '6px', textAlign: 'center' },
            },
          }}
          className="w-full my-3 p-4 border border-solid border-lineBorder rounded-md text-based font-medium text-textPrimary ">
          {prompt}
        </Typography.Text>
      ),
    },
    {
      key: 'negativePrompt',
      title: 'Negative Prompt',
      dataIndex: 'negativePrompt',
      with: 320,
      render: (prompt: string) => {
        if (!prompt) return '-';
        return (
          <Typography.Text
            ellipsis={{
              tooltip: {
                title: prompt,
                overlayInnerStyle: { borderRadius: '6px', textAlign: 'center' },
              },
            }}
            className="w-full my-3 p-4 border border-solid border-lineBorder rounded-md text-based font-medium text-textPrimary ">
            {prompt}
          </Typography.Text>
        );
      },
    },
    {
      key: 'style',
      title: 'Style',
      dataIndex: 'aiPaintingStyleType',
      with: 134,
    },
    {
      key: 'size',
      title: 'Size',
      dataIndex: 'size',
      with: 134,
    },
    {
      key: 'number',
      title: 'Sample Image Quantity',
      dataIndex: 'number',
      with: 194,
    },
    {
      key: 'action',
      title: 'Action',
      dataIndex: 'transactionId',
      width: 124,
      fixed: 'right',
      align: 'right',
      render: (transactionId: string) => (
        <Button
          type="primary"
          className=" !rounded-md"
          size="middle"
          onClick={() => {
            currentTransactionId.current = transactionId;
            handleRetry();
          }}>
          Retry
        </Button>
      ),
    },
  ];

  return (
    <div className=" mx-auto max-w-[1392px] w-full px-4 mdl:pt-12 pt-8 mdl:pb-8 pb-4">
      <Breadcrumb
        className="!mb-10"
        separator=">"
        items={[
          {
            title: <span className=" text-textSecondary">Al Generator</span>,
            href: '/create-nft-ai',
          },
          {
            title: <span className=" text-textPrimary font-medium">Failed order</span>,
          },
        ]}
      />
      <div className={styles['failed-arts-table']}>
        <Table
          columns={columns}
          rowKey="transactionId"
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            defaultPageSize: tableProps.pagination.pageSize,
            pageChange: (page: number) => {
              tableProps.onChange({
                current: page,
                pageSize: tableProps.pagination.pageSize,
              });
            },
            pageSizeChange: (page: number, pageSize: number) => {
              tableProps.onChange({
                current: page,
                pageSize,
              });
            },
            hideOnSinglePage: true,
            options: [
              {
                label: 10,
                value: 10,
              },
              {
                label: 20,
                value: 20,
              },
              {
                label: 50,
                value: 50,
              },
              {
                label: 100,
                value: 100,
              },
            ],
          }}
          scroll={{
            x: 1226,
          }}
        />
      </div>

      <Progressing isModalOpen={isRetrying} />
      <RetryModal
        isModalOpen={showTryAgainModal}
        onConfirm={() => {
          setShowTryAgainModal(false);
        }}
        onRetry={handleRetry}
      />
    </div>
  );
}
