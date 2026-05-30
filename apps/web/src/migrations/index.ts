import * as migration_20260530_064611_initial from './20260530_064611_initial';
import * as migration_20260530_120000_clean_product_names from './20260530_120000_clean_product_names';

export const migrations = [
  {
    up: migration_20260530_064611_initial.up,
    down: migration_20260530_064611_initial.down,
    name: '20260530_064611_initial'
  },
  {
    up: migration_20260530_120000_clean_product_names.up,
    down: migration_20260530_120000_clean_product_names.down,
    name: '20260530_120000_clean_product_names'
  },
];
