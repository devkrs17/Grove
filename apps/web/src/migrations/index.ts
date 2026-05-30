import * as migration_20260530_064611_initial from './20260530_064611_initial';

export const migrations = [
  {
    up: migration_20260530_064611_initial.up,
    down: migration_20260530_064611_initial.down,
    name: '20260530_064611_initial'
  },
];
