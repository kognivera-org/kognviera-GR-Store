import React, { Component } from 'react';

class EventSearchPagination extends Component {

    getPaginationRow = (key, currentPageNumber) => {
        let pageNumber = key + 1;
        let active = currentPageNumber == pageNumber ? 'active' : '';
        return (
            <li key={key}> <a onClick={(event) => this.handlePagination(event)} className={active + ' anchorPaginator'}>{pageNumber}</a></li >
        )
    }
    handlePagination = (e) => {

        this.props.onSearch(e.target.textContent)
    }
    handleNavigate = (action) => {

        let pageNumber = 1;
        let currPage = this.props.searchResults.currentPageNumber;
        let totalResultsMatchedCount = this.props.searchResults.totalResultsMatchedCount;
        let totalPages = totalResultsMatchedCount / 10;
        switch (action) {
            case 'back':
                pageNumber = currPage > 0 ? currPage - 1 : currPage;
                break;
            case 'forth':
                pageNumber = currPage <= totalPages ? +currPage + +1 : currPage;
                break;
            case 'first':
                pageNumber = 1;
                break;
            case 'last':
                pageNumber = Math.ceil(totalPages);
                break;
        }
        this.props.onSearch(pageNumber);
    }
    render() {
        const { searchResults, hideCount } = this.props;
        var currentPageNumber = searchResults.currentPageNumber;
        var totalResultsMatchedCount = searchResults.totalResultsMatchedCount;
        let totalPages = totalResultsMatchedCount / 10;
        let pageLinks = [];
        for (let i = 0; i < totalPages; ++i) {
            pageLinks.push(this.getPaginationRow(i, currentPageNumber));
        }
        return (
            <div className="row">
                <div className="col-xs-8 resultTitle">
                    <h2>Resultados de búsqueda</h2>
                </div>
                <div className="col-xs-12 paginator">
                    {
                        !this.props.hideCount &&
                        <p className="infoResult numPages">{totalResultsMatchedCount}
                            <label className="txtAchorPaginator">&nbsp;resultados</label>
                        </p>
                    }
                    <div className="numberPaginator">
                        <div onClick={() => this.handleNavigate('first')} className="iClass icon-flechas_doble_izquierda anchorPaginator" />
                        <div onClick={() => this.handleNavigate('back')} className="iClass icon-flecha_light_izq anchorPaginator" />
                        <ul className="listPaginator">
                            {pageLinks}
                        </ul>
                        <div onClick={() => this.handleNavigate('forth')} className="iClass icon-flecha_gruesa_derecha anchorPaginator" />
                        <div onClick={() => this.handleNavigate('last')} className="iClass icon-flechas_doble_derecha anchorPaginator" />
                    </div>
                </div>
            </div >
        )
    }
}
export default EventSearchPagination;