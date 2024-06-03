// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AssetsImagesData {}

export type ImageName = keyof AssetsImagesData;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ImageKit {
  type Props<IName = any> = {
    name: IName;
  };
  export type Image<IName = string> = (props: Props<IName>) => JSX.Element;
}
