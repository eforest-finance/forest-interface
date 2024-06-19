import { Badge, Empty, List, Typography } from 'antd';
import { IMessage } from 'api/types';
import clsx from 'clsx';
import { ImageEnhance } from 'components/ImgLoading';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

interface INotificationListProps {
  hiddenTitle?: boolean;
  dataSource: IMessage[];
}

const NOTIFICATION_TITLE: { [key: string | number]: any } = {
  0: 'Sold for',
  1: 'Buy for',
  2: 'Reciverd offer',
};

export function NotificationList({ hiddenTitle, dataSource }: INotificationListProps) {
  const { isSmallScreen } = useSelector(selectInfo);
  const formatTime = (time: string | number) => {
    if (!time) return '-';
    return moment(time).format('YYYY/MM/DD HH:mm:ss');
  };

  return (
    <section className="p-4">
      {!hiddenTitle ? <header className="pb-1 text-textPrimary font-semibold text-xl">Notifications</header> : null}
      <List
        className={clsx(!isSmallScreen && 'max-h-[520px]', 'overflow-auto -mr-4 pr-4')}
        bordered={false}
        split={false}
        header={null}
        dataSource={dataSource}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className=" text-textSecondary">No Notifications Yet~</span>}
            />
          ),
        }}
        renderItem={(item) => {
          return (
            <List.Item className="!pl-0 !pr-3">
              <div className="flex w-full ">
                <Badge dot={true} className="pl-1" count={item.status === 0 ? 1 : 0} offset={[-72, 0]}>
                  <ImageEnhance src={item.image} className=" w-[72px] h-[72px] rounded-md" />
                </Badge>
                <div className="flex flex-col ml-4 w-[144px]">
                  <Typography.Text ellipsis={true} className="font-semibold text-sm text-textPrimary">
                    {item.title}
                  </Typography.Text>
                  <Typography.Text ellipsis={true} className=" font-medium text-sm text-textSecondary">
                    {item.body}
                  </Typography.Text>
                  <span className=" text-xs text-textSecondary">{formatTime(item.ctime)}</span>
                </div>
                <div className="flex-1 ml-5 flex flex-col items-end">
                  <span className=" font-semibold text-sm text-textPrimary">
                    {NOTIFICATION_TITLE[item.secondLevelType]}
                  </span>
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
