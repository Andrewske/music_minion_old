import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Moment from 'react-moment';
import { ReactComponent as Play } from '../../img/play-button.svg';

const TableView = ({
  library: {
    playlists: { playlists },
  },
}) => {
  const dateFormatter = (cell, row) => {
    return <Moment format='YYYY/MM/DD'>{row}</Moment>;
  };

  const idFormatter = (cell, row) => {
    return <Play className='svg' />;
  };

  const indication = () => {
    return <h1>No Playlist Data</h1>;
  };

  const headerStyle = (column, colIndex) => {
    return { width: '25px' };
  };
  const columns = [
    {
      dataField: 'playlist_id',
      text: '',
      formatter: idFormatter,
      classes: 'play-button',
      align: 'center',
      headerStyle: headerStyle,
    },
    {
      dataField: 'name',
      text: 'Playlist Name',
    },
    {
      dataField: 'size',
      text: '# of Tracks',
    },
    {
      dataField: 'created_at',
      text: 'Created',
      formatter: dateFormatter,
    },
    // {
    //   dataField: 'updated_at',
    //   text: 'Updated',
    //   formatter: dateFormatter,
    // },
  ];

  const rowClasses = 'playlist-table-row';
  return (
    <BootstrapTable
      keyField='id'
      data={playlists}
      columns={columns}
      bordered={false}
      noDataIndication={indication}
      rowClasses={rowClasses}
    />
  );
};

TableView.propTypes = {};

const mapStateToProps = (state) => ({
  library: state.library,
});
export default connect(mapStateToProps, null)(TableView);
