import Image from 'next/image';
import type { FC } from 'react';
import type { AppItem } from '../types';

export interface AppIconProps {
  app: AppItem;
  size?: 'small' | 'medium' | 'large';
}

const AppIcon: FC<AppIconProps> = ({ app, size }) => {
  const length = size === 'large' ? 96 : size === 'medium' ? 64 : 48;
  return (
    <Image
      src={app.iconUrl}
      alt={app.name}
      title={app.appId}
      width={length}
      height={length}
    />
  );
};

export default AppIcon;
