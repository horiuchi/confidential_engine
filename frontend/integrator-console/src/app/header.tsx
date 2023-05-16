import Link from 'next/link';

interface TabInfo {
  href: string;
  label: string;
}

const tabs: TabInfo[] = [
  { href: '/', label: 'Build' },
  { href: '/requests', label: 'Requests' },
  { href: '/apps', label: 'Apps' },
];

export default function Header() {
  return (
    <header className='flex h-16 w-full items-center justify-center border-b border-gray-200 bg-white px-8'>
      <div className='flex items-center'>
        {tabs.map((tab, index) => (
          <>
            {index > 0 && <span className='text-xl text-gray-400'>|</span>}
            <Link
              href={tab.href}
              className='m-2 text-xl font-bold text-indigo-500 underline underline-offset-4'
            >
              {tab.label}
            </Link>
          </>
        ))}
      </div>
    </header>
  );
}
