
/* Library */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getLabels } from '../../../../../pages/global/Labels/actions'
import routeconfig from '../../../../../config/routeconfig'
import commonUtil from '../../../../../utils/commonUtil'
import Button from '../../../../../lib/ZUILib/Button'
import SelectionTab from '../../../../../lib/ZUILib/SelectionTab'
import Link from '../../../../../lib/ZUILib/Link'
import Pagination from '../../../../../lib/Pagination'
import * as predeterminedListsActions from '../actions'
import Image from '../../../../../../src/lib/ZUILib/Image'
import appconfig from '../../../../../config/appconfig'
// import Image from 'lib/ZUILib/Image'
/* eslint-disable*/

const {
   getPredeterminedListPageItemsInfo,
    getpredeterminedListPageHeaderInfo
  } = predeterminedListsActions;

@connect(store => ({
    labels: store.labels.labels,
    lables: store.labels.data,
    error: store.labels.error,
    loading: store.labels.loading,
    extraData: store.labels.extraData,
    predeterminHeaderInfo: store.predeterminedLists,
}),
    {
        getLabels,
        ...predeterminedListsActions,
    })

class PredeterminedListsDetails extends Component {
    constructor(props) {
        super(props)
        this.catId = '';
        this.price = '';
        this.currentPage = 1;
        this.state = {
            filteredCategoryValue: '',
        }
        this.sortFilter = ''
        this.catFilter = ''

    }
    handleAddListToMyList = (repoId) => {

        this.props.onAddListToMyList(repoId, this.props.eventId);
    }



    componentWillMount() {
        this.props.getpredeterminedListPageHeaderInfo(this.props.brand, this.props.params.repoId);
        this.props.getPredeterminedListPageItemsInfo(this.props.brand, this.props.params.repoId, '1');

    }

    componentWillReceiveProps(nextProps) {
        this.predeterminedItemInfo = nextProps.predeterminedHeaderInfo ?
            nextProps.predeterminedHeaderInfo.predeterminedItemInfo : null;


        this.categoryList = nextProps.predeterminedItemsDetailsInfo ?
            nextProps.predeterminedItemsDetailsInfo.categoryList : null;

        this.pagerecords = nextProps.predeterminedItemsDetailsInfo ?
            nextProps.predeterminedItemsDetailsInfo : null;


        this.categoryItemsInfo = nextProps.predeterminedItemsDetailsInfo ?
            nextProps.predeterminedItemsDetailsInfo.itemsInfo : null;
    }
    filterAndSorting = (type, e) => {
        let catId = '';
        let price = '';
        if (type === 'category') {
            this.catFilter = e.currentTarget.selectedOptions[0].id;
        } else if (type === 'price') {
            this.sortFilter = e.currentTarget.selectedOptions[0].id;
        }
        this.props.getPredeterminedListPageItemsInfo(this.props.brand, this.props.params.repoId, '1', this.catFilter, this.sortFilter);
        if (this.catFilter !== '') {
            if (e.target.value !== 'HighToLow' && e.target.value !== 'LowToHigh' && e.target.value !== 'Ordenar por precio') {
                this.first.style.display = 'block';
                this.setState({
                    filteredCategoryValue: e.target.value,
                });
            }
        } else {
            this.first.style.display = 'none';
            this.setState({
                filteredCategoryValue: e.target.value,
            });
        }

    }
    onPageChange = (value) => {
        this.props.getPredeterminedListPageItemsInfo(this.props.brand, this.props.params.repoId, (value).toString(), (this.catId || ''), (this.price || ''));
    }

    generateHeaderInfo = (predeterminedItemInfo) => {
        const buttonAttr1 = {

            className: 'btnPrimary size-ExtraLarge',
            // href: commonUtil.generateRedirect('' + routeconfig.registeredgifts, { 'eventId': this.props.eventId }),

        };
        const addPredeterminedItemInfo = this.props.addPredeterminedItemInfo ? this.props.addPredeterminedItemInfo[0] : null;


        if (predeterminedItemInfo) {
            return predeterminedItemInfo.map((predeterminedItemInfo, index) => {
                const newAddListButton = Object.assign({}, buttonAttr1);
                newAddListButton.onClickHandler = () => { this.handleAddListToMyList(predeterminedItemInfo.repoId); };
                return (<div key={index}>
                    <div className="col-xs-5 listInfo">
                        <h1 >{predeterminedItemInfo.itemName.toUpperCase()} </h1>
                        <p className="articles">{predeterminedItemInfo.noOfItems} <span>{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.total.articles')}</span></p>
                        <p className="range">{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.gifts.label1')} <span> {commonUtil.getCurrency(predeterminedItemInfo.minPrice)} </span> {commonUtil.getLabel(this.props.labels, 'predetermine.listpage.gifts.label2')} <span> {commonUtil.getCurrency(predeterminedItemInfo.maxPrice)} </span></p>
                        <p className="totalValue">{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.total.label')} {commonUtil.getCurrency(predeterminedItemInfo.totalPrice)}</p>
                    </div>
                    <div className="col-xs-7 addList">
                        <Button {...buttonAttr1} onClick={(repoId) => this.handleAddListToMyList(predeterminedItemInfo.repoId)}>{commonUtil.getLabel(this.props.labels, 'predetermine.addtolist.button.label')}<i className="iconRight icon-flecha_lightsvg_derecha"></i></Button>
                        {/* <InputButton buttonAttr={newAddListButton} /> */}
                    </div>
                </div>);
            });

        }
        return null;
    }


    render() {
        const addPredeterminedItemInfo = this.props.addPredeterminedItemButton ? this.props.addPredeterminedItemButton.predeterminedItemInfo : null;
        const addPredeterminedItemInfo3 = this.props.addPredeterminedItemInfo ? this.props.addPredeterminedItemInfo[0] : null;

        const predeterminHeaderInfo = this.props.predeterminHeaderInfo && this.props.predeterminHeaderInfo.data && this.props.predeterminHeaderInfo.data.predeterminedHeaderInfo && this.props.predeterminHeaderInfo.data.predeterminedHeaderInfo.predeterminedItemInfo;

        if (!this.predeterminedItemInfo && !this.categoryList && !this.categoryItemsInfo && !addPredeterminedItemInfo && !this.pagerecords) {
            return null;
        }

        let categoryList = [];
        categoryList.push({ id: '', value: commonUtil.getLabel(this.props.labels, 'predetermine.listpage.categoty.dropdown.label') })
        if (this.categoryList) {
            this.categoryList.map(selectedCelebratedName => categoryList.push({ id: selectedCelebratedName.catId, value: selectedCelebratedName.catName }))
        }


        const pagerecords = this.pagerecords;

        const paginationInfo = {
            totalNoOfRecords: pagerecords ? pagerecords.totalRecords : '',
            recordsPerPage: pagerecords ? pagerecords.recordsPerPage : '',
            currentPage: pagerecords ? pagerecords.currentPage : '',

        };


        const PriceBasedSorting = {
            options: [{
                id: '',
                value: 'Ordenar por precio',
                // labelResourceId: 'Ordenar por precio',
                labelResourceId: commonUtil.getLabel(this.props.labels, 'predetermine.listpage.price.dropdown.label'),
                disabled: false,
            },
            {
                id: 'Ascending',
                value: 'LowToHigh',
                labelResourceId: commonUtil.getLabel(this.props.labels, 'predetermined.lowtohigh.label'),
                disabled: false,
            }, {
                id: 'Descending',
                value: 'HighToLow',
                labelResourceId: commonUtil.getLabel(this.props.labels, 'predetermined.highToLow.label'),
                disabled: false,
            }],
        };
        const returnToRegisteredGifts = {
            text: 'Link Text',
            children: 'Regresar a regalos registrados',

            href: commonUtil.generateRedirect('' + routeconfig.registeredgifts, { 'eventId': this.props.eventId }),

        };


        return (
            <div className="container">
                <div className="row listHeader">

                    <div className="col-xs-12">
                        <Link {...returnToRegisteredGifts}>{commonUtil.getLabel(this.props.labels, 'predetermined.regrassar.label')}</Link>
                    </div>
                    {this.generateHeaderInfo(predeterminHeaderInfo)}

                </div>
                <div className="row actionsBlock">

                    <div className="col-xs-3 priceFilter">
                        <SelectionTab
                            classname="cSelect filters"
                            options={PriceBasedSorting.options}
                            optionText={'labelResourceId'}
                            optionValue={'value'}
                            onChange={(e) => this.filterAndSorting('price', e)}
                        />
                    </div>
                    <div className="col-xs-3 categoryFilter">

                        <SelectionTab
                            classname="cSelect filters"
                            /* optionCaption={commonUtil.getLabel(this.props.labels, 'predetermine.listpage.categoty.dropdown.label')} */
                            options={categoryList}
                            optionText={'value'}
                            optionValue={'value'}
                            onChange={(e) => this.filterAndSorting('category', e)}
                        />
                    </div>
                    <div className="col-xs-3 col-xs-offset-3 paginator">

                        {pagerecords && pagerecords.totalRecords && (pagerecords.totalRecords > pagerecords.recordsPerPage) ?
                            <Pagination paginationInfo={paginationInfo} onPageChange={this.onPageChange} />
                            :
                            null
                        }
                    </div>
                </div>


                <div className="row itemsList">
                    <h4 className="informativeTextSecond" ref={first => this.first = first} style={{ display: 'none' }}>{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.category.label')} <span>{this.state.filteredCategoryValue} </span></h4>

                    {this.categoryItemsInfo && this.categoryItemsInfo.map(info => (
                        <div className="col-xs-3" >

                            <div className="productBlock">
                                <Image src={info.imageURL} altimg={appconfig.defaultImage} />

                                <h4 className="articleName">{info.itemName}</h4>
                                <p className="informativeTextSecond">{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.prodcut.code.label')}:{info.productCode}</p>
                                <p className="productPrice">{commonUtil.getCurrency(info.price)}</p>
                            </div>
                        </div>

                    ))}</div>

                <div className="row">
                    <div className="col-xs-3 col-xs-offset-9 paginator paginatorBottom" />
                </div>
            </div>


        );
    }
}
const mapStateToProps = state => ({
    myData: state,


    predeterminedHeaderInfo: state.predeterminedLists.data.predeterminedHeaderInfo,
    predeterminedItemsDetailsInfo: state.predeterminedLists.data.predeterminedItemsDetailsInfo,

});
const matchDispatchToProps = dispatch => bindActionCreators({

    getpredeterminedListPageHeaderInfo,
    getPredeterminedListPageItemsInfo,


}, dispatch);
export default connect(mapStateToProps, matchDispatchToProps)(PredeterminedListsDetails);

