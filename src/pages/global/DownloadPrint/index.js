import React, { Component } from 'react';
import axios from 'axios';
import Link from '../../../lib/ZUILib/Link';
import appconfig from '../../../config/appconfig';
import commonUtil from '../../../utils/commonUtil';
import PrintModal from './PrintModal';

class DownloadPrint extends Component {

    state = {
        print: false
    }

    constructor(props) {
        super(props);
        this.download = {}
    }

    do = async (op, args) => {
        try {

            let markup = ''
            let template = ''
            let eventId = ''
            args && args.before && await args.before();

            const divEle = commonUtil.generatePdfContent(this.props.elem || '.toDownload', 'false');

            if (this.props.divLabel) {
                template = this.props.template
                eventId = this.props.eventId
            } else {
                markup = divEle.innerHTML;
            }
            const config = {
                method: 'post',
                url: '/api/print',
                responseType: 'blob',
                data: {
                    markup,
                    template,
                    eventId,
                    footer: this.props.footer,
                    brand: (args && args.brand) || commonUtil.getBrand()
                },
            };
            let loadingText = 'Por favor espera';
            if (op == 'print')
                loadingText = 'Por favor espera'
            else if (op == 'download')
                loadingText = 'Descargando'
            else if (op == 'mail')
                loadingText = 'Enviando correo'

            this.setState({
                print: false,
                loading: true,
                loadingText
            });

            const response = await axios(config);
            const file = response.data;
            console.log('response', response)

            if (file) {
                const url = window.URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
                if (op == 'print') {
                    console.log('printing', url)
                    this.download.href = url;
                    //this.PrintModal.handleShow();
                    this.setState({
                        print: true,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                loading: false,
                            });
                            window && window.frames[`printIframe${this.props.index}`].focus();
                            window && window.frames[`printIframe${this.props.index}`].print();
                        }, 250);
                    });
                } else if (op == 'download') {
                    this.download.href = url;
                    this.download.download = (args && args.fileName) || 'liverpoolmx_dl.pdf';
                    this.download.click();
                    this.download.href = '';
                    this.download.download = '';
                }
                // this.props.callback && this.props.callback();
            }
            args && args.after && await args.after();

            op !== 'print' && this.setState({
                loading: false,
            });

        } catch (error) {
            return { error };
        }
    }

    // closePrintModal = (e) => {
    //     this.download.href = '';
    // }

    render() {
        const { uiname, fileName, before, after, brand, divLabel } = this.props;
        const downloadargs = {
            fileName,
            before,
            after,
            brand
        }
        const printargs = {
            fileName,
            before,
            after,
            brand
        }
        return (
            <React.Fragment>
                <a ref={download => (this.download = download)} />
                {divLabel ? divLabel : <ul className="linkPlatform">
                    <li>
                        <Link
                            uiname={uiname && uiname.download}
                            onClick={() => this.do('download', downloadargs)}
                            disabled={this.state.loading}
                            href="javascript:void(0)"><i className={this.props.useDefault ? "icon-descarga" : "iClass icon-descarga icono-grande-inline mr-15"} /></Link>
                    </li>
                    <li>
                        <Link
                            uiname={uiname && uiname.print}
                            onClick={() => this.do('print', printargs)}
                            disabled={this.state.loading}
                            href="javascript:void(0)"><i className="iClass icon-imprimir icono-grande-inline" /></Link>
                    </li>
                </ul>}
                <div className="row pdm">
                    <div className="col-xs-12 text-right">&nbsp;{this.state.loading &&
                        <React.Fragment>
                            <span className="loading">
                                {this.state.loadingText} <img src={appconfig.loadingImage} height="50" />
                            </span>
                        </React.Fragment>}
                    </div>
                </div>
                {/* <PrintModal onRef={ref => (this.PrintModal = ref)} fileName={fileName.print} url={this.download.href} /> */}
                {this.state.print && <iframe src={this.download.href} height="0" width="0" type="application/pdf" name={`printIframe${this.props.index}`} id={`printIframe${this.props.index}`} />}
            </React.Fragment>
        );
    }

}
export default DownloadPrint;