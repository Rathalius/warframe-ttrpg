// Warframe TTRPG - Central Warframe Dataset Aggregator
import { warframeFoldersBatch1, warframeFeatsBatch1, warframeClassesBatch1, warframeSyncBatch1 } from './data-warframes-1.js';
import { warframeFoldersBatch2, warframeFeatsBatch2, warframeClassesBatch2, warframeSyncBatch2 } from './data-warframes-2.js';
import { warframeFoldersBatch3, warframeFeatsBatch3, warframeClassesBatch3, warframeSyncBatch3 } from './data-warframes-3.js';
import { warframeFoldersBatch4, warframeFeatsBatch4, warframeClassesBatch4, warframeSyncBatch4 } from './data-warframes-4.js';
import { warframeFoldersBatch5, warframeFeatsBatch5, warframeClassesBatch5, warframeSyncBatch5 } from './data-warframes-5.js';

export const newWarframeFolders = [
  ...warframeFoldersBatch1,
  ...warframeFoldersBatch2,
  ...warframeFoldersBatch3,
  ...warframeFoldersBatch4,
  ...warframeFoldersBatch5
];

export const newWarframeFeats = [
  ...warframeFeatsBatch1,
  ...warframeFeatsBatch2,
  ...warframeFeatsBatch3,
  ...warframeFeatsBatch4,
  ...warframeFeatsBatch5
];

export const newWarframeClasses = [
  ...warframeClassesBatch1,
  ...warframeClassesBatch2,
  ...warframeClassesBatch3,
  ...warframeClassesBatch4,
  ...warframeClassesBatch5
];

export const newWarframeSyncData = {
  ...warframeSyncBatch1,
  ...warframeSyncBatch2,
  ...warframeSyncBatch3,
  ...warframeSyncBatch4,
  ...warframeSyncBatch5
};

