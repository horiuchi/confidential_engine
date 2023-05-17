import { getAppList } from '../actions/apps';
import AppList from './AppList';

export default async function AppForm() {
  const list = await getAppList();

  return <AppList list={list} />;
}
