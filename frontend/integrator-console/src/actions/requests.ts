'use server';

import { DateTime } from 'luxon';
import { ulid } from 'ulid';
import type { AppItem, RequestItem } from '../types';
import { isNotNull } from '../utils/filter';
import { getAppList } from './apps';
import { defaultRequestList } from './data';

const list = defaultRequestList;

export type MergedRequestItem = Omit<RequestItem, 'appIds'> & {
  apps: AppItem[];
};

export async function getRequestList(): Promise<RequestItem[]> {
  return Promise.resolve(list);
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

export async function postBuildRequest(appIds: string[]): Promise<RequestItem> {
  const request: RequestItem = {
    id: ulid(),
    status: 'Accepted',
    created: DateTime.local(),
    lastUpdated: DateTime.local(),
    appIds,
  };

  list.unshift(request);
  return Promise.resolve(request);
}
