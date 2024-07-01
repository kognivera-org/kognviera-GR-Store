import React, { Component } from 'react'
import { connect } from 'react-redux'
import SuccessRegisterModal from './modals/successRegisterModal'
import RegisterGiftList from './RegisterGiftList'
import RegisterModal from './modals/registerModal'
import AddressChangeNotApplicableModal from './modals/AddressChangeNotApplicableModal'
import DeliveryModeChangeNotApplicable from './modals/DeliveryModeChangeNotApplicable'
import commonUtil from '../../../utils/commonUtil'
import routeconfig from '../../../config/routeconfig'
import * as request from './requests';
import { getRegisteredGiftList, changeDeliveryAdressAction, addITemBySKU, removeGiftList, changeDeliveryModeAction, saveQuantityAction, setFavouriteGiftAction } from '../action'
import { getLabels } from '../../../pages/global/Labels/actions'
import DownloadPrintHeader from '../../../components/DownloadPrintHeader'

@connect(
    store => ({
        labels: store.labels.labels,
        registeredGiftList: store.giftListManagement,
        loading: store.giftListManagement.loading,
        data: store.giftListManagement.data,
        fail: store.giftListManagement.eventDataFailed,
        event: store.eventdashboard.eventData && store.eventdashboard.eventData.eventDetailsInfo,
        eventStatus: store.header.eventDisplayStatus && store.header.eventDisplayStatus.currentStatus,
    }),
    {
        getLabels,
        getRegisteredGiftList,
        changeDeliveryAdressAction,
        changeDeliveryModeAction,
        addITemBySKU,
        removeGiftList,
        saveQuantityAction,
        setFavouriteGiftAction,
    },
)
class RegisteredGifts extends Component {
    constructor(props) {
        super(props)
        this.eventId = this.props.params.eventId
        this.brand = commonUtil.getBrand();
        this.currentPage = 1;
        this.categoryInfo = []
        this.searchTerm = '';
        this.totalRegisteredGiftsCount = 0;
        this.priceOrder = ''
        this.sortType = ''
        this.priceOrderCategory = ''
    }

    infiniteScrollCondition = props => {
        const totalRecords = this.props.data && this.props.data.registeredGiftList && this.props.data.registeredGiftList.totalRecords ? this.props.data.registeredGiftList.totalRecords : ''
        const categoryInfo = this.categoryInfo;
        let recordsCount = 0
        if (categoryInfo && categoryInfo.length > 0) {
            categoryInfo.forEach((item, index) => {
                const count = item.itemInfo && item.itemInfo.length ? item.itemInfo.length : 0
                recordsCount += count;
            })
        }
        return ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
            && recordsCount < this.totalRegisteredGiftsCount
            && !props.loading)
    }

    onScroll = (e) => {
        e.preventDefault(); //try
        if (this.infiniteScrollCondition(this.props)) {
            this.currentPage++;
            let params = this.getParams();
            params = {
                ...params,
                "searchKeyword": this.searchTerm,
                "currentPage": this.currentPage,
                "priceOrderCategory": this.priceOrderCategory
            }
            this.props.getRegisteredGiftList(params, this.searchTerm, this.sortType);
        }
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.loading && !nextProps.loading && nextProps.data && nextProps.data.registeredGiftList) {
            const payload = nextProps.data;
            const updatedCategoryInfo = [];
            const categoryInfo = payload.registeredGiftList && payload.registeredGiftList.currentPage === '1' ? [] : Object.assign([], this.categoryInfo)
            const categoryItemsInfo = payload.registeredGiftList && payload.registeredGiftList.categoryItemsInfo ? payload.registeredGiftList.categoryItemsInfo : []
            const foundCategories = [];
            if (!payload.registeredGiftList || payload.registeredGiftList.currentPage === '1') {
                this.totalRegisteredGiftsCount = 0;
            }
            if (categoryInfo && categoryInfo.length > 0) {
                categoryInfo.forEach((categoryItem, index) => {
                    let currentItemsArr = undefined;
                    categoryItemsInfo && categoryItemsInfo.length && categoryItemsInfo.map((item, index) => {
                        if (item.categoryName && (item.categoryName === categoryItem.categoryName)) {
                            currentItemsArr = item.itemInfo
                            foundCategories.push(item.categoryName);
                        }
                        return null;
                    })
                    const items = categoryItem ? categoryItem : { itemInfo: [] }
                    items.itemInfo = currentItemsArr ? [...items.itemInfo, ...currentItemsArr] : items.itemInfo
                    updatedCategoryInfo.push(items)
                })
            }
            if (categoryItemsInfo && categoryItemsInfo.length > 0) {
                categoryItemsInfo.forEach((item) => {
                    const catName = item.categoryName;
                    if (foundCategories.indexOf(catName) === -1) {
                        updatedCategoryInfo.push(item);
                    }
                });
            }
            this.categoryInfo = updatedCategoryInfo
        }
    }

    componentDidMount() {
        this.currentPage = 1;
        let params = this.getParams();
    }
    state = {
        selectAllCheckBox: false,
        myStatusAdd: false,
        myStatusMode: false,
        star: false
    }
    getParams = () => {
        const eventId = this.eventId
        let channel = 'INSTORE'
        let brand = this.brand
        let params = {
            eventId: eventId,
            brand: brand,
        }
        return params
    }
    sortByPrice = (priceOrder, categoryName) => {
        this.sortType = priceOrder;
        this.priceOrderCategory = categoryName
        let params = this.getParams()
        params = {
            ...params,
            priceOrderCategory: categoryName
        }
        this.props.getRegisteredGiftList(params, '', priceOrder)
    }
    handleSuccessOpen = (data) => {
        this.successAddSkuModal.handleShow(data)
    }
    UNSAFE_componentWillMount() {
        const params = this.getParams()
        this.props.getRegisteredGiftList(params, '', '', "true")
    }
    searchGifts = (search, searchStatus) => {
        const params = this.getParams()
        this.searchTerm = search;
        if (search === '' && searchStatus === 'closeSearch') {
            this.props.getRegisteredGiftList(params, search, '', "true")
        } else {
            this.props.getRegisteredGiftList(params, search)
        }

    }
    deliveryAddressIds = [];
    changeDeliveryAdressIndex = (addressId, giftItemIds) => {
        this.deliveryAddressIds = giftItemIds;
        let params = this.getParams()
        params = {
            ...params,
            currentPage: this.currentPage,
            addressId: addressId,
            giftItemIds: giftItemIds
        }
        request.changeAddressOfDelivery(params, this.callBackMethodDeliveryAddress)
    }
    callBackMethodDeliveryAddress = (response) => {
        if (response.data && response.data.status === 'success') {
            this.handleBulkAction(response.data.categoryItemsInfo, 'changeDeliveryMode', this.deliveryAddressIds)
        }
    }
    deliveryModeIds = [];
    changeDeliveryMode = (deliveryMode, giftItemIds) => {
        this.deliveryModeIds = giftItemIds
        let params = this.getParams()
        params = {
            ...params,
            currentPage: this.currentPage,
            modeOfDelivery: deliveryMode,
            giftItemIds: giftItemIds
        }
        request.changeModeofDelivery(params, this.callBackMethodDeliveryMode)
    }
    callBackMethodDeliveryMode = (response) => {
        if (response.data && response.data.status === 'success') {
            this.handleBulkAction(response.data.categoryItemsInfo, 'changeDeliveryAddress', this.deliveryModeIds)
        }
    }
    deleteIds = []
    deleteGifts = (giftItemIds) => {
        this.deleteIds = giftItemIds;
        let params = this.getParams()
        params = {
            ...params,
            currentPage: this.currentPage,
            giftItemIds: giftItemIds
        }
        request.removeGiftList(params, this.callBackMethodDelete)
    }
    callBackMethodDelete = (response, params) => {
        if (response.data && response.data.status === 'success') {
            const params = this.getParams();
            this.props.getRegisteredGiftList(params, '', '', "true")
        }
    }
    handleAddItemSku = (product) => {
        this.AddItemBySkuModal.handleShow()
    }
    submitAddSkuItem = (values, callbackMethod) => {
        let params = this.getParams();
        params = {
            ...params,
            deliveryMode: values.deliveryMode,
            quantity: values.quantity,
            skuId: values.skuId,
        }
        request.addITemBySKU(params, callbackMethod);
    }
    saveQuantity = (giftItemId, skuId, quantity, val, updateValue) => {
        let params = this.getParams()
        params = {
            ...params,
            giftItemId: giftItemId,
            skuId: skuId,
            quantity: quantity,
        }
        request.quantitySave(params, (response) => this.callbackMethodSaveQuantity(response, giftItemId, val, updateValue));
    }
    callbackMethodSaveQuantity = (response, giftItemId, val, updateValue) => {
        if (response.data && response.data.status === 'success') {
            const updatedCategoryItemsInfo = this.categoryInfo;
            for (let catIndex = 0; catIndex < updatedCategoryItemsInfo.length; catIndex++) {
                const itemInfo = updatedCategoryItemsInfo[catIndex].itemInfo;
                for (let itemIndex = 0; itemIndex < itemInfo.length; itemIndex++) {
                    if (itemInfo[itemIndex].giftItemId === giftItemId) {
                        itemInfo[itemIndex].quantity = val.value;
                        break;
                    }
                }
            }
            this.categoryInfo = updatedCategoryItemsInfo;
        } else {
            updateValue(val.orgValue)
        }
    }
    setFavouriteGift = (giftItemId, skuId, isFavourite) => {
        let params = this.getParams()
        params = {
            ...params,
            giftItemId: giftItemId,
            skuId: skuId,
            isFavourite: (!isFavourite).toString(),
        }
        request.setFavourite(params, (response) => this.callbackMethodsetFavorite(response, giftItemId, !isFavourite));
    }
    callbackMethodsetFavorite = (response, giftItemId, isFavourite) => {
        if (response.data && response.data.status === 'success') {
            const updatedCategoryItemsInfo = this.categoryInfo;
            for (let catIndex = 0; catIndex < updatedCategoryItemsInfo.length; catIndex++) {
                const itemInfo = updatedCategoryItemsInfo[catIndex].itemInfo;
                for (let itemIndex = 0; itemIndex < itemInfo.length; itemIndex++) {
                    if (itemInfo[itemIndex].giftItemId === giftItemId) {
                        itemInfo[itemIndex].isFavourite = isFavourite;
                        break;
                    }
                }
            }
            this.categoryInfo = updatedCategoryItemsInfo;
            this.setState({
                star: !this.state.star
            })
        }
    }
    handleFilterByBrand = (brandTitle) => {
        this.sortType = ''
        this.brand = brandTitle
        const params = this.getParams()
        _.merge(params, { brand: brandTitle })
        this.props.getRegisteredGiftList(params, '', '', "true")
    }
    handleAddressChangePopup = () => {
        this.changeAddressForElectronicModal.handleShow()
    }
    handleDeliveryModeChangePopup = () => {
        this.changeDeliveryforGiftCertificateModal.handleShow();
    }
    changeStatusAddress = () => {
        this.setState({ myStatusAdd: true });
        this.changeAddressForElectronicModal.handleClose();

    }
    changeStatusMode = () => {
        this.setState({ myStatusMode: true });
        this.changeDeliveryforGiftCertificateModal.handleClose();
    }
    successServiceCall = () => {
        const params = this.getParams()
        this.props.getRegisteredGiftList(params, '')
    }

    handleBulkAction = (responseData, actionType, removeGiftItems) => {
        const categoryItemsInfo = JSON.parse(JSON.stringify(this.categoryInfo));
        const updatedCategoryItemsInfo = JSON.parse(JSON.stringify(responseData));
        for (let catIndex = 0; catIndex < categoryItemsInfo.length; catIndex++) {
            for (let newCatIndex = 0; newCatIndex < updatedCategoryItemsInfo.length; newCatIndex++) {
                if (updatedCategoryItemsInfo[newCatIndex].categoryName === categoryItemsInfo[catIndex].categoryName) {
                    const itemInfo = categoryItemsInfo[catIndex].itemInfo;
                    const newItemInfo = updatedCategoryItemsInfo[newCatIndex].itemInfo;
                    for (let itemIndex = 0; itemIndex < itemInfo.length; itemIndex++) {
                        for (let newItemIndex = 0; newItemIndex < newItemInfo.length; newItemIndex++) {
                            if (itemInfo[itemIndex].giftItemId === newItemInfo[newItemIndex].giftItemId) {
                                itemInfo[itemIndex] = newItemInfo[newItemIndex];
                                break;
                            }
                        }
                    }
                    //break;
                }
            }
        }
        this.categoryInfo = categoryItemsInfo;
        this.setState({ ...this.state });
        return this.categoryInfo;
    }
    render() {
        const addSkuError = this.props.registeredGiftList ? this.props.registeredGiftList.addSkuError : ''
        const totalRecords = this.props.data && this.props.data.registeredGiftList &&
            this.props.data.registeredGiftList.totalRecords ? this.props.data.registeredGiftList.totalRecords : ''
        if (this.totalRegisteredGiftsCount === 0 && totalRecords && !this.props.loading) {
            this.totalRegisteredGiftsCount = totalRecords;
        }
        return (
            <React.Fragment>
                <DownloadPrintHeader />
                <div className="container wrapPanel">
                    <div className="row">
                        <RegisterGiftList labels={this.props.labels && this.props.labels} categoryInfo={this.categoryInfo} myStatusAdd={this.state.myStatusAdd} myStatusMode={this.state.myStatusMode} registeredGiftList={this.props.registeredGiftList} searchGifts={this.searchGifts} changeDeliveryAdressIndex={this.changeDeliveryAdressIndex} changeDeliveryMode={this.changeDeliveryMode} onAddItemSku={this.handleAddItemSku} deleteGifts={this.deleteGifts} saveQuantity={this.saveQuantity} setFavouriteGift={this.setFavouriteGift} eventId={this.eventId} sortByPrice={this.sortByPrice} event={this.props.event} eventStatus={this.props.eventStatus} router={this.props.router} onFilterByBrand={this.handleFilterByBrand} addressChangePopUp={this.handleAddressChangePopup} deliveryModeChangePopup={this.handleDeliveryModeChangePopup} brand={this.brand} totalCount={this.totalRegisteredGiftsCount} loading={this.props.loading} fail={this.props.fail} />

                        <RegisterModal registeredGiftList={this.props.registeredGiftList} submitAddSkuItem={this.submitAddSkuItem} onRef={ref => (this.AddItemBySkuModal = ref)} handleSucessModal={this.handleSuccessOpen} />

                        <SuccessRegisterModal successServiceCall={this.successServiceCall} registeredGiftList={this.props.registeredGiftList} onRef={ref => (this.successAddSkuModal = ref)} />

                        <AddressChangeNotApplicableModal onRef={ref => this.changeAddressForElectronicModal = ref} changeStatus={this.changeStatusAddress} />

                        <DeliveryModeChangeNotApplicable onRef={ref => this.changeDeliveryforGiftCertificateModal = ref} changeStatus={this.changeStatusMode} />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default RegisteredGifts
