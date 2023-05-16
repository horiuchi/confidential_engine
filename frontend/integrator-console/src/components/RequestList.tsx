import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { MergedRequestItem } from '../actions/requests';

export interface RequestListProps {
  list: MergedRequestItem[];
  filter?: string;
}

const RequestRow: FC<{ item: MergedRequestItem }> = ({ item }) => {
  return (
    <>
      <div className=''>
        {item.url != null ? (
          <Link href={item.url} className='text-blue-600 underline'>
            {item.id}
          </Link>
        ) : (
          item.id
        )}
      </div>
      <div className=''>{item.status}</div>
      <div className='text-right'>{item.lastUpdated.toRelative()}</div>
      <div className='flex'>
        {item.apps.map((app) => (
          <Image
            className='mr-1'
            key={app.appId}
            src={app.iconUrl}
            alt={app.name}
            width={48}
            height={48}
          />
        ))}
      </div>
    </>
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
    <div className='grid grid-cols-auto-4 items-center justify-items-stretch gap-2 text-xl'>
      <div className='bg-slate-100 text-center font-bold'>ID</div>
      <div className='bg-slate-100 text-center font-bold'>Status</div>
      <div className='bg-slate-100 text-center font-bold'>Last Updated</div>
      <div className='bg-slate-100 text-center font-bold'>Apps</div>

      {filtered.map((item) => (
        <RequestRow key={item.id} item={item} />
      ))}
    </div>
  );
};

export default RequestList;
