import React, { Component } from 'react';
import Link from '../../../lib/ZUILib/Link';
import commonUtil from '../../../utils/commonUtil';
import DownloadPrint from '../DownloadPrint';

class PrintDownload extends Component {

    state = {
        disableDownload: false,
        print: false
    }
    constructor(props) {
        super(props);
        this.download = {}
        this.pdfonserver = global && global.pdfonserver;
    }

    createIframe = () => {
        commonUtil.downloadPdf(this.props.elem, this.props.fileName, this.props.usePageHeader, this.props.footer || '', (url) => {
            this.download.href = url;
            this.setState({
                print: true,
            }, () => {
                setTimeout(() => {
                    window && window.frames[`printIframe${this.props.index}`].focus();
                    window && window.frames[`printIframe${this.props.index}`].print();
                }, 250);
            });
        }, true)
    }

    downloadToPDF = async (param) => {
        this.props.callBefore && await this.props.callBefore()
        setTimeout(() => {
            if (param && param === 'download') {
                this.setState({ disableDownload: true })
                commonUtil.downloadPdf(this.props.elem, this.props.fileName, this.props.usePageHeader, this.props.footer || '', () => {
                    this.setState({ disableDownload: false })
                })
            }
            else if (param && param === 'print') {
                let url;
                this.props.useIframe ? this.createIframe() : this.props.printFunc ? this.props.printFunc() : window.print()
            }
        }, 500);
        this.props.callback && this.props.callback()
    }

    render() {
        return (
            <React.Fragment>
                {this.pdfonserver
                    ? <DownloadPrint {...this.props} before={this.props.callBefore} after={this.props.callback} footer={this.props.footer} />
                    : <ul className="linkPlatform" uiname={this.props.uiname}>
                        <li>
                            <Link
                                className="download"
                                disabled={this.state.disableDownload}
                                onClick={() => this.downloadToPDF('download')}
                                uiname={this.props.uiname}
                                download>
                                <i className={this.props.useDefault ? "icon-descarga" : "iClass icon-descarga icono-grande-inline mr-15"} />
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="print"
                                disabled={this.state.disableDownload}
                                uiname={this.props.uiname}
                                onClick={() => this.downloadToPDF('print')}>
                                <i className="iClass icon-imprimir icono-grande-inline" />
                            </Link>
                        </li>
                    </ul>}
                {this.state.print && <iframe src={this.download.href} height="0" width="0" type="application/pdf" name={`printIframe${this.props.index}`} id={`printIframe${this.props.index}`} />}
            </React.Fragment>
        );
    }

}
export default PrintDownload;