import {
  categories,
  habitLogs,
  habits,
  settings,
  targets,
  users,
} from './schema';

type TableName = 'users' | 'categories' | 'habits' | 'habitLogs' | 'targets' | 'settings';
type Row = Record<string, boolean | number | string | null>;
type Store = Record<TableName, Row[]>;
type EqualityComparison = {
  key: string;
  value: boolean | number | string | null;
};
type ConditionChunk = {
  name?: string;
  table?: unknown;
  value?: boolean | number | string | null | unknown[];
  queryChunks?: ConditionChunk[];
};

const tableNames = new Map<unknown, TableName>([
  [users, 'users'],
  [categories, 'categories'],
  [habits, 'habits'],
  [habitLogs, 'habitLogs'],
  [targets, 'targets'],
  [settings, 'settings'],
]);

const rows: Store = {
  users: [],
  categories: [],
  habits: [],
  habitLogs: [],
  targets: [],
  settings: [],
};

const idCounters: Record<TableName, number> = {
  users: 1,
  categories: 1,
  habits: 1,
  habitLogs: 1,
  targets: 1,
  settings: 1,
};

const getTableName = (table: unknown) => {
  const tableName = tableNames.get(table);

  if (!tableName) {
    throw new Error('Unsupported web preview table.');
  }

  return tableName;
};

const toRowKey = (columnName: string) =>
  columnName.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

const cloneRows = (items: Row[]) => items.map((item) => ({ ...item }));

const extractComparisons = (condition: unknown): EqualityComparison[] => {
  const comparisons: EqualityComparison[] = [];

  const walk = (chunks: ConditionChunk[] = []) => {
    chunks.forEach((chunk, index) => {
      if (chunk.queryChunks) {
        walk(chunk.queryChunks);
      }

      const valueChunk = chunks[index + 2];
      const value = valueChunk?.value;

      if (chunk.name && chunk.table && value !== undefined && !Array.isArray(value)) {
        comparisons.push({
          key: toRowKey(chunk.name),
          value: value as EqualityComparison['value'],
        });
      }
    });
  };

  const root = condition as ConditionChunk | undefined;
  walk(root?.queryChunks);

  return comparisons;
};

const matchesCondition = (row: Row, condition?: unknown) => {
  if (!condition) return true;

  const comparisons = extractComparisons(condition);
  if (comparisons.length === 0) return true;

  return comparisons.every((comparison) => row[comparison.key] === comparison.value);
};

const applyDefaults = (tableName: TableName, row: Row): Row => {
  const next = { ...row };

  if (next.id === undefined || next.id === null) {
    next.id = idCounters[tableName];
  }

  idCounters[tableName] = Math.max(idCounters[tableName], Number(next.id) + 1);

  if (tableName === 'habits') {
    next.metricType ??= 'count';
    next.isArchived ??= false;
  }

  if (tableName === 'habitLogs') {
    next.value ??= 1;
    next.completed ??= true;
  }

  return next;
};

const cascadeDeletes = (tableName: TableName, deletedRows: Row[]) => {
  if (deletedRows.length === 0) return;

  if (tableName === 'users') {
    const userIds = new Set(deletedRows.map((row) => row.id));
    rows.habitLogs = rows.habitLogs.filter((row) => !userIds.has(row.userId));
    rows.targets = rows.targets.filter((row) => !userIds.has(row.userId));
    rows.habits = rows.habits.filter((row) => !userIds.has(row.userId));
    rows.categories = rows.categories.filter((row) => !userIds.has(row.userId));
    rows.settings = rows.settings.filter((row) => !userIds.has(row.userId));
  }

  if (tableName === 'habits') {
    const habitIds = new Set(deletedRows.map((row) => row.id));
    rows.habitLogs = rows.habitLogs.filter((row) => !habitIds.has(row.habitId));
    rows.targets = rows.targets.filter((row) => !habitIds.has(row.habitId));
  }

  if (tableName === 'categories') {
    const categoryIds = new Set(deletedRows.map((row) => row.id));
    rows.targets = rows.targets.filter((row) => !categoryIds.has(row.categoryId));
  }
};

class SelectQuery {
  constructor(private tableName: TableName) {}

  where(condition: unknown) {
    return Promise.resolve(cloneRows(rows[this.tableName].filter((row) => matchesCondition(row, condition))));
  }

  then<TResult1 = Row[], TResult2 = never>(
    onfulfilled?: ((value: Row[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return Promise.resolve(cloneRows(rows[this.tableName])).then(onfulfilled, onrejected);
  }
}

class InsertQuery {
  constructor(private insertedRows: Row[]) {}

  returning() {
    return Promise.resolve(cloneRows(this.insertedRows));
  }

  then<TResult1 = Row[], TResult2 = never>(
    onfulfilled?: ((value: Row[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return Promise.resolve(cloneRows(this.insertedRows)).then(onfulfilled, onrejected);
  }
}

export const db = {
  select: () => ({
    from: (table: unknown) => new SelectQuery(getTableName(table)),
  }),
  insert: (table: unknown) => ({
    values: (value: Row | Row[]) => {
      const tableName = getTableName(table);
      const values = Array.isArray(value) ? value : [value];
      const insertedRows = values.map((item) => applyDefaults(tableName, item));

      rows[tableName].push(...insertedRows);

      return new InsertQuery(insertedRows);
    },
  }),
  update: (table: unknown) => ({
    set: (patch: Row) => ({
      where: (condition: unknown) => {
        const tableName = getTableName(table);
        rows[tableName] = rows[tableName].map((row) =>
          matchesCondition(row, condition) ? { ...row, ...patch } : row
        );

        return Promise.resolve();
      },
    }),
  }),
  delete: (table: unknown) => ({
    where: (condition: unknown) => {
      const tableName = getTableName(table);
      const deletedRows = rows[tableName].filter((row) => matchesCondition(row, condition));
      rows[tableName] = rows[tableName].filter((row) => !matchesCondition(row, condition));
      cascadeDeletes(tableName, deletedRows);

      return Promise.resolve();
    },
  }),
};
