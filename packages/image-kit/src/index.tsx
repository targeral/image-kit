import { useEffect, useState } from 'react';
import type { ImageName } from './types';
import './index.less';

export type * from './types';

export interface ImageProps {
  name: ImageName;
  circle?: boolean;
  imgCls?: string;
  imgStyle?: React.CSSProperties;
  id?: string;
}

export const Image = ({ name, circle, imgCls, imgStyle, id }: ImageProps) => {
  const [imgSource, setImgSource] = useState<string | null>(null);
  useEffect(() => {
    import(`image-kit/assets/${name}.jpg`).then(res => {
      console.info(res);
      setImgSource(res.default);
    });
  }, [name]);

  let ele = imgSource ? (
    <img
      id={id}
      className={imgCls}
      style={imgStyle}
      src={imgSource}
      alt={name}
    ></img>
  ) : (
    <></>
  );

  if (circle) {
    ele = <div className="image-kit-circle">{ele}</div>;
  }

  return ele;
};
