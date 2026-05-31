import * as migration_20260530_064611_initial from './20260530_064611_initial';
import * as migration_20260530_075054_add_lab_reports from './20260530_075054_add_lab_reports';
import * as migration_20260530_120000_clean_product_names from './20260530_120000_clean_product_names';
import * as migration_20260531_010000_add_show_lab_reports from './20260531_010000_add_show_lab_reports';

export const migrations = [
  {
    up: migration_20260530_064611_initial.up,
    down: migration_20260530_064611_initial.down,
    name: '20260530_064611_initial',
  },
  {
    up: migration_20260530_075054_add_lab_reports.up,
    down: migration_20260530_075054_add_lab_reports.down,
    name: '20260530_075054_add_lab_reports',
  },
  {
    up: migration_20260530_120000_clean_product_names.up,
    down: migration_20260530_120000_clean_product_names.down,
    name: '20260530_120000_clean_product_names'
  },
  {
    up: migration_20260531_010000_add_show_lab_reports.up,
    down: migration_20260531_010000_add_show_lab_reports.down,
    name: '20260531_010000_add_show_lab_reports',
  },
];
