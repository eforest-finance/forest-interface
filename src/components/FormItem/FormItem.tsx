import Required from 'assets/images/required.svg';
import clsx from 'clsx';
import { ReactElement, ReactNode, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

export default function FormItem(options: {
  title: string;
  suffix?: ReactElement;
  require?: boolean;
  description?: ReactElement | string;
  error?: {
    msg: ReactNode;
  };
  children?: ReactElement;
}) {
  const { title, suffix, require, description, children, error } = options;
  const { isSmallScreen } = useSelector(selectInfo);

  return useMemo(
    () => (
      <div
        className={clsx(
          'form-item',
          isSmallScreen && 'mobile-form-item',
          '[&:not(:first-child)]:mt-[24px]',
          'mdTW:[&:not(:first-child)]:mt-[40px]',
        )}>
        <p className="flex items-center font-medium	text-[16px] text-textPrimary">
          <span className="form-title-text">{title}</span>
          {suffix ? <span className="ml-[8px] flex items-center h-[27px]">{suffix}</span> : null}
          {require ? <Required className="ml-[9px] mr-[-2px]" /> : ''}
        </p>
        {description ? (
          <p className="form-description font-medium mt-[8px] text-textSecondary text-[14px] leading-[21px]">
            {description}
          </p>
        ) : null}
        {children}
        {error && <div className="mt-[8px] text-functionalDanger ">{error?.msg}</div>}
      </div>
    ),
    [children, description, require, suffix, title, isSmallScreen, error],
  );
}
