import { redirect } from 'next/navigation';
import { getAppList } from '../actions/apps';
import { defaultShellList } from '../actions/data';
import { postBuildRequest } from '../actions/requests';
import type { AppItem, ShellItem } from '../types';
import { AppIcon, ShellIcon } from './Icons';

async function handleSubmitAction(formData: FormData) {
  'use server';
  console.log('handleSubmitAction', formData);
  const shellId = formData.get('shell')?.toString();
  const appIds = formData.getAll('apps').map((value) => value.toString());
  if (shellId == null || appIds.length === 0) {
    console.error('invalid form data');
    return;
  }
  await postBuildRequest(shellId, appIds);
  redirect('/requests');
}

function SelectShells(props: { list: ShellItem[] }) {
  const list = props.list;
  return (
    <>
      <div className='text-2xl'>Select Shell</div>
      <div className='mb-8 flex w-full flex-wrap justify-center'>
        {list.map((shell, index) => (
          <div key={shell.id}>
            <input
              className='peer hidden'
              type='radio'
              id={shell.id}
              name='shell'
              value={shell.id}
              defaultChecked={index === 0}
            />
            <label
              htmlFor={shell.id}
              className='m-2 flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 border-gray-700 p-2 peer-checked:bg-indigo-500 peer-checked:text-gray-50'
            >
              <div className='flex items-center justify-center'>
                <ShellIcon shell={shell} size='large' />
              </div>
              <div className='text-center'>{shell.name}</div>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

function SelectApps(props: { list: AppItem[] }) {
  const list = props.list;
  return (
    <>
      <div className='text-2xl'>Select Apps</div>
      <div className='mb-8 flex w-full flex-wrap justify-center'>
        {list.map((app) => (
          <div key={app.appId}>
            <input
              className='peer hidden'
              type='checkbox'
              id={app.appId}
              name='apps'
              value={app.appId}
            />
            <label
              htmlFor={app.appId}
              className='m-2 flex h-36 w-32 flex-col items-center rounded-lg border-2 border-gray-700 p-2 peer-checked:bg-indigo-500 peer-checked:text-gray-50'
            >
              <div className='flex items-center justify-center'>
                <AppIcon app={app} size='large' />
              </div>
              <div className='text-center'>{app.name}</div>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

export default async function BuildForm() {
  const shells = defaultShellList;
  const apps = await getAppList();

  return (
    <form
      className='flex w-full flex-col items-center justify-between p-8'
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      action={handleSubmitAction}
    >
      <SelectShells list={shells} />
      <SelectApps list={apps} />
      <button
        type='submit'
        className='rounded-lg bg-indigo-500 p-4 text-2xl text-gray-50'
      >
        Start Build
      </button>
    </form>
  );
}
