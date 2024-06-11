/* Library */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import commonUtil from '../../../../../utils/commonUtil'
import { getLabels } from '../../../../../pages/global/Labels/actions'
import routeconfig from '../../../../../config/routeconfig'
import Button from '../../../../../lib/ZUILib/Button'
import Link from '../../../../../lib/ZUILib/Link'
import Image from '../../../../../../src/lib/ZUILib/Image'
import appconfig from '../../../../../config/appconfig'
// import Image from 'lib/ZUILib/Image';
/* eslint-disable*/

@connect(store => ({
  labels: store.labels.labels,
}),
  {
    getLabels,
  })
export default class PredeterminedListsWeb extends Component {
  handleAddListToMyList = (repoId) => {
    this.props.handleAddListToMyList(repoId);
    document.getElementById(repoId).style.display = 'block';

  }

  getLinkParams = (id) => {
    const predeterminedDetails = {
      text: 'Link Text',
      children: 'Ver artículos de lista',
      href: commonUtil.generateRedirect('' + routeconfig.PredeterminedListsDetailsWeb, { 'eventId': this.props.eventId, 'repoId': id, 'brand': this.props.brand }),
      //href: '/PredeterminedListsDetailsWeb/' + this.props.eventId + "/" + id + "/" + this.props.brand,
      className: 'btnSecondarySpecial size-Full',
    };
    return predeterminedDetails;
  }
  getItem = (predeterminedListInfo) => {


    const addListToMyList = {

      className: 'btnPrimary size-Full',
      iconClass: 'icon-flecha_lightsvg_derecha',

    };


    const addPredeterminedItemInfo = this.props.addPredeterminedItemInfo ? this.props.addPredeterminedItemInfo[0] : null;


    return predeterminedListInfo.map((list, index) => {
      const newAddListButton = Object.assign({}, addListToMyList);


      newAddListButton.onClickHandler = () => this.handleAddListToMyList(list.itemId);



      return (<div className="col-xs-3" key={index}>

        <h2 >{list.itemName.toUpperCase()}</h2>
        <p className="articles"><span>{list.noOfItems} &nbsp;</span><span>{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.total.articles')}</span></p>
        <p className="range"><span>{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.gifts.label1')} {commonUtil.getCurrency(list.minPrice)} {commonUtil.getLabel(this.props.labels, 'predetermine.listpage.gifts.label2')} {commonUtil.getCurrency(list.maxPrice)}</span></p>
        <p className="totalValue"><span>{commonUtil.getLabel(this.props.labels, 'predetermine.listpage.total.label')}</span><b > {commonUtil.getCurrency(list.totalPrice)}</b></p>

        <div className="imgBlock">
          <div className="addedList" id={list.itemId} style={{ height: 255 }}>
            <p>{commonUtil.getLabel(this.props.labels, 'predetermine.landing.default.list.added.to.your.list.label')}</p>
          </div>
          <Image src={list.imageURL} altimg={appconfig.defaultImage} />

        </div>
        <div className="buttonBlock">
          <Link {...this.getLinkParams(list.itemId) }>{commonUtil.getLabel(this.props.labels, 'predetermine.seelist.button.label')}</Link>

          <Button {...addListToMyList} onClick={(repoId) => this.handleAddListToMyList(list.itemId)}>{commonUtil.getLabel(this.props.labels, 'predetermine.addtolist.button.label')}<i className="icon-flecha_lightsvg_derecha"></i></Button>

        </div>

      </div >);
    });
  }

  render() {

    const predeterminedListInfo = this.props.predeterminedListInfo;
    const returnToRegisteredGifts = {
      text: 'Link Text',
      children: 'Regresar a regalos registrados',
      href: commonUtil.generateRedirect('' + routeconfig.registeredgifts, { 'eventId': this.props.eventId }),

    };

    return (
      <div className="container">
        {/* <ApplyCSS pageName={pageName} /> */}
        <div className="row listHeader">
          <div className="col-md-12">

            <Link {...returnToRegisteredGifts}>{commonUtil.getLabel(this.props.labels, 'predetermined.regrassar.label')}</Link>
            <h1 className="titleSection">{commonUtil.getLabel(this.props.labels, 'predetermine.heading.label')}</h1>

            <p>{commonUtil.getLabel(this.props.labels, 'predetermined.heading.text')}</p>
          </div>
        </div>

        <div className="row listsBlock">
          {this.getItem(predeterminedListInfo)}
        </div>

      </div>

    );
  }
}

