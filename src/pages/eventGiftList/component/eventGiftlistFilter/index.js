
import React, { Component } from 'react';
import Link from '../../../../lib/ZUILib/Link';
import Button from '../../../../lib/ZUILib/Button';
import BrandFilter from '../BrandFilter'
import commonUtil from '../../../../utils/commonUtil'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import PrintDownload from '../../../global/PrintDownload'

const pageName = 'receivedgifts';

class EventGiftlistFilters extends Component {
    constructor(props) {
        super(props);
        this.tmpFilter = {};
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    state = {
        search: true,
        openAssociate: '',
        disableDownload: false,
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.brand !== nextProps.brand) {
            this.tmpFilter = {};
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    searchValues = (event) => {
        if (event.key === 'Enter' || !this.refs.searchInput.value) {
            this.onSearch();
        } else {
            this.setState({
                search: true
            })
        }
    }
    onSearch = (e) => {
        let searchKeyword = ''
        if (this.state.search) {
            searchKeyword = this.refs.searchInput.value;
        } else {
            this.refs.searchInput.value = searchKeyword;
        }

        if (this.state.search && this.refs.searchInput.value || !this.state.search) {
            this.props.onSearch(searchKeyword);
            this.setState({
                search: !this.state.search
            })
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                openAssociate: ''
            })
        }
    }
    openAssociateTicket = (e) => {
        let classname = ''
        if (this.state.openAssociate === '') {
            classname = 'open';
        }
        this.setState({
            openAssociate: classname
        })
    }
    handleTicket = (e) => {
        this.props.openAssociateTicket(e.target.title);
        this.setState({
            openAssociate: ''
        })

    }
    handleCloseMessage = () => {
        this.props.onClearMessage();
    }

    buildOptions = (optionsObj) => {
        let arr = [];
        optionsObj ? optionsObj.map((value, key) =>
            arr.push(<option key={key + value.name} value={value.id}>{value.name}</option>)
        ) : arr;
        return arr;
    }

    onApplyFilter = (e) => {
        let filterOptions = [];
        this.tmpFilter[e.target.name] = {
            "type": e.target.name,
            "value": e.target.value
        };
        if (e.target.value.toLowerCase() == "value") {
            var prop = e.target.name;
            delete this.tmpFilter[prop];
        }
        Object.keys(this.tmpFilter).map((v, k) => filterOptions.push(this.tmpFilter[v]));
        this.props.onApplyFilter(filterOptions);
    }
    downloadToPDF = async (param) => {
        await this.props.showAllItems()
        setTimeout(() => {
            if (param && param === 'download') {
                this.setState({ disableDownload: true })
                commonUtil.downloadPdf('.toDownload', 'recievedGifts.pdf', 'false', 'REGALOS RECIBIDOS', () => {
                    this.setState({ disableDownload: false })
                })
            } else if (param && param === 'print') {
                window.print()
            }
        }, 500);
    }
    handleBrandSelection = (brandTitle) => {
        this.refs.searchInput.value = '';
        this.props.onFilterByBrand(brandTitle);
    }
    categoryOptions = (categoryOptionsInfo) => {

        const lookup = {}
        const items = categoryOptionsInfo
        const result = []
        result.push({
            id: 'value',
            name: 'Categorias (todas)',
            labelResourceId: 'Categorias (todas)',
            disabled: false,
            selected: true,
        })
        if (!items || items.length === 0) {
            return result;
        }
        let i = 0
        for (let item; item = items[i++];) {
            const categoryInfo = item.name
            const categoryInfoId = item.id
            if (!(categoryInfo in lookup)) {
                lookup[categoryInfo] = 1
                result.push({
                    id: categoryInfoId,
                    name: categoryInfo,
                    labelResourceId: categoryInfo,
                    disabled: false,
                })
            }
        }
        return result
    }

    downloadMessageLabel = () => {
        const downloadargs = {
            filename: 'mensajes-' + this.props.eventId + '.pdf',
            brand: this.props.brand
        }
        return (
            <p className="downloadList"><Link uiname="RecibidosDownloadGuestMessages " href="javascript:void(0)" target="_blank" onClick={() => this.downloadMessage.do('download', downloadargs)}>Descargar mensajes</Link></p>
        )
    }
    render() {
        const { mainTitle, subTitle, listTitle, totalItems, successMessage, categoryList } = this.props;
        const isBonusContainerVisible = commonUtil.isBonusAvailable(this.props.event);
        let searchClass = this.state.search ? 'icon-zoom' : 'iClass icon-tache2';
        const modeOfDeliveryOptions = [{ name: 'Modo de regalos (todos)', id: 'value' }, { name: 'Físicos', id: 'physical' }, { name: 'Electrónicos', id: 'electronic' }];
        const messagesOptions = [{ name: 'Mensajes (todos)', id: 'value' }, { name: 'Con mensaje', id: 'new' }, { name: 'Sin mensaje', id: 'none' }];
        const bonusOptions = [{ name: 'Bonificación (todos)', id: 'value' }, { name: 'Aplica para bonificación', id: 1 }, { name: 'No aplica para bonificación', id: 0 }];
        const CategoryOptions = {
            options: this.categoryOptions(categoryList),
        }
        return (
            <div className="non-printable exclude-for-print-download">
                <div className="row">
                    <div className="col-xs-12">
                        <h2 className="mainTitle">{mainTitle} / <span>{this.props.totalItems}</span></h2>
                        <p className="subTitle">{subTitle}</p>
                        <p className="listTitle">{listTitle}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="listWrapper">
                        <BrandFilter
                            uiname="RecibidosSwitchBrands"
                            onBrandSelection={this.handleBrandSelection}
                        />
                        <hr />
                    </div>
                </div>
                {
                    this.props.successMessage !== '' &&
                    <div className="row">
                        <div className="success-alert">
                            <div className="green"><i className="icon-check"></i></div>
                            <div className="message">
                                <p>{this.props.successMessage}</p>
                            </div>
                            <div className="close-alert">
                                <div className="close-btn"><a className="icon-tache2 btn-white" onClick={this.handleCloseMessage}></a></div>
                            </div>
                        </div>

                    </div>
                }
                <div className="row">
                    <div className="col-xs-3">
                        <div className="input-group searchBtn">

                            <input className="form-control" ref="searchInput" type="text" placeholder="Busca por producto o categoría" onKeyUp={this.searchValues} />

                            <span className="input-group-btn">
                                <Button uiname="RecibidosSearchProduct" className="btn btn-default buttonSearch" onClick={(e) => this.onSearch(e)}><i className={searchClass} /></Button>
                            </span>
                        </div>
                    </div>
                    <div className="col-xs-3">
                        <div className={"btn-group " + this.state.openAssociate} ref="associateTicket" >
                            <Button uiname="RecibidosDissociateTicketSearch" onClick={(e) => this.openAssociateTicket(e)} className="btn btn-default dropdown-toggle btnDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Agregar / eliminar boleta<span className="icon-flecha_gruesa_abajo flecha-abajo" /></Button>
                            {this.state.openAssociate ? <ul ref={this.setWrapperRef} className="dropdown-menu">
                                <li><a onClick={(e) => this.handleTicket(e)} data-toggle="modal" title="add">Agregar boleta</a></li>
                                <li><a onClick={(e) => this.handleTicket(e)} data-toggle="modal" title="delete">Eliminar boleta</a></li>
                            </ul> : null}
                        </div>
                    </div>
                    <div className="col-xs-3">
                        <p className="downloadList"><Link uiname="RecibidosDownloadGuestMessages " href="javascript:void(0)" target="_blank" onClick={this.props.downloadMessages}>Descargar mensajes</Link></p>
                        {/* <DownloadPrint uiname={{
                            download: 'RecibidosDownloadGuestMessages',
                            print: 'RecibidosDownloadGuestMessages'
                        }}
                            ref={downloadMessage => (this.downloadMessage = downloadMessage)}
                            divLabel={this.downloadMessageLabel()}
                            footer='mensajes'
                            template='RecibidosDownloadGuestMessages'
                            eventId={this.props.eventId}
                            filename={{
                                download: 'mensajes-' + this.props.eventId + '.pdf',
                                print: 'mensajes-' + this.props.eventId + '.pdf'
                            }}
                        /> */}
                    </div>
                </div>
                <div className="row ph-15">
                    <div className="grid-five-elements">
                        <div>
                            <div className="cSelect filters">
                                <SelectionTab
                                    required="false"
                                    disableCaption='false'
                                    uiname="RecibidosFilterPurchased"
                                    name="deliveryMode"
                                    onChange={(e) => this.onApplyFilter(e)}
                                    options={modeOfDeliveryOptions}
                                    optionText={'name'}
                                    optionValue={'id'}
                                    value={this.tmpFilter && this.tmpFilter.deliveryMode && this.tmpFilter.deliveryMode.value}
                                />
                                <i className="icon-caret_down" />
                            </div>
                        </div>
                        <div>
                            <div className="cSelect filters">
                                {/* <select name="category" onChange={(e) => this.onApplyFilter(e)}>
                                    <option selected="selected" value="value">Categorias (todas)</option>
                                    {this.buildOptions(categoryList)}
                                </select> */}
                                <SelectionTab
                                    required="false"
                                    disableCaption='false'
                                    uiname="RecibidosFilterPurchased"
                                    name="category"
                                    onChange={(e) => this.onApplyFilter(e)}
                                    options={CategoryOptions.options}
                                    optionText={'name'}
                                    optionValue={'id'}
                                    value={this.tmpFilter && this.tmpFilter.category ? this.tmpFilter.category.value : 'value'}
                                />
                                <i className="icon-caret_down" />
                            </div>
                        </div>
                        <div>
                            <div className="cSelect filters">
                                {/* <select name="message" onChange={(e) => this.onApplyFilter(e)}>
                                    <option selected="selected" value="value">Mensajes (todos)</option>
                                    {this.buildOptions(messagesOptions)}
                                </select> */}
                                <SelectionTab
                                    required="false"
                                    disableCaption='false'
                                    uiname="RecibidosFilterPurchased"
                                    name="message"
                                    onChange={(e) => this.onApplyFilter(e)}
                                    options={messagesOptions}
                                    optionText={'name'}
                                    optionValue={'id'}
                                    value={this.tmpFilter && this.tmpFilter.message && this.tmpFilter.message.value}
                                />
                                <i className="icon-caret_down" />
                            </div>
                        </div>
                        <div>
                            {isBonusContainerVisible ? <div className="cSelect filters">
                                {/* <select name="bonusApplicable" onChange={(e) => this.onApplyFilter(e)}>
                                    <option selected="selected" value="value">Bonificación (todos)</option>
                                    {this.buildOptions(bonusOptions)}
                                </select> */}
                                <SelectionTab
                                    disableCaption='false'
                                    uiname="RecibidosFilterPurchased"
                                    name="bonusApplicable"
                                    onChange={(e) => this.onApplyFilter(e)}
                                    options={bonusOptions}
                                    optionText={'name'}
                                    optionValue={'id'}
                                    value={this.tmpFilter && this.tmpFilter.bonusApplicable ? this.tmpFilter.bonusApplicable.value : 'value'}
                                />
                                <i className="icon-caret_down" />
                            </div> : null}
                        </div>
                        <div className="align-center">
                            <div className="right m-30">
                                {/* <Link className="iClass icon-descarga icono-grande-inline mr-15" disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('download')} />
                                <Link className="iClass icon-imprimir icono-grande-inline" disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('print')} /> */}
                                <PrintDownload brand={this.props.brand} elem='.toDownload' fileName='recievedGifts.pdf' footer='REGALOS RECIBIDOS' usePageHeader='false' callBefore={this.props.showAllItems} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default EventGiftlistFilters;