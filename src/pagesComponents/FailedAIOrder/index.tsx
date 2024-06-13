import { useAntdTable, useRequest } from 'ahooks';
import { fetchFailedAIArtsNFT, fetchRetryGenerateAIArts } from 'api/fetch';
import Button from 'baseComponents/Button';
import Table from 'baseComponents/Table';
import { Breadcrumb } from 'antd5/';
import Progressing from 'pagesComponents/CreateItemByAI/components/Progressing';
import { message, Typography } from 'antd';
import { IFailedAIArt } from 'api/types';
import styles from './style.module.css';

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
  const { tableProps, refresh } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const { run: retryGenerate, loading: isRetrying } = useRequest(fetchRetryGenerateAIArts, {
    manual: true,
    onError: (error) => {
      console.log(error);
      message.error('create fail');
    },
    onSuccess: () => {
      message.success('create success');
      refresh();
    },
  });

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
        <Button type="primary" size="middle" onClick={() => retryGenerate(transactionId)}>
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
    </div>
  );
}
