import { ReactNode, useMemo } from 'react';
import { FileInfo } from '../../types/file-info';
import { formatDate } from '../../utils/date';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
}

export const useColumns = () => {
  const explorerColumns: Record<
    keyof Pick<FileInfo, 'name' | 'size' | 'lastModified' | 'created'>,
    Column<FileInfo>
  > = useMemo(
    () => ({
      name: {
        header: 'Name',
        accessor: 'name',
      },
      size: {
        header: 'Size',
        accessor: 'size',
      },
      created: {
        header: 'Created',
        accessor: (item) => (item.created ? formatDate(item.created) : null),
      },
      lastModified: {
        header: 'Modified',
        accessor: (item) =>
          item.lastModified ? formatDate(item.lastModified) : null,
      },
    }),
    []
  );

  const columnsArray = useMemo(() => Object.values(explorerColumns), [
    explorerColumns,
  ]);

  return columnsArray;
};
