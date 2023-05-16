import { DateTime } from 'luxon';
import { ulid } from 'ulid';
import type { AppItem, RequestItem } from '../types';

export const defaultRequestList: RequestItem[] = [
  {
    id: ulid(),
    status: 'Accepted',
    created: DateTime.local(),
    lastUpdated: DateTime.local(),
    appIds: ['com.spotify.music'],
  },
  {
    id: ulid(),
    status: 'Building',
    created: DateTime.local().plus({ minutes: -3 }),
    lastUpdated: DateTime.local().plus({ minutes: -2 }),
    appIds: ['com.xevo.apps.mail', 'com.xevo.apps.maps'],
  },
  {
    id: ulid(),
    status: 'Finished',
    created: DateTime.local().plus({ minutes: -12 }),
    lastUpdated: DateTime.local().plus({ minutes: -8 }),
    appIds: ['com.spotify.music', 'com.xevo.apps.music', 'com.xevo.apps.phone'],
    url: '/data/result.zip',
  },
  {
    id: ulid(),
    status: 'Finished',
    created: DateTime.local().plus({ minutes: -18 }),
    lastUpdated: DateTime.local().plus({ minutes: -13 }),
    appIds: [
      'com.xevo.apps.mail',
      'com.xevo.apps.maps',
      'com.xevo.apps.message',
    ],
    url: '/data/result.zip',
  },
  {
    id: ulid(),
    status: 'Failed',
    created: DateTime.local().plus({ minutes: -23 }),
    lastUpdated: DateTime.local().plus({ minutes: -22 }),
    appIds: ['com.xevo.apps.weather'],
  },
];

export const defaultAppList: AppItem[] = [
  {
    appId: 'com.spotify.music',
    name: 'Spotify',
    version: '8.6.24',
    iconUrl: '/icons/spotify.png',
    description: 'Music streaming service',
    lastUpdated: DateTime.local(),
    developer: 'Spotify',
  },

  {
    appId: 'com.xevo.apps.mail',
    name: 'Mail',
    version: '1.0.0',
    iconUrl: '/icons/mail.png',
    description: 'Mail client',
    lastUpdated: DateTime.local(),
    developer: 'Xevo',
  },
  {
    appId: 'com.xevo.apps.maps',
    name: 'Maps',
    version: '1.0.0',
    iconUrl: '/icons/maps.png',
    description: 'Maps client',
    lastUpdated: DateTime.local(),
    developer: 'Xevo',
  },
  {
    appId: 'com.xevo.apps.message',
    name: 'Message',
    version: '1.0.0',
    iconUrl: '/icons/message.png',
    description: 'Message client',
    lastUpdated: DateTime.local(),
    developer: 'Xevo',
  },
  {
    appId: 'com.xevo.apps.music',
    name: 'Music',
    version: '1.0.0',
    iconUrl: '/icons/music.png',
    description: 'Music client',
    lastUpdated: DateTime.local(),
    developer: 'Xevo',
  },
  {
    appId: 'com.xevo.apps.phone',
    name: 'Phone',
    version: '1.0.0',
    iconUrl: '/icons/phone.png',
    description: 'Phone client',
    lastUpdated: DateTime.local(),
    developer: 'Xevo',
  },
  {
    appId: 'com.xevo.apps.weather',
    name: 'Weather',
    version: '1.0.0',
    iconUrl: '/icons/weather.png',
    description: 'Weather client',
    lastUpdated: DateTime.local(),
    developer: 'Xevo',
  },
];
