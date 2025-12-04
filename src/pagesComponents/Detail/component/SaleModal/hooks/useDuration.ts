import { useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import { useMount } from 'react-use';

export interface IDurationData {
  type?: 'date' | 'hours' | 'months';
  value?: Date | number | string;
  showPrevious?: boolean;
}

export interface IDurationProps {
  onChange?: (data: IDurationData) => void;
  defaultExpirationData?: IDurationData;
  tooltip?: string;
  checkDateValidate?: (date: Moment) => string;
}

export const optionList = [
  {
    label: '1 hour',
    value: '1 hours',
  },
  {
    label: '6 hours',
    value: '6 hours',
  },
  {
    label: '1 day',
    value: '24 hours',
  },
  {
    label: '3 days',
    value: '72 hours',
  },
  {
    label: '7 days',
    value: '168 hours',
  },
  {
    label: '1 month',
    value: '1 months',
  },
  {
    label: '3 months',
    value: '3 months',
  },
  {
    label: '6 months',
    value: '6 months',
  },
  {
    label: 'custom',
    value: 'custom',
  },
];

export function useDurationService({
  onChange,
  defaultExpirationData,
  checkDateValidate: checkDateValidateProp,
}: IDurationProps) {
  const defaultExpirationType = useMemo(() => {
    if (!defaultExpirationData || !defaultExpirationData?.type) return '';
    if (defaultExpirationData.showPrevious) {
      return 'previous';
    }
    if (defaultExpirationData.type === 'date') {
      return 'custom';
    }
    return `${defaultExpirationData?.value} ${defaultExpirationData?.type}`;
  }, [defaultExpirationData]);

  const defaultSelectedDate = defaultExpirationData?.type === 'date' ? moment(defaultExpirationData?.value) : moment();
  const [expirationType, setExpirationType] = useState(defaultExpirationType || '6 months');
  const [selectedDate, setSelectedDate] = useState<Moment>(defaultSelectedDate);
  const [showPreviousText, setShowPreviousText] = useState<boolean>(!!defaultExpirationData?.showPrevious);
  const [optionListArr, setOptionListArr] = useState(optionList.slice(0));

  const [mobileDateVisible, setMobileDateVisible] = useState(false);

  const [errorTip, setErrorTip] = useState<string>();

  useMount(() => {
    console.log('useDurationService', defaultExpirationData);

    if (!defaultExpirationData?.showPrevious) {
      return;
    }
    setOptionListArr((pre) => {
      return [
        ...pre,
        {
          label: 'Previous Listing',
          value: 'previous',
        },
      ];
    });
  });

  useEffect(() => {
    if (!onChange) return;
    if (expirationType === 'custom') {
      onChange({
        type: 'date',
        value: moment(selectedDate).toDate(),
      });
      return;
    }

    if (expirationType === 'previous') {
      onChange({
        type: 'date',
        value: moment(defaultSelectedDate).toDate(),
        showPrevious: true,
      });
      return;
    }

    const [value, type] = String(expirationType).split(' ');
    if (!type || !value) return;
    onChange({
      type: type as 'hours' | 'months',
      value,
    });
  }, [expirationType, selectedDate, onChange]);

  useEffect(() => {
    if (expirationType === 'previous') {
      const expireDate = moment(defaultSelectedDate);
      setSelectedDate(expireDate);
      checkDateValidate(expireDate);
    }
    const [value, type] = String(expirationType).split(' ');
    if (!type || !value) return;
    const expireDate = moment().add(Number(value), type as 'days' | 'hours' | 'months');
    setSelectedDate(expireDate);
    checkDateValidate(expireDate);
  }, [expirationType]);

  const onSelectDateHandler = (date: Moment) => {
    setExpirationType('custom');
    setSelectedDate(date);
    checkDateValidate(date);
    setShowPreviousText(false);
  };
  const checkDateValidate = (date: Moment) => {
    if (checkDateValidateProp) {
      const errorTip = checkDateValidateProp(date);
      setErrorTip(errorTip);
      return;
    }
    const timeDifference = date.diff(moment());
    const minutesDifference = moment.duration(timeDifference).asMinutes();
    const months = Math.floor(moment.duration(timeDifference).asMonths());
    if (minutesDifference < 15) {
      setErrorTip('The listing duration should be at least 15 minutes.');
    } else if (months > 6) {
      setErrorTip('The listing duration should be no more than 6 months.');
    } else {
      setErrorTip('');
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    expirationType,
    setExpirationType,
    mobileDateVisible,
    setMobileDateVisible,
    onSelectDateHandler,
    errorTip,
    showPreviousText,
    optionListArr,
  };
}
