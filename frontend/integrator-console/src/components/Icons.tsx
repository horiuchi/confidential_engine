import Image from 'next/image';
import type { AppItem, ShellItem } from '../types';

export interface AppIconProps {
  app: AppItem;
  size?: 'small' | 'medium' | 'large';
}

export function AppIcon({ app, size }: AppIconProps) {
  return (
    <Icon id={app.appId} name={app.name} iconUrl={app.iconUrl} size={size} />
  );
}

export interface ShellIconProps {
  shell: ShellItem;
  size?: 'small' | 'medium' | 'large';
}

export function ShellIcon({ shell, size }: ShellIconProps) {
  return (
    <Icon id={shell.id} name={shell.name} iconUrl={shell.iconUrl} size={size} />
  );
}

interface IconProps {
  id: string;
  name: string;
  iconUrl: string;
  size?: 'small' | 'medium' | 'large';
}

function Icon({ id, name, iconUrl, size }: IconProps) {
  const length = size === 'large' ? 96 : size === 'medium' ? 64 : 48;
  return (
    <Image src={iconUrl} alt={name} title={id} width={length} height={length} />
  );
}
