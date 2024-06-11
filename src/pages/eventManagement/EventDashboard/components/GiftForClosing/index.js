import React, { Component } from 'react';
import TrackDeliverModal from '../modals/TrackDeliverModal';

class GiftForOpening extends Component {

    handleOpenTrackDeliveryModal = () => {
        this.TrackDeliverModal.handleShow();
    }
    componentDidMount() {
        this.props.getEventDeliveryAddressesForGiftOpening(this.props.eventId);
    }
    getOpeningAndClosingContent = () => {

    }
    renderContent = (closingGiftPriceRange) => {
        const currentGiftAmountTotal = closingGiftPriceRange.closingGiftPriceRangeInfo && closingGiftPriceRange.closingGiftPriceRangeInfo.currentGiftAmountTotal;
        const requiredGiftAmountTotal = closingGiftPriceRange.closingGiftPriceRangeInfo && closingGiftPriceRange.closingGiftPriceRangeInfo.requiredGiftAmountTotal;
        return (
            <React.Fragment>
                <h3>REGALO POR APERTURA<a role="button"
                    data-toggle="collapse"
                    data-parent="#accordion"
                    href="#collapse2"
                    aria-expanded="true"
                    aria-controls="collapse2"
                    style={{ float: "right" }} className="">
                    <i className="iClass icon-flecha_gruesa_abajo" style={{ padding: "0px 10px", color: "#666" }}></i>
                </a>
                </h3>
                <label htmlFor="radio1" data-option="storeAddress">Acreedor a regalo por cierre</label>
                <span>
                    <p>{currentGiftAmountTotal}</p>
                </span>
                {currentGiftAmountTotal === requiredGiftAmountTotal ?
                    this.getOpeningAndClosingContent()
                    : null}
            </React.Fragment>
        )
    }

    render() {
        const { loading, closingGiftPriceRange } = this.props;
        return (
            <div className="col-xs-6 marginTop15">
                <TrackDeliverModal onRef={ref => (this.TrackDeliverModal = ref)} />
                <div className="boxStyle boxSmall">
                    {
                        this.props.loading ?
                            <h3>Loading</h3> :
                            this.renderContent(closingGiftPriceRange)
                    }
                </div>
            </div>)
    }
}

export default GiftForOpening;
