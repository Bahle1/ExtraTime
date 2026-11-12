import { readFile } from 'node:fs/promises';
import type { CatalogRepository, CatalogSnapshot } from '../catalog.repository.js';
import type { Clock } from '../clock.js';
import {
  MOCK_DATASET_FILES,
  MockDatasetError,
  validateMockDataset,
  type MockDataset,
  type MockDatasetKey,
  type RawMockDataset,
} from './mock-dataset.js';

const DEFAULT_DIRECTORY = new URL('../../data/mock/', import.meta.url);
const WHOLE_FILE_PATH = '$';

/** Options of MockCatalogRepository.fromDirectory. */
export interface MockCatalogOptions {
  readonly clock: Clock;
  /** Directory URL ending in '/'; defaults to src/data/mock. */
  readonly directory?: URL | undefined;
}

/** Serves the visual fixtures as one frozen snapshot, with no latency, failure or mode toggles (LD-17). */
export class MockCatalogRepository implements CatalogRepository {
  private readonly snapshot: CatalogSnapshot;

  /** Stamps generatedAt from the clock and serves source-statuses.json verbatim as meta.sources. */
  constructor(dataset: MockDataset, clock: Clock) {
    const { episodes, hosts, socialPosts, sourceStatuses } = structuredClone(dataset);
    const meta = { generatedAt: clock.now().toISOString(), sources: sourceStatuses };
    this.snapshot = deepFreeze({ episodes, hosts, socialPosts, meta });
  }

  /** Reads and validates the four fixtures; throws MockDatasetError naming each file and JSON path. */
  static async fromDirectory(options: MockCatalogOptions): Promise<MockCatalogRepository> {
    const result = validateMockDataset(await readDataset(options.directory ?? DEFAULT_DIRECTORY));
    if (!result.ok) throw new MockDatasetError(result.issues);
    return new MockCatalogRepository(result.dataset, options.clock);
  }

  /** Resolves the snapshot at once. */
  getSnapshot(): Promise<CatalogSnapshot> {
    return Promise.resolve(this.snapshot);
  }
}

async function readDataset(directory: URL): Promise<RawMockDataset> {
  const [episodes, hosts, socialPosts, sourceStatuses] = await Promise.all([
    readFixture(directory, 'episodes'),
    readFixture(directory, 'hosts'),
    readFixture(directory, 'socialPosts'),
    readFixture(directory, 'sourceStatuses'),
  ]);
  return { episodes, hosts, socialPosts, sourceStatuses };
}

async function readFixture(directory: URL, key: MockDatasetKey): Promise<unknown> {
  const file = MOCK_DATASET_FILES[key];
  const text = await readFile(new URL(file, directory), 'utf8');
  try {
    return JSON.parse(text);
  } catch (error) {
    const issue = { file, path: WHOLE_FILE_PATH, message: 'File is not valid JSON' };
    throw new MockDatasetError([issue], { cause: error });
  }
}

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    const children: unknown[] = Object.values(value);
    children.forEach((child) => deepFreeze(child));
    Object.freeze(value);
  }
  return value;
}
