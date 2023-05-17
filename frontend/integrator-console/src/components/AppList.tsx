import type { FC } from 'react';
import { useMemo } from 'react';
import type { AppItem } from '../types';
import AppIcon from './AppIcon';

export interface AppListProps {
  list: AppItem[];
  filter?: string;
}

const AppRow: FC<{ item: AppItem }> = ({ item }) => {
  return (
    <tr>
      <td>
        <AppIcon app={item} />
      </td>
      <td>{item.name}</td>
      <td>{item.version}</td>
      <td>{item.developer}</td>
      <td className='text-right'>{item.lastUpdated.toRelative()}</td>
    </tr>
  );
};

const AppList: FC<AppListProps> = (props) => {
  const { list, filter } = props;
  const filtered = useMemo(() => {
    if (filter == null || filter.length === 0) {
      return list;
    }
    return list.filter((item) => item.name.includes(filter));
  }, [list, filter]);

  return (
    <table className='table-auto border-separate border-spacing-2'>
      <thead>
        <tr className='bg-indigo-50'>
          <th className='rounded px-2'>Icon</th>
          <th className='rounded px-2'>name</th>
          <th className='rounded px-2'>version</th>
          <th className='rounded px-2'>developer</th>
          <th className='rounded px-2'>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((item) => (
          <AppRow key={item.appId} item={item} />
        ))}
      </tbody>
    </table>
  );
};

export default AppList;
