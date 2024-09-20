import { Select, Option } from 'baseComponents/Select';
import DatePickerPC from 'components/DatePickerPC';
import DatePickerMobile from 'components/DatePickerMobile';
import moment, { Moment } from 'moment';
import { useTheme } from 'hooks/useTheme';
import CalendarLight from 'assets/images/light/calendar.svg';
import CalendarNight from 'assets/images/night/calendar.svg';
import { useDurationService, IDurationProps } from '../hooks/useDuration';
import { RangePickerProps } from 'antd/lib/date-picker';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import useGetState from 'store/state/getState';

export function Duration(props: IDurationProps) {
  const [theme] = useTheme();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const {
    expirationType,
    setExpirationType,
    selectedDate,
    onSelectDateHandler,
    errorTip,
    mobileDateVisible,
    setMobileDateVisible,
    optionListArr,
  } = useDurationService(props);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    const maxExpireDate = moment().add(6, 'months');
    return current && (current < moment().startOf('day') || current > maxExpireDate);
  };
  const disabledTime = (current: Moment) => {
    const today = moment();

    if (current && current.isSame(today, 'day')) {
      const disResObj: {
        disabledHours?: () => number[];
        disabledMinutes?: () => number[];
        disabledSeconds?: () => number[];
      } = {
        disabledHours: () => Array.from({ length: today.hour() }, (_, i) => i),
      };

      if (current.isSame(today, 'hour')) {
        disResObj.disabledMinutes = () => Array.from({ length: today.minute() }, (_, i) => i);
      }

      if (current.isSame(today, 'seconds')) {
        disResObj.disabledSeconds = () => Array.from({ length: today.minute() }, (_, i) => i);
      }
      return disResObj;
    }

    return {};
  };

  const PCPicker = () => {
    return (
      <div className="flex-1 mx-2">
        <DatePickerPC
          value={selectedDate}
          defaultValue={moment(selectedDate)}
          onSelect={onSelectDateHandler}
          className="w-full h-[56px] !rounded-lg"
          disabledDate={disabledDate}
          disabledTime={disabledTime}
          open={mobileDateVisible}
          onOpenChange={setMobileDateVisible}
        />
      </div>
    );
  };

  const MobilePicker = () => {
    const maxExpireDate = moment().add(6, 'months').toDate();

    return (
      <>
        <div
          className="flex h-[56px] mx-2 mt-3 px-3 items-center justify-between rounded-lg border border-solid border-lineBorder"
          onClick={() => {
            setMobileDateVisible(true);
          }}>
          <span className="text-base text-textPrimary">{moment(selectedDate).format('YYYY/MM/DD hh:mm a')}</span>
        </div>
        <DatePickerMobile
          visible={mobileDateVisible}
          onCancel={() => {
            setMobileDateVisible(false);
          }}
          onConfirm={(e) => {
            onSelectDateHandler(moment(e));
            setMobileDateVisible(false);
          }}
          value={moment(selectedDate).toDate()}
          defaultValue={moment(selectedDate).toDate()}
          max={maxExpireDate}
        />
      </>
    );
  };

  const renderOptionLabel = (label: string) => {
    const CalendarIcon = theme === 'light' ? CalendarLight : CalendarNight;
    return (
      <div className="flex items-center">
        <CalendarIcon className="fill-textPrimary" />
        <span className="ml-2 text-textPrimary">{label}</span>
      </div>
    );
  };

  const renderSelectDateInfo = () => {
    return isSmallScreen ? MobilePicker() : PCPicker();
    // if (expirationType === 'custom') {
    //   return PCPicker();
    // }

    // const expireDate = moment().add(Number(expirationType), 'hours');

    // return (
    //   <div className="flex flex-1 mx-2 px-3 items-center justify-between rounded-lg border border-solid border-lineBorder">
    //     <span className="text-base font-medium text-textPrimary">{expireDate.format('ll')}</span>
    //     <span className="text-base font-medium text-textPrimary">{expireDate.format('H:mm a')}</span>
    //   </div>
    // );
  };

  const renderError = () => {
    if (!errorTip) return null;
    return (
      <div className="mt-2 text-xs text-error flex justify-between">
        <span></span>
        <span>{errorTip}</span>
      </div>
    );
  };

  return (
    <div className={`${isSmallScreen ? 'mt-[16px]' : 'mt-[24px]'}`}>
      <span className="font-medium text-textPrimary text-[16px] rounded-lg">
        Duration
        {props.tooltip ? (
          <Tooltip title={props.tooltip}>
            <InfoCircleOutlined className="text-base ml-1" />
          </Tooltip>
        ) : null}
      </span>
      <div className={`mt-4 flex -mx-2 ${!isSmallScreen ? 'flex-row' : 'flex-col'}`}>
        <Select
          getPopupContainer={(v) => v}
          className={`!mx-2 !h-[56px] ${!isSmallScreen ? 'flex-1' : ''}`}
          value={expirationType}
          optionLabelProp="label"
          onChange={setExpirationType}>
          {optionListArr.map((option) => {
            return (
              <Option key={option.value} value={option.value} label={renderOptionLabel(option.label)}>
                <span>{option.label}</span>
              </Option>
            );
          })}
        </Select>
        {renderSelectDateInfo()}
      </div>
      {renderError()}
    </div>
  );
}
