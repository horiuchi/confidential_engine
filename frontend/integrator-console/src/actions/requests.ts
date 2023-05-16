'use server';

import type { AppItem, RequestItem } from '../types';
import { isNotNull } from '../utils/filter';
import { getAppList } from './apps';
import { defaultRequestList } from './data';

export type MergedRequestItem = Omit<RequestItem, 'appIds'> & {
  apps: AppItem[];
};

export async function getRequestList(): Promise<RequestItem[]> {
  return Promise.resolve(defaultRequestList);
}

export async function getMergedRequestList(): Promise<MergedRequestItem[]> {
  const requestList = await getRequestList();
  const appList = await getAppList();

  return requestList.map((request) => ({
    ...request,
    apps: request.appIds
      .map((appId) => appList.find((app) => app.appId === appId))
      .filter(isNotNull),
  }));
}
