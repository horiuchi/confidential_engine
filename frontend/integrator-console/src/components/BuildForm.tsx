import { redirect } from 'next/navigation';
import { getAppList } from '../actions/apps';
import { postBuildRequest } from '../actions/requests';
import AppIcon from './AppIcon';

async function handleSubmitAction(formData: FormData) {
  'use server';
  console.log('handleSubmitAction', formData);
  const values = formData.getAll('apps').map((value) => value.toString());
  await postBuildRequest(values);
  redirect('/requests');
}

export default async function BuildForm() {
  const list = await getAppList();

  return (
    <form
      className='flex w-full flex-col items-center justify-between p-8'
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      action={handleSubmitAction}
    >
      <div className='text-2xl'>Select Apps</div>
      <div className='flex w-full flex-wrap justify-center'>
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
      <div className='my-4'></div>
      <button
        type='submit'
        className='rounded-lg bg-indigo-500 p-4 text-2xl text-gray-50'
      >
        Start Build
      </button>
    </form>
  );
}
