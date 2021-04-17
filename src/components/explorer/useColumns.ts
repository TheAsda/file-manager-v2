import { ReactNode, useMemo, useRef, useState } from 'react';
import { FileInfo } from '../../types/file-info';
import { formatDate } from '../../utils/date';

export interface Column<T> {
  key: ColumnKey;
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  sort?: SortDirection;
}

export type SortDirection = 'asc' | 'desc';

export type ColumnKey = keyof Pick<
  FileInfo,
  'name' | 'size' | 'lastModified' | 'created'
>;

export const useColumns = () => {
  const [columns, setColumns] = useState<Record<ColumnKey, Column<FileInfo>>>(
    () => ({
      name: {
        key: 'name',
        header: 'Name',
        accessor: 'name',
        sort: 'asc',
      },
      size: {
        key: 'size',
        header: 'Size',
        accessor: 'size',
      },
      created: {
        key: 'created',
        header: 'Created',
        accessor: (item) => (item.created ? formatDate(item.created) : null),
      },
      lastModified: {
        key: 'lastModified',
        header: 'Modified',
        accessor: (item) =>
          item.lastModified ? formatDate(item.lastModified) : null,
      },
    })
  );
  const sortedColumn = useRef<ColumnKey>('name');

  const toggleSort = (key: ColumnKey) => {
    setColumns((s) => {
      if (sortedColumn.current === key) {
        s[key].sort = s[key].sort === 'asc' ? 'desc' : 'asc';
      } else {
        s[sortedColumn.current].sort = undefined;
        s[key].sort = 'asc';
        sortedColumn.current = key;
      }
      return { ...s };
    });
  };

  const columnsArray = useMemo(() => Object.values(columns), [columns]);

  return {
    columns: columnsArray,
    sortKey: sortedColumn.current,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sortDirection: columns[sortedColumn.current].sort!,
    toggleSort,
  };
};
