import React, { Component } from 'react';
import Link from 'lib/ZUILib/Link';
import routeconfig from 'config/routeconfig';
import SearchBySKU from './searchBySKU';
import SearchResult from './searchResult';
import CommonUtil from '../../../utils/commonUtil';
import RefundsLandingPage from '../RefundsLandingPage';
import { connect } from 'react-redux';
import { clearSearch } from '../actions';
import { getLabels } from '../../global/Labels/actions';
import DownloadPrintHeader from '../../../components/DownloadPrintHeader'
import PrintDownload from '../../global/PrintDownload'

const pageName = 'searchforreturn';

@connect(
    store => ({
        eventId: store.returnAndRefund.eventId,
        labels: store.labels.labels,
    }), { clearSearch, getLabels }
)

class SearchForReturn extends Component {
    constructor(props) {
        super(props);
        this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    }

    state = {
        typeOfSearch: 0,
        showSearchResult: 0,
        showRefunds: false,
        disableDownload: false,
    }
    downloadToPDF = (param) => {
        if (param && param === 'download') {
            this.setState({ disableDownload: true })
            CommonUtil.downloadPdf('.toPrint', 'BúsquedaPorSKU.pdf', 'false', () => {
                this.setState({ disableDownload: false })
            })
        } else if (param && param === 'print') {
            window.print()
        }
    }

    onConfirmClicked = () => {
        this.setState({ showRefunds: !this.state.showRefunds });
    }

    setSearchOption = (e) => {
        this.setState({
            typeOfSearch: e.target.value
        });
    }
    pageHeader = () => {
        return (<div className="col-xs-12">
            <DownloadPrintHeader />
            <h2 className="titleSection">DEVOLUCIONES</h2>
            <div className="row non-printable exclude-for-print-download">
                <div className="col-xs-6">
                    <p className="descriptiveText">{CommonUtil.getLabel(this.props.labels, 'initiatereturn.info.message')}</p>
                </div>
                <div className="col-xs-6 alignRight">
                    <div className="iconWrap">
                        {/* <Link disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('download')} href="javascript:void(0)"><i className="icon-descarga" /></Link>
                        <Link disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('print')} href="javascript:void(0)"><i className="icon-imprimir" /></Link> */}
                        <PrintDownload useIframe={true} elem='.toPrint' footer='BúsquedaPorSKU' fileName='BúsquedaPorSKU.pdf' usePageHeader='false' index={2} />
                    </div>
                </div>
            </div>
        </div>)
    }
    searchContent = () => {
        return (<div className="row show-grid-row">
            <div className="col-xs-4">
                <div className="cSelect">
                    <select className="selectOptionSku" onChange={(e) => { this.setSearchOption(e) }}>
                        <option disabled="disabled" selected="selected" value="value">Tipo de búsqueda</option>
                        <option value="1">Buscar por SKU</option>
                        <option value="2">Escanear producto</option>
                    </select><i className="icon-caret_down"></i>
                </div>
            </div>
        </div >)
    }

    UNSAFE_componentWillMount() {
        this.props.clearSearch();
    }

    showSearchResultCallBk = (flag) => {
        this.setState({
            showSearchResult: flag
        });
    }

    render() {
        const { showSearch } = this.props;
        return (
            <React.Fragment>
                {!this.state.showRefunds ?
                <div className="toPrint container innerDevolutions">
                    {this.pageHeader()}
                    <div className="searchContent non-printable exclude-for-print-download">
                        {this.searchContent()}
                    </div>
                    <SearchBySKU show={this.state.typeOfSearch} eventId={this.eventId} />
                    <SearchResult show={this.state.typeOfSearch} onConfirmClicked={this.onConfirmClicked} eventId={this.eventId} />
                </div>
                :
                <RefundsLandingPage   {...this.props} onConfirmClicked={this.onConfirmClicked} />  }          
            </React.Fragment>
        );
    }
}

export default SearchForReturn;