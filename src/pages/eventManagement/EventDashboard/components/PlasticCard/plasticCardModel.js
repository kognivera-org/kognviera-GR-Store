import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../../lib/ZUILib/Modal';
import { getLabels } from '../../../../global/Labels/actions';
import * as cardActions from '../../actions';
import TextInput from '../../../../../lib/ZUILib/TextInput';
import Form from '../../../../../lib/ZUILib/Form';
import commonUtil from '../../../../../utils/commonUtil';

@connect(
  store => ({
    labels: store.labels.labels,
    plasticCard: store.eventdashboard.plasticCard,
    addPlasticCardFailedMessage: store.eventdashboard.addPlasticCardFailedMessage,
  }),
  { getLabels, ...cardActions },
)

class PlasticCardModel extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.createdNewCardInputField = []
    this.state = {
      error: [],
    }
  }

  handleAddNewPlasticCard = (e, formValues, formErrors, isValidForm) => {

    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    const formId = e.currentTarget.id;
    if (isValidForm) {
      const eventId = this.props.eventdetail.eventDetailsInfo.eventId;
      const newCardnumber = formValues[formId].plasticCard;
      const ownerId = formValues[formId].celebrity;
      const celebrity = this.props.eventdetail.eventDetailsInfo.celebrityInfo.filter(cele => cele.repositoryId === ownerId)[0]
      const plasticCardInfos = this.props.plasticCardDetails.plasticCardInfos ? this.props.plasticCardDetails.plasticCardInfos : [];
      const celebrityInfo = this.props.eventdetail.eventDetailsInfo.celebrityInfo;
      this.props.addPlasticCard(eventId, ownerId, newCardnumber, celebrity, plasticCardInfos, celebrityInfo);
    }
  }

  addNewCardOfOwner = (event, ownerId) => {
    this.isCardActive.forEach((item) => {
      if (item.ownerId === ownerId && item.isAddPlasticCardAddEligible) {
        this.setState({
          ['placticNumber_' + event.target.id]: true
        });
      }
    })

  }
  // Below function will execute when there is atleast 1 plastic card associated for a celebrity
  displayPlasticCardData = () => {
    const { labels } = this.props;
    const plasticCardInfos = this.props.plasticCardDetails.plasticCardInfos;
    return plasticCardInfos.map((cardOwner, index) => {
      return < div key={index} className="row cardModalRow vertical-align" >
        <div className="col-xs-4">
          <p>{cardOwner.firstName}&nbsp;{cardOwner.lastName}</p>
        </div>
        <div className="col-xs-8">
          <div className="row">
            <div className="col-xs-6 labelCard">
              <div className="formBlock">
                <div className="materialStyle">
                  <p>{cardOwner.plasticCardNumber}</p>
                </div>
              </div>
            </div>
            <div className="col-xs-6 labelCheck">
              <div className="formBlock">
                <i className="icon-check checkMark" /> {commonUtil.getLabel(labels, 'dashboard.plasticcard.success.message')}
              </div>
            </div>
          </div>
        </div>
      </div >
    })
  }
  getFieldOrLable = (plasticCardInfos, celebrity) => {
    const { labels } = this.props;
    const { errors } = this.state;
    if (plasticCardInfos && plasticCardInfos.length > 0) {
      for (let i = 0; i < plasticCardInfos.length; i++) {
        if (plasticCardInfos[i].ownerId === celebrity.repositoryId) {
          return (
            <React.Fragment>
              <div className="col-xs-4 labelCard">
                <div className="formBlock">
                  <div className="materialStyle">
                    <p>{plasticCardInfos[i].plasticCardNumber}</p>
                  </div>
                </div>
              </div>
              <div className="col-xs-4 labelCheck">
                <div className="formBlock">
                  <i className="icon-check checkMark" /> {labels && labels['dashboard.plasticcard.success.message']}

                </div>
              </div>
            </React.Fragment>
          )
        }
      }
    }
    return (
      <React.Fragment>
        <div className="col-xs-4 labelCard">
          <TextInput
            value=""
            type="number"
            className="inputMaterial"
            labelClassName="placeHolderMaterial"
            formId={"newPlastciCard" + celebrity.repositoryId}
            htmlId="plasticCard"
            name="plasticCard"
            required="required"
            star="*"
            maxlength="13"
            validators={
              [{
                type: 'exactLength',
                errorMessage: 'Debe tener 13 caracteres',
                length: 13,
              }]
            }
            errors={errors}
          />
        </div>
        <div className="col-xs-4 labelCheck">
          <button className="btnPrimaryAction size-Full saveModalCardRow">Guardar</button>
        </div>
      </React.Fragment>
    )
  }
  // Below function will execute when there is no plastic card associated for a celebrity
  addNewPlasticCard = () => {
    const self = this.props;
    if (!self.isEmptyObject(self.eventdetail)) {
      const celebrityInfo = self.eventdetail.eventDetailsInfo && self.eventdetail.eventDetailsInfo.celebrityInfo
      const plasticCardInfos = !self.isEmptyObject(self.plasticCardDetails) && self.plasticCardDetails.plasticCardInfos ? self.plasticCardDetails.plasticCardInfos : null;
      // if (!plasticCardInfos) {
      //   return null;
      // }
      return celebrityInfo.map(celebrity => (
        celebrity.isCelebrity &&
        <Form className="row cardModalRow vertical-align"
          id={"newPlastciCard" + celebrity.repositoryId}
          onSubmit={this.handleAddNewPlasticCard}>
          <div className="col-xs-4">
            <p>{celebrity.firstName}&nbsp;{celebrity.lastName}</p>
            <input type="hidden" value={celebrity.repositoryId} name="celebrity" />
          </div>
          {this.getFieldOrLable(plasticCardInfos, celebrity)}
        </Form>
      ))
    }
    return null
  }
  getCelebratyData = () => {
    const plasticCardDetails = this.props.plasticCardDetails;
    const eventdetail = this.props.eventdetail;
    if (!this.props.isEmptyObject(plasticCardDetails) && plasticCardDetails.plasticCardInfos &&
      this.props.isEmptyArray(plasticCardDetails.plasticCardInfos) &&
      !this.props.isEmptyObject(eventdetail) && eventdetail.eventDetailsInfo &&
      plasticCardDetails.plasticCardInfos.length === eventdetail.eventDetailsInfo.celebrityInfo.length) {
      return this.displayPlasticCardData()
    }
    return this.addNewPlasticCard()
  }

  render() {
    const { labels } = this.props;
    return (
      <div>
        {this.props.show &&
          <Modal show={this.props.show} id="addPlasticCard" className="modal fade modal-custom">
            <ModalHeader handleClose={this.props.handleClose} >
              <ModalTitle>{labels && labels['dashboard.plasticcard.text']}</ModalTitle>
            </ModalHeader>
            <ModalBody>

              <p>{labels && labels['dashboard.plasticcard.informational.message']}</p>
              <div className="row">
                <label className="error">
                  {this.props.addPlasticCardFailedMessage ? this.props.addPlasticCardFailedMessage.errorMessage : null}
                </label>
              </div>
              <div className="row cardModalRow">
                <div className="col-xs-4">
                  <p className="titleModalRow">Festejado</p>
                </div>
                <div className="col-xs-4">
                  <p className="titleModalRow">Número de plástico</p>
                </div>
                <div className="col-xs-4">
                  <p className="titleModalRow">Guardar</p>
                </div>
              </div>
              {this.getCelebratyData()}

            </ModalBody>
          </Modal>
        }
      </div>
    )
  }
}
export default PlasticCardModel
