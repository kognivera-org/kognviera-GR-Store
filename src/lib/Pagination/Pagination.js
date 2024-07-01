import React from 'react';

export default class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.pages = [];
    this.firstDisabled = false;
    this.lastDisabled = false;
    this.totalNoOfRecords = this.props.paginationInfo.totalNoOfRecords ? +this.props.paginationInfo.totalNoOfRecords : 1;
    this.recordsPerPage = this.props.paginationInfo.recordsPerPage ? +this.props.paginationInfo.recordsPerPage : 10;
    this.visiblePages = this.props.visiblePages ? +this.props.visiblePages : 5;

    this.state = {
      currentPage: this.props.paginationInfo.currentPage ? +this.props.paginationInfo.currentPage : 1,
    };
  }

  UNSAFE_componentWillMount() {
    this.gotoPage(this.state.currentPage);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.paginationInfo) {
      this.totalNoOfRecords = nextProps.paginationInfo.totalNoOfRecords ? +nextProps.paginationInfo.totalNoOfRecords : 1;
      this.recordsPerPage = nextProps.paginationInfo.recordsPerPage ? +nextProps.paginationInfo.recordsPerPage : 10;
      this.visiblePages = nextProps.paginationInfo.visiblePages ? +nextProps.paginationInfo.visiblePages : 5;
      if (this.state.currentPage !== nextProps.paginationInfo.currentPage) {
        const totalPages = Math.ceil(this.totalNoOfRecords / this.recordsPerPage);
        this.pages = this.getPages(this.state.currentPage, this.visiblePages, totalPages);
      }
    }
  }

  getPages = (currentPage, visiblePages, totalPages) => {
    const pages = [];
    const half = Math.floor(visiblePages / 2);
    let start = currentPage - (half + (1 - (visiblePages % 2)));
    let end = currentPage + half;
    // handle boundary case
    if (start <= 0) {
      start = 1;
      end = visiblePages;
    }
    if (end > totalPages) {
      start = ((totalPages - visiblePages) + 1) > 1 ? ((totalPages - visiblePages) + 1) : 1;
      end = totalPages;
    }
    let itPage = start;
    while (itPage <= end) {
      pages.push(itPage);
      itPage += 1;
    }
    return pages;
  }

  gotoPage = (val) => {
    this.firstDisabled = false;
    this.lastDisabled = false;
    const totalPages = Math.ceil(this.totalNoOfRecords / this.recordsPerPage);
    let currpage = 1;
    switch (val) {
      case 'first':
        currpage = 1;
        break;
      case 'previous':
        currpage = ((this.state.currentPage - 1) < 1) ? 1 : this.state.currentPage - 1;
        break;
      case 'next':
        currpage = (this.state.currentPage + 1) >= totalPages ? totalPages : this.state.currentPage + 1;
        break;
      case 'last':
        currpage = totalPages;
        break;
      default:
        currpage = +val;
        break;
    }
    // For enable/disable buttons on first/last record respectively
    if (currpage === 1) {
      this.firstDisabled = true;
    } else if (currpage === totalPages) {
      this.lastDisabled = true;
    }
    const pages = this.getPages(currpage, this.visiblePages, totalPages);
    this.setState({ currentPage: currpage });
    this.pages = pages;
    if (this.state.currentPage !== currpage && this.props.onPageChange) {
      this.props.onPageChange(currpage);
    }
  }

  render() {
    const numPage = (data, index) => (
      <li onClick={() => { this.gotoPage(data); }} key={index}><a className={(this.state.currentPage === data) ? 'active anchorPaginator' : 'anchorPaginator'} href="javascript:void(0);">{data}</a></li>
    );
    return (
      <div className="numberPaginator" >
        <div className="iClass icon-flechas_doble_izquierda anchorPaginator" disabled={this.firstDisabled ? 'disabled' : ''} onClick={() => { this.gotoPage('first'); }} />
        <div className="iClass icon-flecha_light_izq anchorPaginator" disabled={this.firstDisabled ? 'disabled' : ''} onClick={() => { this.gotoPage('previous'); }} />
        <ul className="listPaginator">
          {this.pages.map(numPage)}
        </ul>
        <div className="iClass icon-flecha_gruesa_derecha anchorPaginator" disabled={this.lastDisabled ? 'disabled' : ''} onClick={() => { this.gotoPage('next'); }} />
        <div className="iClass icon-flechas_doble_derecha anchorPaginator" disabled={this.lastDisabled ? 'disabled' : ''} onClick={() => { this.gotoPage('last'); }} />
      </div>
    );
  }
}
