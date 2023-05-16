'use server';

import type { AppItem } from '../types';
import { defaultAppList } from './data';

export async function getAppList(): Promise<AppItem[]> {
  return Promise.resolve(defaultAppList);
}
