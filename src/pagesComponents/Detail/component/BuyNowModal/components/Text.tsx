import { InputNumber } from 'antd';

function Text(props: any) {
  const { title, value, className } = props;
  return (
    <>
      <div className={`${className} flex justify-between text-textSecondary  text-[16px]`}>
        <span className="">{title}</span>
        <span className="text-textPrimary font-medium">{value}</span>
      </div>
    </>
  );
}

const TotalPrice = (props: any) => {
  const { title = 'Total Price', elf, usd, className } = props;

  return (
    <div className={`${className} flex justify-between text-textPrimary font-semibold text-[16px]`}>
      <div className="">{title}</div>
      <div className="flex items-end flex-col">
        <div>{elf}</div>
        <div className="mt-[4px] text-[14px] mdl:text-[14px] text-textSecondary font-normal">{usd}</div>
      </div>
    </div>
  );
};

const BalanceText = (props: any) => {
  const { value, className, totalPrice } = props;

  return (
    <div className={`${className} flex flex-col`}>
      <Text className="mt-[16px]" title="Your balance" value={`${value} ELF`} />
      {Number(totalPrice) > Number(value) && (
        <div className="flex justify-end text-error text-[12px]">Insufficient balance</div>
      )}
    </div>
  );
};

export { Text, TotalPrice, BalanceText };
