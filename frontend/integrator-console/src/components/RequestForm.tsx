import { getMergedRequestList } from '../actions/requests';
import RequestList from './RequestList';

export default async function RequestForm() {
  const list = await getMergedRequestList();

  return <RequestList list={list} />;
}
