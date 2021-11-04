import React, { Component } from 'react'
import TablePagination from '@mui/material/TablePagination';

interface IProps {
  perPage: number,
  page: number,
  count: number,
  onPaginationAction: Function
}

export default class TabPagination extends Component<IProps> {

  handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    this.props.onPaginationAction({ action: "CHANGE_PAGE", value: newPage });
  };

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.props.onPaginationAction({ action: "CHANGE_PER_PAGE", value: parseInt(event.target.value) });
  };

  render() {
    const { perPage, page, count } = this.props;
    return (
      <TablePagination
        component="div"
        count={count}
        labelRowsPerPage={"Per page"}
        page={page}
        onPageChange={this.handleChangePage}
        rowsPerPage={perPage}
        onRowsPerPageChange={this.handleChangeRowsPerPage}
      />
    );
  }

}
