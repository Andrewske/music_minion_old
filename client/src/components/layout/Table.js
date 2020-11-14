import React, { useEffect, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from 'react-bootstrap/Table';
import EditableCell from './EditableCell';

const defaultPropGetter = () => ({});

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

const Table = ({
  columns,
  data,
  skipPageReset,
  updateMyData,
  newHiddenColumns,
  getCellProps = defaultPropGetter,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
}) => {
  // const [hiddenColumns, setHiddenColumns] = useState([
  //   'track_id',
  //   'playlist_tags',
  //   'misc_tags',
  // ]);
  useEffect(() => {
    console.log(newHiddenColumns);
  }, [newHiddenColumns]);

  const editable = ['genre_tags', 'playlist_tags', 'misc_tags'];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
      setHiddenColumns: newHiddenColumns,
      initialState: {
        hiddenColumns: newHiddenColumns,
      },
    },
    useSortBy
  );

  return (
    //<div className='tableWrap'>
    <BTable
      className='tracks-table'
      responsive
      hover
      variant='dark'
      {...getTableProps()}
    >
      <thead className=' tracks-table-head'>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    // Return an array of prop objects and react-table will merge them appropriately
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell),
                    ])}
                  >
                    {editable.includes(cell.column.id)
                      ? cell.render('Cell', { editable: true, cell: cell })
                      : cell.render('Cell', { editable: false })}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </BTable>
    //</div>
  );
};

export default Table;
