
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'lib/ZUILib/Link';
import _ from 'lodash';
import commonUtil from '../../../utils/commonUtil';
import routeconfig from '../../../config/routeconfig';
import PartialTransference from '../../accountSummary/components/PartialTransference/RetiroAnticipado';
import ReturnRefundConfirmation from '../../accountSummary/components/PartialTransference/ReturnRefundConfirmation';
import Image from 'lib/ZUILib/Image';
import PrintDownload from '../../global/PrintDownload'
import MultiStepProgressBar from '../../../components/MultiStepProgressBar/MultiStepProgressBar';

const pageName = 'RefundsLandingPage';

@connect(
    store => ({
        returnList: store.returnAndRefund.returnList
    })
)


class RefundsLandingPage extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        displayConfirmation: false,
        printReturnProd: false,
        printVerification: false,
        disableDownload: false,
        step: 1,
        walletStep: null
    }
    // UNSAFE_componentWillMount() {
    //     if (!this.props.returnList) {
    //         let eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    //         this.props.router.push('/searchforreturn/' + eventId);
    //     }
    // }

    walletStep = (type) => {
        this.setState({
            walletStep:type
        })
    }

    setStep = (step) => {
        this.setState ({
          step: step
        })
      }

    showConfirm = () => {
        this.setState({
            displayConfirmation: true
        })
    }


    downloadToPDF = async (param) => {
        if (param && param === 'download') {
            this.setState({ disableDownload: true })
            commonUtil.downloadPdf('.toPrintDevolution', 'Devolution.pdf', 'false', () => {
                this.setState({ disableDownload: false })
            })
        } else if (param && param === 'print') {
            commonUtil.downloadPrint('print', `${pageName}`, '.toPrintDevolution')
        }
    }

    render() {
        const { returnList } = this.props;
        const refundList = [];
        if (returnList && returnList.returnItemsInfo && returnList.returnItemsInfo.length) {
            returnList.returnItemsInfo.map((data, key) => {
                refundList.push(<tr key={key}>
                    <td><Image src={data.productImage} /></td>
                    <td>{data.skuId}</td>
                    <td className="item">{data.productName}</td>
                    <td>{data.purchaseType}</td>
                    <td>{data.quantity}</td>
                    <td>{commonUtil.getCurrency(data.unitPrice)}</td>
                    <td>{commonUtil.getCurrency(data.totalPrice)}</td>
                    <td></td>
                </tr>
                );
            });
            const newkey = refundList.length + 1;
            refundList.push(<tr key={newkey}>
                <td className="tbl-total" colSpan="7">TOTAL:</td>
                <td className="tbl-total">{commonUtil.getCurrency(returnList.totalRefundAmount)}</td>
            </tr>
            )
        } else {
            return null;
        }



        return (
            // <div>
            <React.Fragment>
            <div className="container wrapTransference innerDevolutions toPrintDevolution">
                <div className="col-xs-12" style={{width: "95%", padding: "5% 0px 0px 3%"}}>
                    {!this.state.displayConfirmation
                    ? this.state.walletStep === 'reinvest'
                    ?  <MultiStepProgressBar steps={2} page={this.state.step} stepsLabels={["Forma de depósito", "Verificación de devolución"]}/>
                    :  <MultiStepProgressBar steps={4} page={this.state.step} stepsLabels={["Forma de depósito", "Verificación de devolución", "Verificación de seguridad","Autorización del movimiento"]}/>
                    : null 
                    }
                </div>
                <div className="col-xs-12">
                    <h2 className="titleSection">Devoluciones</h2>
                    {
                       this.state.displayConfirmation ?
                       <div className="row">
                            <div className="col-xs-6">
                                <p className="descriptiveText">Las devoluciones no bonifican y son eliminadas de tu presupuesto de Mesa de Regalos.</p>
                            </div>
                            <div className="col-xs-6 alignRight exclude-for-print-download">
                                <div className="iconWrap">
                                    <PrintDownload useIframe={true} elem='.toPrintDevolution' footer='Devolution' fileName='Devolution.pdf' usePageHeader='false' printFunc={() => commonUtil.printPage('.toPrintDevolution')} index={1} />
                                </div>
                            </div>
                        </div>
                       :  
                       <p className="descriptiveText">Las devoluciones no bonifican y son eliminadas de tu presupuesto de Mesa de Regalos.</p>
                    }
                </div>       
                {this.state.step === 1  || this.state.displayConfirmation
                ? <div className="productsForDevolutionContent" >
                <div className="col-xs-12">
                    <h3 className="titleModule" style={{fontSize: "15px", fontWeight: "500"}}>Productos para devolución</h3>
                </div>
                <div className="col-xs-12">
                    <table className="product">
                        <thead>
                            <tr>
                                <td></td>
                                <td>SKU</td>
                                <td className="item">Producto</td>
                                <td>Tipo de compra</td>
                                <td>Cantidad</td>
                                <td>Precio</td>
                                <td>Total</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {refundList}
                        </tbody>
                    </table>
                </div>
            </div>
            : null}
                {!this.state.displayConfirmation ?
                    <div className="devolutionContent exclude-for-print-download" >
                        <div className="col-xs-12" >
                            <PartialTransference type="refund" step={this.setStep}
                                walletStep={this.walletStep}
                                params={this.props.params}
                                refundAmount={parseFloat(returnList.totalRefundAmount).toFixed(2)}
                                router={this.props.router}
                                showConfirm={this.showConfirm}
                                onConfirmClicked={this.props.onConfirmClicked} />
                        </div>
                    </div>
                    :
                    <ReturnRefundConfirmation router={this.props.router} params={this.props.params} />
                }
            </div>
            </React.Fragment>
            // {/* </div> */}
        )

    }
}

export default RefundsLandingPage;