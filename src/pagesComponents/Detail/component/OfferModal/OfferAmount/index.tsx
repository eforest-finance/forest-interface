export default function OfferAmount({
  floor,
  bestOffer,
  onChange,
}: {
  floor: string | number;
  bestOffer: string | number;
  onChange: (price: number | string) => void;
}) {
  const handleClick = (value: string | number) => {
    onChange(value);
  };
  return (
    <>
      <h3 className="text-[18px] leading-[26px] font-medium text-[var(--text-primary)]">Offer amount</h3>
      <div className="grid gap-x-[16px] mt-[16px] grid-cols-2">
        <div
          onClick={() => {
            handleClick(floor);
          }}
          className="flex cursor-pointer items-center justify-center h-[56px] bg-[var(--fill-hover-bg)] rounded-lg text-[16px] leading-[24px] font-medium text-[var(--text-primary)]">
          <span>Floor</span>
          <span className="ml-[16px] font-normal text-[var(--text-secondary)]">{floor} ELF</span>
        </div>
        <div
          onClick={() => {
            handleClick(bestOffer);
          }}
          className="flex items-center cursor-pointer justify-center h-[56px] bg-[var(--fill-hover-bg)] rounded-lg text-[16px] leading-[24px] font-medium text-[var(--text-primary)]">
          <span>Best offer</span>
          <span className="ml-[16px] font-normal text-[var(--text-secondary)]">{bestOffer} ELF</span>
        </div>
      </div>
    </>
  );
}
