import Link from 'next/link';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { MergedRequestItem } from '../actions/requests';
import AppIcon from './AppIcon';

export interface RequestListProps {
  list: MergedRequestItem[];
  filter?: string;
}

const RequestRow: FC<{ item: MergedRequestItem }> = ({ item }) => {
  return (
    <tr>
      <td>
        {item.url != null ? (
          <Link href={item.url} className='text-indigo-600 underline'>
            {item.id}
          </Link>
        ) : (
          item.id
        )}
      </td>
      <td>{item.status}</td>
      <td className='text-right'>{item.lastUpdated.toRelative()}</td>
      <td className='flex'>
        {item.apps.map((app) => (
          <div className='mr-1' key={app.appId}>
            <AppIcon app={app} />
          </div>
        ))}
      </td>
    </tr>
  );
};

const RequestList: FC<RequestListProps> = (props) => {
  const { list, filter } = props;
  const filtered = useMemo(() => {
    if (filter == null || filter.length === 0) {
      return list;
    }
    return list.filter((item) => item.id.includes(filter));
  }, [list, filter]);

  return (
    <table className='table-auto border-separate border-spacing-2'>
      <thead>
        <tr className='bg-indigo-50'>
          <th className='rounded'>ID</th>
          <th className='rounded'>Status</th>
          <th className='rounded px-2'>Last Updated</th>
          <th className='rounded'>Apps</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((item) => (
          <RequestRow key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  );
};

export default RequestList;
