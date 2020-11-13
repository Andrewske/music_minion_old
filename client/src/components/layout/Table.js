import React from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from 'react-bootstrap/Table';
import EditableCell from './EditableCell';

const defaultPropGetter = () => ({});

// // Create an editable cell renderer
// const EditableCell = ({
//   value: initialValue,
//   row: { index },
//   column: { id },
//   updateMyData, // This is a custom function that we supplied to our table instance
//   editable,
//   cell,
// }) => {
//   // We need to keep and update the state of the cell normally
//   const [value, setValue] = React.useState(initialValue);

//   const onChange = (e) => {
//     setValue(e.target.value);
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();
//     let track_id = cell.row.values.track_id;
//     let tags = value.split(',');
//     let orginal_tags =
//     console.log(tags);
//   };

//   // We'll only update the external data when the input is blurred
//   const onBlur = () => {
//     updateMyData(index, id, value);
//   };

//   // If the initialValue is changed externall, sync it up with our state
//   React.useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   if (!editable) {
//     return `${initialValue}`;
//   }

//   return (
//     <form onSubmit={onSubmit}>
//       <input value={value} onChange={onChange} onBlur={onBlur} />
//     </form>
//   );
// };

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

const Table = ({
  columns,
  data,
  skipPageReset,
  updateMyData,
  getCellProps = defaultPropGetter,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
      initialState: {
        hiddenColumns: ['track_id'],
      },
    },
    useSortBy
  );

  return (
    //<div className='tableWrap'>
    <BTable
      className='tracks-table'
      //striped
      //bordered
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
                    {cell.column.id === 'tags'
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
