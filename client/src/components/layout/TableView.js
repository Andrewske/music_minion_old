import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import TableData from './TableData';
import Table from './Table';

const TableView = ({ library: { playlist, artist, tracks } }) => {
  const keys = {
    '8B': '#EE82D9',
    '5A': '#FDBFA7',
    '3B': '#86F24F',
    '12A': '#55F0F0',
    '10B': '#9FB6FF',
    '7A': '#FDAACC',
    '5B': '#FFA07C',
    '2A': '#7DF2AA',
    '12B': '#00EBEB',
    '9A': '#DDB4FD',
    '7B': '#FF81B4',
    '4A': '#E8DAA1',
    '2B': '#3CEE81',
    '11A': '#8EE4F9',
    '9B': '#CE8FFF',
    '6A': '#FDAFB7',
    '4B': '#DFCA73',
    '1A': '#56F1DA',
    '11B': '#56D9F9',
    '8A': '#F2ABE4',
    '6B': '#FF8894',
    '3A': '#AEF589',
    '1B': '#01EDCA',
    '10A': '#BECDFD',
  };

  const header = artist ? artist.name : playlist.name;

  const columns = useMemo(() => [
    {
      Header: header,
      columns: [
        {
          Header: 'Track ID',
          accessor: 'track_id',
          isVisible: true,
        },
        {
          Header: 'Track Name',
          accessor: 'name',
        },
        {
          Header: 'Artists',
          accessor: 'artists',
        },
        {
          Header: 'BPM',
          accessor: 'bpm',
        },
        {
          Header: 'Key',
          accessor: 'key',
        },
        {
          Header: 'Tags',
          accessor: 'tags',
          editable: true,
        },
        {
          Header: 'Duration',
          accessor: 'duration',
        },
        {
          Header: 'Added At',
          accessor: 'added_at',
        },
      ],
    },
  ]);

  const [data, setData] = React.useState(() => TableData(tracks));
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false);
    setData(() => TableData(tracks));
  }, [tracks]);

  return (
    <Table
      columns={columns}
      data={data}
      getCellProps={(cellInfo) => ({
        style: {
          color: keys[cellInfo.value],
        },
      })}
      updateMyData={updateMyData}
      skipPageReset={skipPageReset}
    />
  );
};

TableView.propTypes = {};

const mapStateToProps = (state) => ({
  library: state.library,
});
export default connect(mapStateToProps, null)(TableView);
