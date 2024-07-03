import React, { Component } from 'react';
import Form from '../../../lib/ZUILib/Form';
import CheckBox from '../../../lib/ZUILib/CheckBox'
import SelectionTab from '../../../lib/ZUILib/SelectionTab'
import RadioButton from '../../../lib/ZUILib/RadioButton'
import { connect } from 'react-redux'
import { getLabels } from '../../global/Labels/actions'
import { generateReportService, getFavoriteReports, saveFavoriteReports, retrieveFavoriteReport, deleteFavoriteReport, generateReportDownloadService } from '../actions';
import { debug } from 'util';
import DeleteConfirmationModal from './deleteConfirmationModal';
import UpdateConfirmationModal from './updateConfirmationModal';
import SaveFevConfirmationModal from './saveFevConfirmationModal';
import Datetime from '../../../lib/datetime/DateTime';
import moment from 'moment';
import { setTimeout } from 'timers';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import commonUtil from '../../../utils/commonUtil';
// import { debug } from 'util';
// import index from '../../eventCreation/commons/Mixins/index';

@connect(
    store => ({
        labels: store.labels.labels,
        favouriteReports: store.reports.favouriteReports,
        favoriteReportInfo: store.reports.favoriteReportInfo,
        deleteFavouriteInfo: store.reports.deleteFavouriteInfo,
        saveFavoriteReportsInfo: store.reports.saveFavoriteReportsInfo,
        saveFavoriteReportsErrors: store.reports.saveFavoriteReportsErrors,
        generateReportFilePath: store.reports.generateReportFilePath,
        generateReportDownloadFile: store.reports.generateReportDownloadFile,
        isReportDownloadServiceLoaded: store.reports.isReportDownloadServiceLoaded
    }),
    { getLabels, getFavoriteReports, saveFavoriteReports, retrieveFavoriteReport, deleteFavoriteReport, generateReportService, generateReportDownloadService }
)

class NewReport extends Component {

    constructor(props) {
        super(props);
        this.userInfo = JSON.parse(localStorage.user);
        this.viewType = { FAV: "FAV", NEW: "NEW" };
        this.favReportId = '';
        this.favReportName = '';
        this.generateReportCalled = false;
        this.generateReportDownloadFileCalled = false;
        this.updateRequestmade = false;
        this.isValidForm = false;
        this.hideOnUserTypeReportId = 23;
        //this.reportExcelFilePathFromService = "";
        this.intervalTimeForDownloadFile = 2000;

        //this.disableDownloadButton = false;
        //this.typeOfReportErr = false;
        // this.state.startDateErr = false;
        //this.compareStartDateErr = false;

        this.state = {
            viewType: "",
            eventTypes: [],
            brands: [],
            stores: [],
            zones: [],
            reportTypesOptions: [],
            selectedzoneIds: ['allzonechk'],
            selectedbrandIds: ['allbrandchk'],
            selectedstoreIds: ['allstorechk'],
            selectedeventIds: ['alleventchk'],
            isDetailedReportAllowed: false,
            isTimeComparisonAllowed: true,
            isTimeComparisonReport: false,
            isDetailedReport: false,
            optionValue: "",
            checkedDateType: 1,
            defaultDate: "",
            isEmployeeEvent: false,
            storeSelectionLimit: -1,
            storeSelectionLimitErr: false,
            //typeOfReportErr: false,
            //startDateErr: false,
            //compareStartDateErr: false,
            errors: {},
            disableDownloadButton: false
        }

        this.all = {
            // brandIds: [],
            // brandNames: [],
            // zoneIds: [],
            // zoneNames: [],
            // storeIds: [],
            // storeNames: [],
            // eventTypeNames: [],
            // eventIds: [],
            eventData: {},
            brandData: {},
            zoneData: {},
            storeData: {},
            brandszoneData: {},
            zonesstoreData: {},
            isEmployeeEvent: "false"
        }

        this.userSelection = {
            reportTypeId: '',
            reportTypeName: '',
            allZonesSelected: "true",
            allBrandsSelected: "true",
            allStoresSelected: "true",
            allEventsSelected: "true",
            isTimeComparisonReport: "false",
            isDetailedReport: "false",
            isEmployeeEvent: "false"
        }
    }

    UNSAFE_componentWillMount = () => {
        //this.props.getLabels();
        if (window.intervalTimeOutId) {
            this.setState({ disableDownloadButton: true });
            window.intervalTimeOutId = setInterval(this.downloadFile.bind(this, this.props.generateReportFilePath), this.intervalTimeForDownloadFile);
        } else {
            window.intervalTimeOutId = 0;
        }

        if (this.props.viewType === this.viewType.FAV) {
            this.getFavoriteReportsCalled = true;
            this.props.getFavoriteReports(this.userInfo.storeAssociateId);
        }
        this.setReportData(this.props.pageData);
    }

    componentWillUnmount() {
        clearInterval(window.intervalTimeOutId);
    }

    componentDidUpdate = () => {
        commonUtil.errorScrollUp();
    }

    componentWillReceiveProps(props) {
        // this.setState({
        //     viewType: props.viewType
        // });
        if (this.isFavoriteReportDataFetched && Object.keys(props.favoriteReportInfo).length > 0) {
            this.userSelection = props.favoriteReportInfo.userSelection;
            this.isFavoriteReportDataFetched = false;
            this.setFormElements(props.favoriteReportInfo);
        }
        if (this.props.viewType === this.viewType.NEW && props.viewType === this.viewType.FAV) {
            this.getFavoriteReportsCalled = true;
            this.resetSelections();
            this.props.getFavoriteReports(this.userInfo.storeAssociateId);
        } else if (this.props.viewType === this.viewType.FAV && props.viewType === this.viewType.NEW) {
            this.resetSelections();
        }
        if ((this.isFavoriteReportDataNeedToChange && props.deleteFavouriteInfo && props.deleteFavouriteInfo.status && props.deleteFavouriteInfo.status.status == 'success')
            || (this.isFavoriteReportDataNeedToChange && props.saveFavoriteReportsInfo && props.saveFavoriteReportsInfo.status && props.saveFavoriteReportsInfo.status.status == 'success')) {

            this.isFavoriteReportDataNeedToChange = false;
            this.getFavoriteReportsCalled = true;
            this.props.getFavoriteReports(this.userInfo.storeAssociateId);

            if (this.updateRequestmade && props.saveFavoriteReportsInfo && Object.keys(props.saveFavoriteReportsInfo).length) {
                this.updateRequestmade = false;
                this.updateConfirmationModal.handleShow();
            }
        }

        if (this.generateReportCalled && props.generateReportFilePath) {
            //this.reportExcelFilePathFromService = props.generateReportFilePath.reportExcelFilePath;
            //window.intervalTimeOutId = setInterval(this.downloadFile, this.intervalTimeForDownloadFile);
            this.downloadFile(props.generateReportFilePath);
        }

        if (this.generateReportDownloadFileCalled && props.generateReportDownloadFile) {
            this.generateReportDownloadFileCalled = false;
            const downloadedDocument = props.generateReportDownloadFile;
            const fileName = props.generateReportFilePath.reportExcelFilePath.split('/');
            if (typeof window != 'undefined') {
                clearInterval(window.intervalTimeOutId);
                window.intervalTimeOutId = 0;

                var reader = new FileReader();
                reader.onload = () => {
                    let resultReader = (reader.result && reader.result.indexOf('fileNotFound') > -1) ? JSON.parse(reader.result) : {};
                    if (resultReader && !resultReader.fileNotFound) {
                        const url = window.URL.createObjectURL(new Blob([downloadedDocument]));
                        this.download.href = url;
                        this.download.download = fileName[fileName.length - 1];
                        this.download.click();
                        this.download.href = '';
                        this.download.download = "";
                        //this.disableDownloadButton = false;
                        this.setState({ disableDownloadButton: false });
                    } else {
                        window.intervalTimeOutId = setInterval(this.downloadFile.bind(this, props.generateReportFilePath), this.intervalTimeForDownloadFile);
                    }
                }
                reader.readAsText(new Blob([downloadedDocument]));
            }

        }
    }

    downloadFile = (generateReportFilePath) => {
        this.generateReportCalled = false;
        this.generateReportDownloadFileCalled = true;
        //this.disableDownloadButton = true;
        this.setState({ disableDownloadButton: true });
        generateReportFilePath && generateReportFilePath.reportExcelFilePath && this.props.generateReportDownloadService(generateReportFilePath.reportExcelFilePath);
    }

    onDeleteConfirmClick = (reportId) => {
        this.isFavoriteReportDataNeedToChange = true;
        this.props.deleteFavoriteReport({
            favReportId: reportId,
            agentProfileId: this.userInfo.storeAssociateId
        });
    }

    setFormElements = (data) => {
        var cloneData = JSON.parse(JSON.stringify(data.userSelection)),
            brandStateIds = ['allbrandchk'],
            zoneStateIds = [],
            storeStateIds = [],
            eventStateIds = ['alleventchk'],
            brandZoneMapData = this.all.brandszoneData,
            zoneStoreMapData = this.all.zonesstoreData,
            mapArrayStore = [],
            mapArrayZone = [],
            eventData = this.props.pageData.eventTypes,
            reportTypesOptions = this.state.reportTypesOptions;

        if (cloneData.allBrandsSelected == "false") {
            brandStateIds = [];
            for (var i in this.all.brandData) {
                var index = cloneData.brandIds.indexOf(this.all.brandData[i].id);
                if (index >= 0) {
                    brandStateIds.push(i);
                    cloneData.brandIds.splice(index, 1);
                }
            }
        }

        if (brandStateIds[0] && brandStateIds[0].indexOf('all') >= 0 || Object.keys(this.all['brandData']).length === this.state['brands'].length) {
            for (var i in this.all.zoneData) {
                var data = this.all.zoneData[i];
                mapArrayZone.push(data);
            }
        } else {
            for (var i = 0; i < brandStateIds.length; i++) {
                var data = brandZoneMapData[brandStateIds[i]];
                mapArrayZone = mapArrayZone.concat(data);
            }
        }
        mapArrayZone = _.uniqBy(mapArrayZone, 'name');
        mapArrayZone = _.orderBy(mapArrayZone, ['sortingOrder'], ['asc']);

        if (cloneData.allZonesSelected == "true" || (cloneData.zoneIds && cloneData.zoneIds.length > 0)) {
            if (cloneData.allZonesSelected == "false") {

                for (var i in mapArrayZone) {
                    var index = cloneData.zoneIds && cloneData.zoneIds.indexOf(mapArrayZone[i].id);
                    if (index >= 0) {
                        zoneStateIds.push(mapArrayZone[i].elemId);
                        cloneData.zoneIds.splice(index, 1);
                    }
                }
            } else {
                zoneStateIds = ['allzonechk'];
            }
            if (zoneStateIds[0] && zoneStateIds[0].indexOf('all') >= 0 || Object.keys(this.all['zoneData']).length === this.state['brands'].length) {
                for (var i in this.all.storeData) {
                    var data = this.all.storeData[i];
                    mapArrayStore.push(data);
                }
            } else {
                for (var i = 0; i < zoneStateIds.length; i++) {
                    var data = zoneStoreMapData[zoneStateIds[i]];
                    mapArrayStore = mapArrayStore.concat(data);
                }
            }

            if (cloneData.allStoresSelected == "false") {
                storeStateIds = [];
                for (var i in mapArrayStore) {
                    var index = cloneData.storeIds.indexOf(mapArrayStore[i].id);
                    if (index >= 0) {
                        storeStateIds.push(mapArrayStore[i].elemId);
                        cloneData.storeIds.splice(index, 1);
                    }
                }
            } else {
                storeStateIds = ['allstorechk'];
            }
        }

        mapArrayZone.splice(0, 0, { elemId: 'allzonechk', id: 'all', name: 'Todos los zonas',sortingOrder:-999 });
        if (zoneStateIds.length > 0) mapArrayStore.splice(0, 0, { elemId: 'allstorechk', id: 'all', name: 'Todos los tiendas' });


        if (cloneData.allEventsSelected == "false" && cloneData.reportTypeId != this.hideOnUserTypeReportId) {
            eventStateIds = [];
            for (var i = 0; i < eventData.length; i++) {
                var index = cloneData['eventTypes'].indexOf(eventData[i].eventName);
                if (index >= 0) {
                    eventStateIds.push(eventData[i].eventId);
                    cloneData['eventTypes'].splice(index, 1);
                }
            }
        }

        this.setState({ zones: mapArrayZone, stores: mapArrayStore }, () => {
            this.setState({
                selectedeventIds: eventStateIds,
                selectedbrandIds: JSON.parse(JSON.stringify(brandStateIds)),
                selectedstoreIds: storeStateIds,
                selectedzoneIds: JSON.parse(JSON.stringify(zoneStateIds)),
                isTimeComparisonReport: (cloneData.isTimeComparisonReport == "true"),
                isDetailedReport: (cloneData.isDetailedReport == "true"),
                optionValue: cloneData.reportTypeId,
                isEmployeeEvent: (cloneData.isEmployeeEvent == "true"),
                defaultDate: cloneData.startDate + ' - ' + cloneData.endDate,
                defaultCompareDate: cloneData.compareStartDate + ' - ' + cloneData.compareEndDate
            });
        });
        // setTimeout(() => {
        // this.setState({
        //     selectedeventIds: eventStateIds,
        //     selectedbrandIds: JSON.parse(JSON.stringify(brandStateIds)),
        //     selectedstoreIds: storeStateIds,
        //     selectedzoneIds: JSON.parse(JSON.stringify(zoneStateIds)),
        //     isTimeComparisonReport: (cloneData.isTimeComparisonReport == "true"),
        //     isDetailedReport: (cloneData.isDetailedReport == "true"),
        //     optionValue: cloneData.reportTypeId,
        //     isEmployeeEvent: (cloneData.isEmployeeEvent == "true"),
        //     defaultDate: cloneData.startDate + ' - ' + cloneData.endDate,
        //     defaultCompareDate: cloneData.compareStartDate + ' - ' + cloneData.compareEndDate
        // });
        // }, 100);

        // setTimeout(() => {
        //     this.reRenderChildren('brand', JSON.parse(JSON.stringify(brandStateIds)));
        //     this.reRenderChildren('zone', JSON.parse(JSON.stringify(zoneStateIds)));
        // }, 500);
    }

    setReportData = (pageData) => {
        if (Object.keys(pageData).indexOf('reportTypes') >= 0) {
            var data = [],
                { reportTypes, eventTypes } = pageData,
                newEventTypes = [{ elemId: 'alleventchk', id: 'all', name: 'Todos los eventos' }];

            for (var i = 0; i < eventTypes.length; i++) {
                var obj = { elemId: eventTypes[i].eventId, id: eventTypes[i].eventId, name: eventTypes[i].eventName };

                newEventTypes.push(obj);
                this.all.eventData[eventTypes[i].eventId] = obj;
            }

            if (reportTypes && reportTypes.length > 0) {
                for (var i = 0; i < reportTypes.length; i++) {
                    data.push({
                        option: reportTypes[i].reportTypeName,
                        value: reportTypes[i].reportTypeId,
                        disabled: false,
                        selected: false,
                    })
                }

                this.setState({
                    // viewType: this.props.viewType,
                    eventTypes: newEventTypes,
                    reportTypesOptions: data
                });
            }
            this.filterBrandZoneStore(pageData.brands);
        }
    }

    filterBrandZoneStore = (data) => {
        var brands = [],
            zones = [],
            stores = [];

        brands.push({ elemId: 'allbrandchk', id: 'all', name: 'Todos los marcas' });
        zones.push({ elemId: 'allzonechk', id: 'all', name: 'Todos los zonas',sortingOrder:-999  });
        stores.push({ elemId: 'allstorechk', id: 'all', name: 'Todos los tiendas' });

        for (var i = 0; i < data.length; i++) {
            var curDataBrand = data[i],
                curZones = curDataBrand.zones || [],
                brandId = 'brand' + curDataBrand.brandId,
                brandData = { elemId: brandId, id: curDataBrand.brandId, name: curDataBrand.brandName };

            brands.push(brandData);
            this.all.brandData[brandId] = brandData;
            this.all.brandszoneData[brandId] = [];

            for (var j = 0; j < curZones.length; j++) {
                var curDataZone = curZones[j],
                    curStores = curDataZone.stores || [],
                    zoneId = 'zone' + curDataBrand.brandId + curDataZone.zoneId,
                    zoneData = { elemId: zoneId, id: curDataZone.zoneId, name: curDataZone.zoneName.trim(), sortingOrder: curDataZone.sortingOrder };

                zones.push(zoneData);
                this.all.brandszoneData[brandId].push(zoneData);
                this.all.zoneData[zoneId] = zoneData;
                this.all.zonesstoreData[zoneId] = [];

                for (var k = 0; k < curStores.length; k++) {
                    var curDataStore = curStores[k],
                        storeId = 'store' + curDataBrand.brandId + curDataZone.zoneId + curDataStore.storeId,
                        storeData = { elemId: storeId, id: curDataStore.storeId, name: curDataStore.storeName, brandId: curDataBrand.brandId, zoneId: curDataZone.zoneId, zoneName: curDataZone.zoneName.trim() };

                    stores.push(storeData);
                    this.all.zonesstoreData[zoneId].push(storeData);
                    this.all.storeData[storeId] = storeData;
                }
            }
        }

        zones = _.uniqBy(zones, 'name');
        zones = _.orderBy(zones, ['sortingOrder'], ['asc']);
        this.setState({
            brands: brands,
            zones: zones,
            stores: stores,
        });
    }

    onReportTypeChange = (selectedObj) => {
        this.resetSelections();

        var index = selectedObj.target.selectedIndex,
            reportType = this.props.pageData.reportTypes[index - 1];

        this.setState({
            errors: {
                ...this.state.errors,
                [selectedObj.target.name]: null,
            },
            isDetailedReportAllowed: reportType.isDetailedReportAllowed,
            isTimeComparisonAllowed: reportType.isTimeComparisonAllowed,
            storeSelectionLimit: reportType.storeSelectionLimit,
            dateSelectionFormat: reportType.dateSelectionFormat,
            isTimeComparisonReport: false,
            isDetailedReport: false,
            typeOfReportErr: true
        });

        this.userSelection.isTimeComparisonReport = "false";
        this.userSelection.isDetailedReport = "false";
        this.userSelection.reportTypeId = selectedObj.target.options[index].value;
        this.userSelection.reportTypeName = selectedObj.target.options[index].text;
    }

    groupElements = (arrayOfElements, numberOfElementInGroup) => {
        var arrayOfElementsLen = arrayOfElements.length,
            newArray = [],
            groupArray = [];
        for (var i = 0; i < arrayOfElementsLen; i++) {
            var reminder = i % numberOfElementInGroup;
            groupArray.push(arrayOfElements[i]);
            if (reminder === (numberOfElementInGroup - 1) || i === (arrayOfElementsLen - 1)) {
                newArray.push(groupArray);
                groupArray = [];
            }
        }
        return newArray;
    }

    getFavoriteReportInfo = (event) => {

        this.isFavoriteReportDataFetched = true;
        this.favReportId = event.target.dataset.checkid;
        this.favReportName = event.target.value;

        this.props.retrieveFavoriteReport({
            favReportId: this.favReportId,
            agentProfileId: this.userInfo.storeAssociateId
        });
    }

    renderFavoriteCheckboxes = () => {
        var { favouriteReports } = this.props;

        favouriteReports = this.groupElements(favouriteReports, 12);
        if (this.getFavoriteReportsCalled) {
            this.getFavoriteReportsCalled = false;
            this.favReportId = favouriteReports[0][0].reportId;
            this.favReportName = favouriteReports[0][0].reportName;
            let event = {
                target: {
                    dataset: {
                        checkid: this.favReportId
                    },
                    value: this.favReportName
                }
            };
            this.getFavoriteReportInfo(event);
        }

        return <div className="row row-block"><div className="col-xs-12"><p className="articleName">Reportes guardados</p></div>
            <div className="row row-block">{
                favouriteReports.map((groupArray, index) => {
                    return <div className="col-xs-6" key={index}>
                        {
                            groupArray.map((item, index) => {
                                return <div key={item.reportId} className="radio">
                                    {/* <RadioButton
                                        defaultChecked={this.favReportId == item.reportId}
                                        id={item.reportId + "-fav-report-radio"}
                                        name="favReportOptions"
                                        value={item.reportName}
                                        onChange={this.getFavoriteReportInfo}
                                        displayName={item.reportName}
                                        htmlFor={item.reportId + "-fav-report-radio"}
                                    /> */}
                                    <input
                                        defaultChecked={this.favReportId == item.reportId}
                                        id={item.reportId + "-fav-report-radio"}
                                        data-checkid={item.reportId}
                                        type="radio"
                                        name="favReportOptions"
                                        value={item.reportName}
                                        onChange={this.getFavoriteReportInfo}
                                    />
                                    <label htmlFor={item.reportId + "-fav-report-radio"}>
                                        {item.reportName}
                                    </label>
                                    <span onClick={() => { this.deleteConfirmationModal.handleShow.call(this, item.reportId) }} className="deleteFavorite">
                                        <i className="icon-cerrar" />
                                    </span>
                                </div>
                            })
                        }
                    </div>
                })
            }
            </div >
        </div >
    }

    onCheckboxClick = (target) => {



        //target = event.target,
        let id = target.id, //dataset.checkid,
            zoneCheckStat = false,
            dataset = target.dataset,
            checktype = dataset.checktype,
            camelCaseCheckType = checktype.substr(0, 1).toUpperCase() + checktype.substr(1, checktype.length),
            checkid = dataset.checkid,
            allId = `all${checktype}chk`,
            stateIds = Object.assign([], this.state[`selected${checktype}Ids`]);



        dataset.isCheck = target.checked;
        dataset.checkName = target.displayName;
        dataset.stateIds = stateIds;

        if (checktype === "brand") {
            zoneCheckStat = false;
        } else if (checktype === "zone") {
            zoneCheckStat = true;
        }

        if (id === allId) {
            stateIds = (target.checked) ? [allId] : Object.keys(this.all[checktype + 'Data']);
            this.userSelection[`all${camelCaseCheckType}sSelected`] = target.checked.toString();
            if (checktype !== 'zone' && checktype !== 'store') {
                stateIds = (target.checked) ? [allId] : Object.keys(this.all[checktype + 'Data']);
            } else {
                stateIds = (target.checked) ? [allId] : [];
            }
        } else {
            // if (checktype !== 'zone' & checktype !== 'store') {
            if (stateIds.indexOf(allId) >= 0) stateIds = [];
            this.userSelection[`all${camelCaseCheckType}sSelected`] = "false";
            if (target.checked) {
                stateIds.push(id);
            } else {
                var index = stateIds.indexOf(id);
                stateIds.splice(index, 1);

                if (checktype !== 'zone' && checktype !== 'store' && stateIds.length === 0) {
                    // if (stateIds.length === 1) {
                    stateIds = [allId];
                    this.userSelection[`all${camelCaseCheckType}sSelected`] = "true";
                    // } else {
                    //     var index = stateIds.indexOf(id);
                    //     stateIds.splice(index, 1);
                    // }
                }
            }
            // } else {

            // }
        }

        if (checktype == 'store') {
            if (this.state.storeSelectionLimit != -1 && stateIds.length > this.state.storeSelectionLimit) {
                this.setState({
                    storeSelectionLimitErr: true
                });
            } else {
                this.setState({
                    storeSelectionLimitErr: false
                })
            }
        }
        this.setState({ [`selected${checktype}Ids`]: stateIds });
        if (checktype == 'brand' || checktype == 'zone') this.reRenderChildren(checktype, stateIds, dataset, null, zoneCheckStat);

    }

    reRenderChildren = (checktype, selectedIds, dataset, prevBrandSelectedIds, zoneCheckStat) => {
        var nxtCheckType = (checktype == 'brand') ? 'zone' : 'store',
            camelCaseNextCheckType,
            mapArray = [],
            selectedElemId = [],
            prevSelectedIds = [],
            parChildMapData,
            isZoneCheck = { ...dataset },
            allChildData;

        if (selectedIds.length > 0) {
            prevSelectedIds = this.state[`selected${nxtCheckType}Ids`];
            allChildData = this.all[`${nxtCheckType}Data`];
            parChildMapData = this.all[`${checktype}s${nxtCheckType}Data`];
            if (selectedIds[0].indexOf('all') >= 0 || Object.keys(this.all[`${checktype}Data`]).length === this.state[`${checktype}s`].length) {
                for (var i in allChildData) {
                    if (prevBrandSelectedIds && nxtCheckType == 'store' && prevBrandSelectedIds[0] != 'allbrandchk') {
                        for (var x in prevBrandSelectedIds) {
                            if ('brand' + allChildData[i].brandId == prevBrandSelectedIds[x]) {
                                var data = allChildData[i];
                                mapArray.push(data);
                                selectedElemId.push(data.elemId);
                            }
                        }
                    } else {
                        var data = allChildData[i];
                        mapArray.push(data);
                        selectedElemId.push(data.elemId);
                    }

                }
            } else {
                for (var i = 0; i < selectedIds.length; i++) {
                    var data = [];
                    if (nxtCheckType == 'zone' || (nxtCheckType == 'store' && (checktype == 'zone' || !dataset))) {
                        data = parChildMapData[selectedIds[i]];
                    }

                    /*******RE: Reporting: 8963 - Brand-Zone-Store Association-13-07-2018***********/


                    if (dataset && dataset.isCheck) {
                        let tempData = _.chain(this.props.pageData.brands).filter({
                            'zones': [{ zoneName: dataset && dataset.checkName }]
                        }).map(function (o) { return o }).value();
                        if (tempData.length && tempData.length > 1) {
                            //mapArray = [];
                            data = [];
                        }
                        for (let j in tempData) {
                            for (let k in tempData[j]['zones']) {
                                if (dataset && dataset.isCheck && tempData[j]['zones'][k]['zoneName'] == dataset.checkName && (this.state.selectedbrandIds.indexOf("brand" + tempData[j]["brandId"]) > -1 || this.state.selectedbrandIds.indexOf("allbrandchk") > -1)) {
                                    for (let m in tempData[j]['zones'][k]['stores']) {
                                        let elemId = "store" + tempData[j]['brandId'] + tempData[j]['zones'][k].zoneId + tempData[j]['zones'][k]['stores'][m]['storeId'];
                                        data.push({
                                            elemId,
                                            id: tempData[j]['zones'][k]['stores'][m]['storeId'],
                                            name: tempData[j]['zones'][k]['stores'][m]['storeName'],
                                            brandId: tempData[j]['brandId'],
                                            zoneId: tempData[j]['zones'][k]['zoneId'],
                                            zoneName: tempData[j]['zones'][k]['zoneName']
                                        })
                                    }
                                }
                            }
                        }



                        if (tempData.length) {
                            dataset = {};
                        }
                    }



                    // if (dataset && dataset.isCheck) {
                    //     let tempData = _.chain(this.props.pageData.brands).filter({
                    //         'zones': [{ zoneId: dataset && dataset.checkid }]
                    //     }).map(function (o) { return o }).value();
                    //     if (tempData.length && tempData.length > 1) {
                    //         //mapArray = [];
                    //         data = [];
                    //     }
                    //     for (let j in tempData) {
                    //         for (let k in tempData[j]['zones']) {
                    //             if (dataset && dataset.isCheck && tempData[j]['zones'][k]['zoneId'] == dataset.checkid && (this.state.selectedbrandIds.indexOf("brand" + tempData[j]["brandId"]) > -1 || this.state.selectedbrandIds.indexOf("allbrandchk") > -1)) {
                    //                 for (let m in tempData[j]['zones'][k]['stores']) {
                    //                     let elemId = "store" + tempData[j]['brandId'] + dataset.checkid + tempData[j]['zones'][k]['stores'][m]['storeId'];
                    //                     data.push({
                    //                         elemId,
                    //                         id: tempData[j]['zones'][k]['stores'][m]['storeId'],
                    //                         name: tempData[j]['zones'][k]['stores'][m]['storeName'],
                    //                         brandId: tempData[j]['brandId'],
                    //                         zoneId: tempData[j]['zones'][k]['zoneId']
                    //                     })
                    //                 }
                    //             }
                    //         }
                    //     }



                    //     if (tempData.length) {
                    //         dataset = {};
                    //     }
                    // }

                    /****************************/

                    mapArray = mapArray.concat(data);
                    data.forEach((item) => {
                        selectedElemId.push(item.elemId);
                    })
                }
                mapArray = _.uniqBy(mapArray, 'elemId');
            }

            for (var i = prevSelectedIds.length - 1; i >= 0; i--) {
                if (selectedElemId.indexOf(prevSelectedIds[i]) === -1) {
                    prevSelectedIds.splice(i, 1);
                }
            }
            /********** */
            if (nxtCheckType == 'zone') {
                prevSelectedIds = ["allzonechk"];
                this.userSelection[`allZonesSelected`] = "true";
                this.setState({ [`selectedzoneIds`]: prevSelectedIds });
            }
            /********** */
            if (prevSelectedIds.length === 0) prevSelectedIds = ['all' + nxtCheckType + 'chk'];
            if (checktype === 'brand') {
                mapArray.splice(0, 0, { elemId: 'allzonechk', id: 'all', name: 'Todos los zonas',sortingOrder:-999 });
            } else {
                mapArray.splice(0, 0, { elemId: 'allstorechk', id: 'all', name: 'Todos los tiendas' });
            }

        } else {
            camelCaseNextCheckType = nxtCheckType.substr(0, 1).toUpperCase() + nxtCheckType.substr(1, nxtCheckType.length)
            this.userSelection[`all${camelCaseNextCheckType}sSelected`] = "false";
        }


        if (zoneCheckStat) {

            if (isZoneCheck.isCheck) {
                var obj = {};
                if (nxtCheckType == 'zone') {
                    mapArray = _.uniqBy(mapArray, 'name');
                }
                //obj[`${nxtCheckType}s`] = mapArray;
                obj[`selected${nxtCheckType}Ids`] = prevSelectedIds
                if (this.state.selectedzoneIds[0] === "allzonechk") {
                    obj[`${nxtCheckType}s`] = [
                        ...mapArray
                    ];
                } else {
                    obj[`${nxtCheckType}s`] = [
                        ...this.state.stores,
                        ...mapArray
                    ];
                }

                obj[`${nxtCheckType}s`] = _.uniqBy(obj[`${nxtCheckType}s`], 'name');
                this.setState(obj);
                //console.log(this.state.stores)
            } else {

                if (isZoneCheck.checkid === "all" || mapArray.length === 0) {
                    this.setState({
                        stores: []
                    });
                } else {
                    let zoneData = this.state.stores.filter((item) => {
                        return item.zoneName !== isZoneCheck.checkName
                    });

                    this.setState({
                        stores: zoneData
                    });
                }



            }

        } else {
            var obj = {};
            if (nxtCheckType == 'zone') {
                mapArray = _.uniqBy(mapArray, 'name');

                //mapArray = mapArray.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
                let allObj = mapArray.splice(0, 1);
                mapArray = _.orderBy(mapArray, ['sortingOrder'], ['asc']);
                //mapArray = _.sortBy(mapArray, [function (m) { return m.name }]);
                mapArray = [allObj[0], ...mapArray];
            }
            obj[`${nxtCheckType}s`] = mapArray;
            obj[`selected${nxtCheckType}Ids`] = prevSelectedIds
            this.setState(obj);
        }


        if (checktype === 'brand') {
            this.reRenderChildren('zone', prevSelectedIds, dataset, selectedIds);
        }



    }

    renderEventsCheckboxes = () => {
        var { eventTypes } = this.state;

        eventTypes = this.groupElements(eventTypes, 4);
        return eventTypes.map((groupArray, index) => {
            return <div className="col-xs-3" key={index}>
                {

                    this.renderCheckboxes(groupArray, 'event')
                }
            </div>
        });
    }

    renderBrandsCheckboxes = () => {
        var { brands } = this.state;

        brands = this.groupElements(brands, 4);
        return brands.map((groupArray, index) => {
            return <div className="col-xs-3" key={index}>
                {
                    this.renderCheckboxes(groupArray, 'brand')
                }
            </div>
        });
    }

    renderCheckboxes = (itemList, type) => {
        return itemList.map((item, index) => {
            var checkedVal = (this.state['selected' + type + 'Ids'].indexOf(item.elemId) >= 0);
            return <div key={item.elemId + index} className="checkbox">
                <CheckBox
                    className={"checkbox " + type + "-checkbox-cls"}
                    value={item.name}
                    id={item.elemId}
                    displayName={item.name}
                    //onChange={this.onCheckboxClick}
                    //dataChecktype={type}
                    dataset={{
                        checktype: type,
                        checkid: item.id
                    }}
                    checked={checkedVal}
                    getSelectedValue={this.onCheckboxClick}
                />
                {/* <input id={item.elemId}
                    className={"checkbox " + type + "-checkbox-cls"}
                    data-checktype={type}
                    data-checkid={item.id}
                    type="checkbox"
                    value={item.name}
                    onChange={this.onCheckboxClick}
                    checked={checkedVal} />
                <label htmlFor={item.elemId}>{item.name}</label>*/}
            </div >
        });
    }

    onTimeCompareChecked = (target) => {
        this.setState({ isTimeComparisonReport: !this.state.isTimeComparisonReport });
        this.userSelection.isTimeComparisonReport = target.checked.toString();
        if (!target.checked) {
            delete this.userSelection.compareStartDate;
            delete this.userSelection.compareEndDate;
        }
    }

    onDetailReportChecked = (target) => {
        this.setState({ isDetailedReport: !this.state.isDetailedReport });
        this.userSelection.isDetailedReport = target.checked.toString();
    }

    getUserSelections = () => {
        var dataStore = ['brand', 'zone', 'store'],
            checkValues = [this.userSelection.allBrandsSelected, this.userSelection.allZonesSelected, this.userSelection.allStoresSelected],
            returnObj = {
                ...this.userSelection
            };

        for (var i = 0; i < dataStore.length; i++) {
            var selectedIds = this.state[`selected${dataStore[i]}Ids`];
            if (checkValues[i] == "false") {
                returnObj = {
                    ...returnObj,
                    ...this.getKeyIds(dataStore[i], selectedIds)
                }
            }
        }
        var selectedEventIds = this.state.selectedeventIds,
            allData = this.all.eventData;
        if (this.userSelection.allEventsSelected == "false" && this.userSelection.reportTypeId != this.hideOnUserTypeReportId) {
            var obj = { "eventTypes": [] }
            for (var i = 0; i < selectedEventIds.length; i++) {
                obj["eventTypes"].push(allData[selectedEventIds[i]].name);
            }
            returnObj = {
                ...returnObj,
                ...obj
            }
        }
        if (this.userSelection.reportTypeId == this.hideOnUserTypeReportId) {
            this.userSelection.allEventsSelected = "false";
            this.userSelection.isEmployeeEvent = "false";
        }

        if (this.userSelection.allStoresSelected && this.userSelection.allStoresSelected == "true") {
            let storeIds = this.state.stores && this.state.stores.map(a => a.id);
            storeIds = storeIds && storeIds.filter((a, index) => index > 0);
            returnObj.storeIds = storeIds || [];
        }

        if (returnObj.zoneIds && returnObj.zoneIds.length == 0) {
            delete returnObj.zoneIds;
            delete returnObj.zoneNames;
        }

        if (returnObj.storeIds && returnObj.storeIds.length == 0) {
            delete returnObj.storeIds;
            delete returnObj.storeNames;
        }
        return returnObj;
    }

    getKeyIds = (checktype, ids) => {
        var obj = {},
            allData = this.all[checktype + 'Data'];

        obj[checktype + "Ids"] = [];
        obj[checktype + "Names"] = [];
        for (var i = 0; i < ids.length; i++) {
            var curData = allData[ids[i]];
            if (curData) {
                obj[checktype + "Ids"].push(curData.id);
                obj[checktype + "Names"].push(curData.name);
            }

        }
        return obj;
    }

    generateReport = () => {
        //if ((!this.props.saveFavoriteReportsErrors) && (!this.props.isReportDownloadServiceLoaded)) {
        //if (!this.props.isReportDownloadServiceLoaded) {
        if (((!this.props.saveFavoriteReportsErrors) && this.state.disableDownloadButton) || this.state.storeSelectionLimitErr) {
            return false;
        }

        console.log("saveFavoriteReportsErrors===",this.props.saveFavoriteReportsErrors,'isvalid==',this.isValidForm)
        var a = this.formToSubmit.dispatchEvent(new Event('submit', { cancelable: true }));
        if (this.isValidForm) {
            this.generateReportCalled = true;
            this.setState({ disableDownloadButton: true });
            this.props.generateReportService({
                ...this.getUserSelections(),
                transactionId: new Date().getTime().toString() //"1530710723238"//
            });
        }

        //if (this.checkValidation()) {
        //setTimeout(() => {
        //}, 0);
        //}
    }

    // checkValidation = () => {
    //     let flag = true;
    //     if (!this.userSelection.reportTypeId) {
    //         this.setState({
    //             typeOfReportErr: true
    //         });
    //         flag = false;
    //     } else {
    //         this.setState({
    //             typeOfReportErr: false
    //         });
    //     }

    //     if (!this.userSelection.startDate) {
    //         this.setState({
    //             startDateErr: true
    //         });
    //         flag = false;
    //     } else {
    //         this.setState({
    //             startDateErr: false
    //         });
    //     }

    //     if (this.state.isTimeComparisonReport) {
    //         if (!this.userSelection.compareStartDate) {
    //             this.setState({
    //                 compareStartDateErr: true
    //             });
    //             flag = false;
    //         } else {
    //             this.setState({
    //                 compareStartDateErr: false
    //             });
    //         }
    //     }
    //     return flag;

    // }

    showSaveFevConfirmationModel = () => {
        //this.saveFevConfirmationModal.handleShow();
        var a = this.formToSubmit.dispatchEvent(new Event('submit', { cancelable: true }));
        if (this.isValidForm) {
            this.saveFevConfirmationModal.handleShow();
        }
    }

    saveFavouriteReport = (formValues) => {
        let obj = {
            agentProfileId: this.userInfo.storeAssociateId,
            userSelection: this.getUserSelections()
        }

        if (formValues.nombre) {
            obj.isUpdateRequest = "false";
            obj.favReportId = '';
            obj.favReportName = formValues.nombre;
        } else {
            this.updateRequestmade = true;
            obj.favReportId = this.favReportId;
            obj.favReportName = this.favReportName;
            obj.isUpdateRequest = "true";
        }

        this.props.saveFavoriteReports(obj);
        this.isFavoriteReportDataNeedToChange = true;
    }

    resetSelections = () => {
        this.userSelection = {
            reportTypeId: '',
            reportTypeName: '',
            allZonesSelected: "true",
            allBrandsSelected: "true",
            allStoresSelected: "true",
            allEventsSelected: "true",
            isTimeComparisonReport: "false",
            isDetailedReport: "false",
            isEmployeeEvent: "false"
        }

        this.date1 && this.date1.resetDate();
        this.date2 && this.date2.resetDate();
        this.date3 && this.date3.resetDate();
        this.date4 && this.date4.resetDate();

        this.setState({
            selectedzoneIds: ['allzonechk'],
            selectedbrandIds: ['allbrandchk'],
            selectedstoreIds: ['allstorechk'],
            selectedeventIds: ['alleventchk'],
            isDetailedReportAllowed: false,
            isTimeComparisonAllowed: true,
            isTimeComparisonReport: false,
            isDetailedReport: false,
            isEmployeeEvent: false,
            optionValue: "",
            checkedDateType: 1,
            defaultCompareDate: '',
            defaultDate: ''
        }, () => {
            this.reRenderChildren("brand", ["allbrandchk"]);
            // this.reRenderChildren("zone", ["allzonechk"]);
        });

    }
    setRangeValidationToDate(current, firstDate) {
        let selectedDate = firstDate && firstDate.clone();
        //return current.isAfter(1900, 'year') && current.isBefore(moment());
        //date range can be 365 days: after discussion with @SanthoshKumarDasika on 27-06-2018
        // min date should be 5 years from now: after discussion with @SanthoshKumarDasika on 27-06-2018
        //return current.year() > 1900 && current.isBefore(moment()) && (!selectedDate || current.isBefore(selectedDate.add(365, 'days')))

        return current.format('YYYY-MM-DD') > moment().subtract(5, 'Y').format('YYYY-MM-DD') && current.isBefore(moment()) && (!selectedDate || current.isBefore(selectedDate.add(365, 'days')))
    }

    setDatePicker = () => {

        return (
            <div>
                {(this.state.checkedDateType == 1 && this.state.dateSelectionFormat == 'Month') &&
                    <div>
                        <div className="form-group">
                            <div className="datepicker input-group date MM report-datepicker col-xs-8">
                                <Datetime
                                    name="date1"
                                    className="form-control"
                                    range={false}
                                    dateFormat='MM/YYYY'
                                    timeFormat={false}
                                    onRef={(date1) => this.date1 = date1}
                                    isValidDate={function (current) {
                                        // return current.isAfter(1900, 'year') && current.isBefore(moment());
                                        //return current.year() > 1900 && current.isBefore(moment())

                                        return current.format('YYYY-MM-DD') > moment().subtract(5, 'Y').format('YYYY-MM-DD') && current.year() > 1900 && current.isBefore(moment())
                                    }}
                                    onChange={(val) => {
                                        if (val) {
                                            this.userSelection.startDate = val.format ? val.format('YYYY/MM/DD') : '';
                                            this.userSelection.endDate = val.format ? val.format('YYYY/MM/DD') : this.userSelection.startDate;
                                            this.setState({
                                                errors: {
                                                    ...this.state.errors,
                                                    'date1': null,
                                                }
                                            });
                                        }


                                        // if (tmpDate.length > 1) {
                                        //     this.setState({
                                        //         startDateErr: false
                                        //     });
                                        // }
                                    }}
                                    value={this.state.defaultDate && this.state.defaultDate.indexOf('undefined') > -1 ? '' : this.state.defaultDate}
                                    validators={[
                                        {
                                            type: 'required',
                                            errorMessage: 'Selecciona rango o fecha',
                                        },
                                    ]}
                                    errors={this.state.errors}
                                // //defaultValue="2018/04/01"
                                />
                                {/* <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span> */}
                                {/* <input className="form-control" type="text" /> */}
                                {/* {
                                    this.state.startDateErr &&
                                    <div className="col-xs-12">
                                        <div>
                                            <strong>Selecciona rango o fecha </strong>
                                        </div>
                                    </div>
                                } */}
                            </div>
                        </div>

                    </div>
                }
                {
                    (this.state.checkedDateType == 2 && this.state.dateSelectionFormat == 'Month') &&
                    <div>
                        <div className="form-group" >
                            <div className="datepicker input-group date report-datepicker col-xs-8">
                                <Datetime
                                    id="date2"
                                    name="date2"
                                    className="form-control"
                                    range={true}
                                    dateFormat='YYYY/MM/DD'
                                    timeFormat={false}
                                    onRef={(date2) => this.date2 = date2}
                                    isValidDate={this.setRangeValidationToDate}
                                    onChange={(val) => {
                                        if (val) {
                                            let tmpDate = val.split(' - ');
                                            this.userSelection.startDate = tmpDate[0] ? tmpDate[0].trim() : '';
                                            this.userSelection.endDate = tmpDate[1] ? tmpDate[1].trim() : this.userSelection.startDate;

                                            this.setState({
                                                errors: {
                                                    ...this.state.errors,
                                                    'date2': null,
                                                }
                                            });
                                        }

                                        // if (tmpDate.length > 1) {
                                        //     this.setState({
                                        //         startDateErr: false
                                        //     });
                                        // }

                                    }}
                                    validators={[
                                        {
                                            type: 'required',
                                            errorMessage: 'Selecciona rango o fecha',
                                        },
                                    ]}
                                    errors={this.state.errors}
                                    value={this.state.defaultDate && this.state.defaultDate.indexOf('undefined') > -1 ? '' : this.state.defaultDate}
                                //defaultValue="2018/04/10-2018/04/14"
                                />
                                {/* <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span> */}
                                {/* <input className="form-control" type="text" /> */}
                                {/* {
                                    this.state.startDateErr &&
                                    <div className="col-xs-12">
                                        <div>
                                            <p>Selecciona rango o fecha </p>
                                        </div>
                                    </div>
                                } */}
                            </div>
                        </div>

                    </div>
                }
                {
                    (this.state.dateSelectionFormat != 'Month') &&
                    <div>
                        <div className="form-group" >
                            <div className="datepicker input-group date YY report-datepicker col-xs-8">
                                <Datetime
                                    name="date3"
                                    className="form-control"
                                    range={true}
                                    dateFormat='YYYY/MM/DD'
                                    timeFormat={false}
                                    onRef={(date3) => this.date3 = date3}
                                    isValidDate={this.setRangeValidationToDate}
                                    onChange={(val) => {
                                        if (val) {
                                            let tmpDate = val.split(' - ');
                                            this.userSelection.startDate = tmpDate[0] ? tmpDate[0].trim() : '';
                                            this.userSelection.endDate = tmpDate[1] ? tmpDate[1].trim() : this.userSelection.startDate;

                                            this.setState({
                                                errors: {
                                                    ...this.state.errors,
                                                    'date3': null,
                                                }
                                            });
                                        }

                                        // if (tmpDate.length > 1) {
                                        //     this.setState({
                                        //         startDateErr: false
                                        //     });
                                        // }
                                        //  alert(123);
                                    }}
                                    validators={[
                                        {
                                            type: 'required',
                                            errorMessage: 'Selecciona rango o fecha',
                                        },
                                    ]}
                                    errors={this.state.errors}
                                    value={this.state.defaultDate && this.state.defaultDate.indexOf('undefined') > -1 ? '' : this.state.defaultDate}
                                />
                                {/* <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span> */}
                                {/* <input className="form-control" type="text" /> */}
                                {/* {
                                    this.state.startDateErr &&
                                    <div className="col-xs-12">
                                        <div>
                                            <p>Selecciona rango o fecha </p>
                                        </div>
                                    </div>
                                } */}
                            </div>
                        </div>

                    </div>
                }

            </div>
        )

    }

    handleSubmit = (e, formValues, formErrors, isValidForm) =>
     {
        e.preventDefault();
        console.log(formErrors,"=====",isValidForm);
        this.setState({
            errors: formErrors
        })
        // if (isValidForm) {
        this.isValidForm = isValidForm
        // }
    }

    removeErrorMessage = (e) => {
        if (e && e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            e.target.parentElement.parentElement.style.display = 'none';
        }
    }

    // fileProcessingErrMsg = () => {
    //     return (<div className="col-xs-12">
    //         <div className="alertWarning"><i className="icon-tache2" />
    //             <p> Descargar Informe está procesando</p><a className="icon-tache2" />
    //         </div>
    //     </div>);
    // }

    render() {
        const { errors } = this.state,
            fileProcessingErrMsg = <div className="col-xs-12">
                <div className="alertWarning"><i className="icon-tache2" />
                    <p> Descargar Informe está procesando</p><a className="icon-tache2" />
                </div>
            </div>;

        return (
            <React.Fragment>

                <div className="newReportContainer" style={(this.props.viewType === this.viewType.NEW) || (this.props.viewType === this.viewType.FAV && this.props.favouriteReports && this.props.favouriteReports.length > 0) ? { display: 'block' } : { display: 'none' }}>
                    {
                        (!this.props.saveFavoriteReportsErrors) && (this.state.disableDownloadButton) && fileProcessingErrMsg
                    }
                    {/* <Form onSubmit={this.handleSubmit}> */}
                    <Form onSubmit={this.handleSubmit} onRef={(formToSubmit) => { this.formToSubmit = formToSubmit }}>
                        {this.props.viewType === this.viewType.FAV && this.props.favouriteReports && this.props.favouriteReports.length > 0 ? this.renderFavoriteCheckboxes() : ''}

                        <div className="row row-block">
                            <div className="col-xs-4">
                                <p className="articleName"><span className="requiredFields">*</span> Tipo de reporte</p>
                                <div className="cSelect required">
                                    <SelectionTab
                                        id={'typeOfReport'}
                                        name={'typeOfReport'}
                                        options={this.state.reportTypesOptions}
                                        // optionCaption={this.props.labels && this.props.labels['report.newreport.reportType']}
                                        optionCaption={'Selecciona un tipo de reporte'}
                                        disable={this.state.reportTypesOptions.length < 0}
                                        onChange={this.onReportTypeChange}
                                        value={this.state.optionValue}
                                        validators={([
                                            {
                                                type: 'required',
                                                errorMessage: 'Selecciona un tipo de reporte',
                                            },
                                        ])}
                                        errors={errors}
                                        disableCaption="false"
                                    />
                                </div>
                                {/* {
                                this.state.typeOfReportErr &&
                                <div className="col-xs-12">
                                    <div>
                                        <p>Selecciona un tipo de reporte</p>
                                    </div>
                                </div>
                            } */}
                                {
                                    this.userSelection && this.userSelection.reportTypeId != this.hideOnUserTypeReportId &&
                                    <div className="checkbox">
                                        <CheckBox
                                            id="chkEventoEmpleado"
                                            name="isEmployeeEvent"
                                            checked={this.state.isEmployeeEvent}
                                            getSelectedValue={(target) => {
                                                this.setState({ isEmployeeEvent: !this.state.isEmployeeEvent });
                                                this.userSelection.isEmployeeEvent = target.checked.toString();
                                            }}
                                            htmlFor="chkEventoEmpleado"
                                            displayName="Evento de empleado"

                                        />
                                        {/* <input id="chkEventoEmpleado" type="checkbox"
                                    name="isEmployeeEvent"
                                    checked={this.state.isEmployeeEvent}
                                    onChange={(event) => { this.setState({ isEmployeeEvent: !this.state.isEmployeeEvent });
                                    this.userSelection.isEmployeeEvent = event.target.checked.toString(); }} />
                                <label htmlFor="chkEventoEmpleado">Evento de empleado</label> */}
                                    </div>
                                }

                            </div>
                        </div>
                        <div className="col-xs-12">
                            <hr />
                        </div>
                        {
                            this.userSelection && this.userSelection.reportTypeId != this.hideOnUserTypeReportId &&
                            <div>
                                <div className="row row-block">
                                    <div className="col-xs-12">
                                        {/* <p className="articleName">{this.props.labels && this.props.labels['report.newreport.typeOfEvent']}</p> */}
                                        <p className="articleName">Tipo de evento</p>
                                        {/* <p className="descriptiveTextSecond">{this.props.labels && this.props.labels['report.selectOneOrMoreOptions']}</p> */}
                                        <p className="descriptiveTextSecond">Selecciona una o más opciones</p>
                                    </div>
                                    {this.state.eventTypes ? this.renderEventsCheckboxes() : ""}
                                </div>
                                <div className="col-xs-12">
                                    <hr />
                                </div>
                            </div>
                        }


                        <div className="row row-block">
                            <div className="col-xs-12">
                                {/* <p className="articleName"><span className="requiredFields">*</span> {this.props.labels && this.props.labels['report.newreport.brand']}</p> */}
                                <p className="articleName"><span className="requiredFields">*</span> Marca</p>
                                {/* <p className="descriptiveTextSecond">{this.props.labels && this.props.labels['report.selectOneOrMoreOptions']}</p> */}
                                <p className="descriptiveTextSecond">Selecciona una o más opciones</p>
                            </div>
                            {this.state.brands ? this.renderBrandsCheckboxes(this.state.brands) : ""}
                        </div>

                        <div className="col-xs-12">
                            <hr />
                        </div>
                        <div className="row row-block">
                            <div className="col-xs-12">
                                <p className="articleName">Zona</p>
                                {/* <p className="descriptiveTextSecond">{this.props.labels && this.props.labels['report.selectOneOrMoreOptions']}</p> */}
                                <p className="descriptiveTextSecond">Selecciona una o más opciones</p>
                            </div>
                            <div className="col-xs-4">
                                <div className="scrollOptions">
                                    {this.state.zones ? this.renderCheckboxes(this.state.zones, 'zone') : ""}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <hr />
                        </div>
                        <div className="row row-block">
                            <div className="col-xs-12">
                                <p className="articleName">Tienda</p>
                                {/* <p className="descriptiveTextSecond">{this.props.labels && this.props.labels['report.selectOneOrMoreOptions']}</p> */}
                                <p className="descriptiveTextSecond">Selecciona una o más opciones</p>
                            </div>
                            <div className="col-xs-4">
                                <div className="scrollOptions">
                                    {this.state.stores ? this.renderCheckboxes(this.state.stores, 'store') : ""}
                                </div>
                            </div>
                            {
                                this.state.storeSelectionLimitErr &&
                                <div className="col-xs-12">
                                    <div>
                                        <label className="error">No puedes seleccionar más de {this.state.storeSelectionLimit} tiendas.</label>
                                    </div>
                                </div>
                            }

                        </div>

                        {this.userSelection && this.userSelection.reportTypeId != this.hideOnUserTypeReportId &&
                            <React.Fragment>
                                <div className="col-xs-12">
                                    <hr />
                                </div>
                                <div className="row row-block">
                                    <div className="col-xs-12">
                                        <p className="articleName"><span className="requiredFields">*</span> Fecha</p>
                                        {/* <p className="descriptiveTextSecond">{this.props.labels && this.props.labels['report.selectOneOrMoreOptions']}</p> */}
                                        <p className="descriptiveTextSecond">Selecciona una o más opciones</p>
                                    </div>

                                    <div className="col-xs-12" style={{ display: (this.state.dateSelectionFormat == 'Month') ? 'block' : 'none' }}>
                                        <div className="radio">
                                            <input id="un-1" type="radio" name="fechaRadios"
                                                defaultValue={1}
                                                checked={this.state.checkedDateType === 1}
                                                onChange={() => {
                                                    this.setState({ checkedDateType: 1 });
                                                }} />
                                            <label htmlFor="un-1">Única fecha</label>
                                        </div>
                                        <div className="radio">
                                            <input id="ra-1" type="radio" name="fechaRadios"
                                                defaultValue={2}
                                                checked={this.state.checkedDateType === 2}
                                                onChange={() => {
                                                    this.setState({ checkedDateType: 2 });
                                                }} />
                                            <label htmlFor="ra-1">Rango de Fecha</label>
                                        </div>
                                    </div>

                                    <div className="col-xs-4">
                                        {this.setDatePicker()}
                                    </div>

                                    <div className="col-xs-12">
                                        <CheckBox
                                            id="time-compare-chk"
                                            disabled={!this.state.isTimeComparisonAllowed || this.state.isDetailedReport}
                                            checked={this.state.isTimeComparisonReport}
                                            getSelectedValue={this.onTimeCompareChecked}
                                            htmlFor="time-compare-chk"
                                            displayName={'Comparar ' + commonUtil.getLabel(this.props.labels, 'reporting.comparar.message')}
                                        />
                                    </div>
                                    <div className="col-xs-4">

                                        {(this.state.isTimeComparisonReport && this.state.checkedDateType == 1 && this.state.dateSelectionFormat == 'Month') &&
                                            <div className="form-group">
                                                <div className="datepicker input-group date MM report-datepicker col-xs-8">
                                                    <Datetime
                                                        name="date4"
                                                        className="form-control"
                                                        range={false}
                                                        dateFormat='MM/YYYY'
                                                        timeFormat={false}
                                                        onRef={(date4) => this.date4 = date4}
                                                        isValidDate={function (current) {
                                                            //let startdateMomentObj = moment(this.userSelection.startDate);
                                                            //return (current.year() >= (startdateMomentObj.year()) && current.month() >= (startdateMomentObj.month()) && current.year() <= (startdateMomentObj.year()) && current.month() <= (startdateMomentObj.month()));
                                                            //return current.year() > 1900 && current.isBefore(moment())
                                                            return current.format('YYYY-MM-DD') > moment().subtract(5, 'Y').format('YYYY-MM-DD') && current.year() > 1900 && current.isBefore(moment())
                                                        }.bind(this)}
                                                        onChange={(val) => {

                                                            if (val) {
                                                                this.userSelection.compareStartDate = val.format ? val.format('YYYY/MM/DD') : '';
                                                                this.userSelection.compareEndDate = val.format ? val.format('YYYY/MM/DD') : this.userSelection.compareStartDate;
                                                                this.setState({
                                                                    errors: {
                                                                        ...this.state.errors,
                                                                        'date4': null,
                                                                    }
                                                                });
                                                            }


                                                            // if (tmpDate.length > 1) {
                                                            //     this.setState({
                                                            //         startDateErr: false
                                                            //     });
                                                            // }
                                                        }}
                                                        value={this.state.defaultCompareDate && this.state.defaultCompareDate.indexOf('undefined') > -1 ? "" : this.state.defaultCompareDate}
                                                        validators={[
                                                            {
                                                                type: 'required',
                                                                errorMessage: 'Selecciona rango o fecha',
                                                            },
                                                        ]}
                                                        errors={this.state.errors}
                                                    // //defaultValue="2018/04/01"
                                                    />
                                                    {/* <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span> */}
                                                    {/* <input className="form-control" type="text" /> */}
                                                    {/* {
                                    this.state.startDateErr &&
                                    <div className="col-xs-12">
                                        <div>
                                            <strong>Selecciona rango o fecha </strong>
                                        </div>
                                    </div>
                                } */}
                                                </div>
                                            </div>

                                        }

                                        {(this.state.isTimeComparisonReport && (this.state.dateSelectionFormat == 'Month' && this.state.checkedDateType == 2 ? true : this.state.dateSelectionFormat != 'Month' ? true : false)) &&
                                            <div className="form-group">
                                                <div className="datepicker input-group date report-datepicker col-xs-8">
                                                    {/* <input className="form-control" type="text" /> */}
                                                    <Datetime
                                                        name="date4"
                                                        className="form-control"
                                                        range={true}
                                                        dateFormat='YYYY/MM/DD'
                                                        timeFormat={false}
                                                        onRef={(date4) => this.date4 = date4}
                                                        isValidDate={this.setRangeValidationToDate}
                                                        // {function (current) {
                                                        //     //return current.year() > 1900 && current.isBefore(moment()) && (current.isSameOrAfter(moment(this.userSelection.startDate)) && current.isSameOrBefore(moment(this.userSelection.endDate)));
                                                        //     return current.year() > 1900 && current.isBefore(moment())
                                                        // }.bind(this)}
                                                        onChange={(val) => {
                                                            if (val) {
                                                                let tmpDate = val.split(' - ');
                                                                this.userSelection.compareStartDate = tmpDate[0] ? tmpDate[0].trim() : '';
                                                                this.userSelection.compareEndDate = tmpDate[1] ? tmpDate[1].trim() : this.userSelection.compareStartDate;
                                                                this.setState({
                                                                    errors: {
                                                                        ...this.state.errors,
                                                                        'date4': null,
                                                                    }
                                                                });
                                                            }

                                                        }}
                                                        value={this.state.defaultCompareDate && this.state.defaultCompareDate.indexOf('undefined') > -1 ? "" : this.state.defaultCompareDate}
                                                        validators={[
                                                            {
                                                                type: 'required',
                                                                errorMessage: 'Selecciona rango o fecha',
                                                            },
                                                        ]}
                                                        errors={errors}
                                                    //defaultValue="2018/04/01-2018/04/10"
                                                    />
                                                    {/* <span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span> */}
                                                    {/* {
                                            this.state.compareStartDateErr &&
                                            <div className="col-xs-12">
                                                <div>
                                                    <strong>Selecciona rango o fecha </strong>
                                                </div>
                                            </div>
                                        } */}
                                                </div>
                                            </div>}
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                        <div className="col-xs-12">
                            <hr />
                        </div>
                        <div className="row row-block">
                            <div className="col-xs-12">
                                <p className="articleName">Detalle del reporte</p>
                                <p className="descriptiveTextSecond">El detalle del reporte no cubre fechas mayores a 30 días ni comparaciones.</p>
                            </div>
                            <div className="col-xs-4">
                                <div className="checkbox">
                                    <CheckBox
                                        id="detail-report-chk"
                                        disabled={!this.state.isDetailedReportAllowed || this.state.isTimeComparisonReport}
                                        checked={this.state.isDetailedReport}
                                        getSelectedValue={this.onDetailReportChecked}
                                        htmlFor="detail-report-chk"
                                        displayName="Descargar reporte con detalle "
                                    />
                                    {/* <input id="detail-report-chk"
                                type="checkbox"
                                disabled={!this.state.isDetailedReportAllowed}
                                checked={this.state.isDetailedReport}
                                onChange={this.onDetailReportChecked} />
                                <label htmlFor="detail-report-chk">Descargar reporte con detalle </label> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12" style={this.props.saveFavoriteReportsErrors && this.props.saveFavoriteReportsErrors.errorMessage ? { display: 'block' } : { display: 'none' }}>
                            <div className="alertError"><i className="icon-tache2" />
                                <p > {this.props.saveFavoriteReportsErrors && this.props.saveFavoriteReportsErrors.errorMessage ? this.props.saveFavoriteReportsErrors.errorMessage : ''}</p><a className="icon-tache2" onClick={this.removeErrorMessage.bind(this)} />
                            </div>
                        </div>

                        {/* {
                        (this.state.compareStartDateErr || this.state.startDateErr) &&
                        <div className="col-xs-12">
                            <div className="alertError"><i className="icon-tache2" />
                                <p > Selecciona rango o fecha</p><a className="icon-tache2" />
                            </div>
                        </div>
                    }

                    {
                        this.state.typeOfReportErr &&
                        <div className="col-xs-12">
                            <div className="alertError"><i className="icon-tache2" />
                                <p> Selecciona un tipo de reporte</p><a className="icon-tache2" />
                            </div>
                        </div>

                    } */}

                        {
                            (!this.props.saveFavoriteReportsErrors) && (this.state.disableDownloadButton) && fileProcessingErrMsg
                        }

                    
                    <div className="row row-block pt-20">
                        <div className="col-xs-3">
                            <button className="btnSecondaryAction size-Full" onClick={browserHistory && browserHistory.goBack}>Cancelar</button>
                        </div>
                        <div className="col-xs-3 col-xs-offset-3" style={this.props.viewType === this.viewType.FAV ? { display: 'block' } : { display: 'none' }}>
                            <button type="submit" name="updateFavorite" className="btnPrimaryAction size-Full" onClick={this.saveFavouriteReport}>Actualizar favorito</button>
                            {/* <button type="submit" name="updateFavorite" className="btnPrimaryAction size-Full">Actualizar favorito</button> */}
                        </div>
                        {/* style={this.props.viewType !== this.viewType.FAV ? { display: 'block' } : { display: 'none' }} */}
                        <div className={`col-xs-3 ${this.props.viewType !== this.viewType.FAV ? 'col-xs-offset-3' : ''}`}>
                            <button className="btnPrimaryAction size-Full saveAsFavorite" onClick={this.showSaveFevConfirmationModel}>Guardar como favorito</button>
                            {/* <button type="submit" name="saveAsFavorite" className="btnPrimaryAction size-Full saveAsFavorite">Guardar como favorito</button> */}
                        </div>
                        <div className={`col-xs-3 ${this.props.viewType === this.viewType.FAV ? 'col-xs-offset-9 mt-10' : ''} `}>
                            <button className={`btnPrimary size-Full ${((!this.props.saveFavoriteReportsErrors) && this.state.disableDownloadButton) || (this.state.storeSelectionLimitErr) ? ' btnPrimaryDisable' : ''}`} onClick={this.generateReport}  >Descargar</button>
                            {/* <button type="submit" name="downloadReport" className="btnPrimary size-Full" >Descargar</button> */}
                        </div>
                    </div>
                </Form>
                </div>
                {
                    (this.props.viewType === this.viewType.FAV && this.props.favouriteReports && !this.props.favouriteReports.length) &&
                    <div>
                        No se encontraron reportes favoritos
                    </div>
                }



                <a ref={download => (this.download = download)} />
                <SaveFevConfirmationModal onRef={ref => (this.saveFevConfirmationModal = ref)} onSaveFevConfirmClick={this.saveFavouriteReport} />
                <DeleteConfirmationModal onRef={ref => (this.deleteConfirmationModal = ref)} onDeleteConfirmClick={this.onDeleteConfirmClick} />
                <UpdateConfirmationModal onRef={ref => (this.updateConfirmationModal = ref)} />
            </React.Fragment >
        );
    }
}
export default NewReport;
