import * as migration_20260530_045706_initial from './20260530_045706_initial';

export const migrations = [
  {
    up: migration_20260530_045706_initial.up,
    down: migration_20260530_045706_initial.down,
    name: '20260530_045706_initial'
  },
];
