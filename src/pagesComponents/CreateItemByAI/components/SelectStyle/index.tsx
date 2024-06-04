import { Radio } from 'antd5/';
import AnimeImage from 'assets/images/nftAi/anime.jpeg';
import CartoonImage from 'assets/images/nftAi/cartoon.jpeg';
import FilmImage from 'assets/images/nftAi/film.jpeg';
import PixelImage from 'assets/images/nftAi/pixel.jpeg';
import SketchImage from 'assets/images/nftAi/sketch.jpeg';
import FuturisticImage from 'assets/images/nftAi/futuristic.jpeg';
import clsx from 'clsx';
import { ImageEnhance } from 'components/ImgLoading';

export function SelectStyle(props: any) {
  const styleListArr = [
    {
      value: 'Pixel',
      label: 'Pixel',
      icon: PixelImage,
    },
    {
      value: 'Cartoon',
      label: 'Cartoon',
      icon: CartoonImage,
    },
    {
      value: 'Anime',
      label: 'Anime',
      icon: AnimeImage,
    },
    {
      value: 'Technology',
      label: 'Futuristic',
      icon: FuturisticImage,
    },
    {
      value: 'Film',
      label: 'Film',
      icon: FilmImage,
    },
    {
      value: 'Sketch',
      label: 'Sketch',
      icon: SketchImage,
    },
  ];

  return (
    <Radio.Group value={props.value}>
      <div className=" grid grid-cols-3 gap-x-5 mdl:gap-x-12 gap-y-4 ">
        {styleListArr.map((item) => {
          return (
            <div
              key={item.value}
              className="inline-flex flex-col gap-y-2 items-center justify-center cursor-pointer"
              onClick={() => {
                props.onChange?.(item.value);
              }}>
              <ImageEnhance
                src={item.icon.src}
                wrapperClassName={clsx(
                  '!rounded-lg overflow-hidden box-border max-w-44 max-h-44',
                  props.value === item.value && ' border-2 border-solid border-brandNormal',
                )}
                className={' max-w-44 max-h-44 '}
              />
              <Radio value={item.value} className="mt-2" />
              <span className=" text-base font-medium text-textPrimary">{item.label}</span>
            </div>
          );
        })}
      </div>
    </Radio.Group>
  );
}
