
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import commonUtil from '../../../../utils/commonUtil';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal';
import { getInTransitDetails } from '../../actions';
import { getLabels } from '../../../global/Labels/actions';
import Image from 'lib/ZUILib/Image';
import appconfig from '../../../../config/appconfig';

@connect(
  store => ({
    inTransitDetails: store.accountSummary.data,
    labels: store.labels.labels,

  }),
  { getInTransitDetails, getLabels })


class InTransitModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.pageName = 'intransitmodal';
    this.state = {
      show: false,
    };
  }
  componentWillMount() {

  }

  handleClose() {
    document.body.classList.remove('modal-open');
    this.setState({ show: false });
  }


  handleShow() {
    document.body.classList.add('modal-open');
    this.props.getInTransitDetails(this.props.eventId);
    this.setState({ show: true });
    const mainBody = document.getElementByTagName('body');
    mainBody.classList.add = 'modal-open';
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  render() {
    const { labels } = this.props;
    return (
      <div>
        <Modal show={this.state.show} onHide={this.handleClose} id="AccountSummaryModal" className="modal fade modal-custom">
          <ModalHeader closeButton="" handleClose={this.handleClose}>
            <ModalTitle>Regalos en tránsito</ModalTitle>
            <p>{commonUtil.getLabel(labels, 'accountStatement.intransit.message')}</p>
          </ModalHeader>
          <ModalBody>
            <div className="modal-body">
              <div className="row ph-15">
                <div className="col-xs-12 bv nph">
                  <div className="custom-grid-5 nmv">
                    <div className="centeredh"><span>Fecha</span></div>
                    <div className="centeredh"><span>Artículo</span></div>
                    <div className="centeredh"><span>Cantidad</span></div>
                    <div className="centeredh"><span>Tienda</span></div>
                    <div className="centeredh"><span>Precio</span></div>
                  </div>
                </div>
              </div>
              {!_.isEmpty(this.props.inTransitDetails.inTransitInfo)
                ?
                  <div className="container-results">
                  {this.props.inTransitDetails.inTransitInfo.map((data, index) =>
                    <div key={index} className="row ph-15">
                      <div className="custom-grid-5-product border-bottom-p">
                        <div className="mensaje centeredh">
                          <p>{data.date}</p>
                        </div>
                        <div className="grid-two-elements-detail">
                          <div className="col-xs-12">
                            <Image className="img-detail-80" src={data && data.image ? data.image : appconfig.defaultImage} />
                          </div>
                          <div>
                            <p className="detailTitle"> {data.productName} </p>
                            <p className="detailSKU">{data.skuId}</p>
                          </div>
                        </div>
                        <div className="quantity">
                          <p className="detailQuantity">{data.quantity}</p>
                        </div>
                        <div className="tienda centeredh">
                          <p> {data.brand}</p>
                        </div>
                        <div className="price">
                          <p className="detailPrice">{commonUtil.getCurrency(data.amount)}</p>
                        </div>
                      </div>
                    </div>,
                  )}
                </div>
                : 'No Records Found.'}
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default InTransitModal;
