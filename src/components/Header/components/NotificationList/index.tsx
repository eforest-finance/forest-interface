import { Badge, List, Typography } from 'antd';
import { ImageEnhance } from 'components/ImgLoading';

const listdata = [
  {
    id: '1123444',
    title: 'nft name',
    body: 'collection name',
    singlePrice: '1.5',
    totalPrice: '25',
    amount: '20',
    image: 's3...',
    status: 0,
    businessId: 'symbol',
    secondLevelType: '',
    ctime: 'xxx',
    utime: 'xxx',
    webLink: 'xxx',
    appLink: 'xxx',
  },
];

interface INotificationListProps {
  hiddenTitle?: boolean;
}

export function NotificationList({ hiddenTitle }: INotificationListProps) {
  return (
    <section className="p-4">
      {!hiddenTitle ? <header className="pb-1 text-textPrimary font-semibold text-xl">Notifications</header> : null}
      <List
        bordered={false}
        header={null}
        dataSource={listdata}
        renderItem={(item) => {
          return (
            <List.Item className="!border-b-0 !py-3">
              <div className="flex w-full ">
                <Badge dot={true} count={item.status === 0 ? 1 : 0} offset={[-72, 0]}>
                  <ImageEnhance src="error" className=" w-[72px] h-[72px] rounded-md" />
                </Badge>
                <div className="flex-1 flex flex-col ml-4 w-[140px]">
                  <Typography.Text ellipsis={true} className="font-semibold text-sm text-textPrimary">
                    {item.title}
                  </Typography.Text>
                  <Typography.Text ellipsis={true} className=" font-medium text-sm text-textSecondary">
                    {item.body}
                  </Typography.Text>
                  <span className=" text-xs text-textSecondary">{item.ctime}</span>
                </div>
                <div className="flex-1 ml-5 flex flex-col items-end">
                  <span className=" font-semibold text-sm text-textPrimary">Sold for</span>
                  <span>{item.singlePrice} ELF</span>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </section>
  );
}
