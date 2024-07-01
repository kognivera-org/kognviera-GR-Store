import React, { Component } from 'react';
import { connect } from 'react-redux';
import ManagementMenu from '../Navigation/ManagementMenu';
import Link from '../../../lib/ZUILib/Link';
import Button from '../../../lib/ZUILib/Button';
import Form from '../../../lib/ZUILib/Form';
import CommonUtil from '../../../utils/commonUtil';
import ViewDocumentModal from './components/ViewDocumentModal';
import {
  uploadVerificationDocument,
  getVerificationDocuments,
  removeVerificationDocument,
  downloadVerificationDocument
} from './actions';

@connect(
  store => ({
    verificationDocument: store.verificationDocument.filenames,
    downloadedDocument: store.verificationDocument.downloadedFile,
    verificationDocumentLoading: store.verificationDocument.loading,
    error: store.verificationDocument.error,
  }), {
    getVerificationDocuments,
    uploadVerificationDocument,
    removeVerificationDocument,
    downloadVerificationDocument
  })

class VerificationDocuments extends Component {

  constructor(props) {
    super(props);
    this.removeDocumentForms = [];
    this.downloadFileName = '';
    this.viewOperation = '';
    this.download = {}
  }

  state = {
    Err: ''
  }

  UNSAFE_componentWillMount() {
    const eventId = this.props.params && this.props.params.eventId;
    eventId && this.props.getVerificationDocuments(eventId);
  }

  uploadDocument = (e) => {
    e.preventDefault();
    let file = e.target.document.files[0];
    if (file) {
      const fileName = file.name
      var idxDot = fileName.lastIndexOf(".") + 1;
      var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        this.setState({
          Err: ''
        })
        const data = {
          file: file,
          documentName: file.name,
          eventId: e.target.eventId.value
        }
        const upload = this.props.uploadVerificationDocument(
          data,
          progressEvent => this.setState({ uploadFileName: file.name, uploadProgress: (progressEvent.loaded / progressEvent.total) * 100 })
        );
      } else {
        this.setState({
          Err: 'Este formato de archivo no es compatible.'
        })
      }
    }
  }

  removeDocument = (e) => {
    e.preventDefault();
    this.props.removeVerificationDocument(e.target);
  }

  downloadDocument = (e, viewOp) => {
    e.preventDefault();
    this.viewOperation = viewOp;
    if (viewOp === 'view') {
      this.ViewDocumentModal.handleShow();
    }
    this.downloadFileName = e.target.title;
    this.props.downloadVerificationDocument({
      documentName: e.target.title,
      eventId: e.target.getAttribute("eventid")
    });
  }

  componentWillReceiveProps(nextProps) {
    const downloadedDocument = nextProps.downloadedDocument;
    if (typeof window != 'undefined' && downloadedDocument && this.downloadFileName !== '') {
      const url = window.URL.createObjectURL(new Blob([downloadedDocument]));
      this.download.href = url;
      this.download.download = this.downloadFileName;
      const op = this.viewOperation;
      if (op === 'view') {
        this.viewOperation = '';
        this.setState({
          imageToView: new Blob([downloadedDocument])
        });
      } else if (op === 'print') {
        this.viewOperation = '';
        var popup = window.open();
        popup && popup.document.write(`<img src="${url}" onLoad="window.opener=null; window.print()"/>`);
      } else if (op === 'download') {
        this.viewOperation = '';
        this.download.click();
        this.download.href = '';
        this.downloadFileName = '';
      }
    }
  }

  componentDidUpdate = () => {
    CommonUtil.errorScrollUp();
  }

  render() {
    const { verificationDocument, error } = this.props;
    const { uploadProgress, uploadFileName, Err } = this.state;
    return (
      <React.Fragment>
        <a ref={download => (this.download = download)} />
        <div className="container main-container">
          <div className="row">
            <div className="col-xs-2">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10">
              <div className="dynamicFrame toPrint">
                <div className="row">
                  <div className="col-xs-10 mainTitle">
                    <h1>Documentos de verificacion</h1>

                    {error && error.errorMessage ?
                      <div className="alertError errorLoginForm">
                        <i className="icon-tache2"></i>
                        <p>{error.errorMessage.message
                          ? error.errorMessage.message
                          : error.errorMessage}</p>
                      </div> : Err && <div className="alertError errorLoginForm">
                        <i className="icon-tache2"></i>
                        <p>{Err}</p>
                      </div>}

                    <p>Subir documentos</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <div className="wrapperFiles">
                      <Form
                        uiname="EventVerificationUploadDocument"
                        name="uploadDocument"
                        id="uploadDocument"
                        onRef={(form) => { this.uploadDocumentForm = form; }}
                        onSubmit={this.uploadDocument} >

                        <label
                          className="lblFileUp btnPrimary size-ExtraLarge"
                          htmlFor="fileUp"
                          id="upFile">Seleccionar archivo</label>

                        <input name="eventId" value={this.props.params.eventId} type="hidden" />

                        <input
                          style={{ display: 'none' }}
                          className="inFile" id="fileUp"
                          name="fileUp"
                          type="file"
                          name="document"
                          onClick={(e) => { e.target.value = ''; }}
                          onChange={() => this.uploadDocumentForm.dispatchEvent(new Event('submit'))}
                          accept="image/x-png,image/jpeg" />
                      </Form>

                      {
                        !verificationDocument ?
                          <p id="messageList">No se ha seleccionado ningun archivo</p> :
                          verificationDocument.length > 0
                          && verificationDocument.map((document, index) => {
                            return <div className="row vFileList" key={index}>
                              <div className="col-xs-9 vFile">
                                <Link className="uic"
                                  uiname="EventVerificationViewDocument"
                                  href="javascript:void(0)"
                                  onClick={(e) => this.downloadDocument(e, 'view')}
                                  eventid={this.props.params.eventId}
                                  title={document.documentName}>{document.documentName}</Link>

                                <div className="col-xs-1 vFileOp" >
                                  <form name="removeDocumentForm" method="post" onSubmit={this.removeDocument} noValidate ref={(form) => { this.removeDocumentForms[index] = form; }}>
                                    <input name="removeDocumentName" value={document.documentName} type="hidden" />
                                    <input name="removeDocumentId" value={document.documentId} type="hidden" />
                                    <input name="eventId" value={this.props.params.eventId} type="hidden" />
                                    <Link uiname="EventVerificationDeleteDocument" className="uic file iClass icon-cerrar" onClick={() => this.removeDocumentForms[index].dispatchEvent(new Event('submit'))} />
                                  </form>
                                </div>
                              </div>
                              <div className="col-xs-1 vFileOp">
                                <Link
                                  uiname="EventVerificationPrintDocument"
                                  className="iClass icon-imprimir icono-grande-inline"
                                  onClick={(e) => this.downloadDocument(e, 'print')}
                                  eventid={this.props.params.eventId}
                                  title={document.documentName} />
                              </div>
                              <div className="col-xs-1 vFileOp">
                                <Link className="iClass icon-descarga icono-grande-inline mr-15"
                                  uiname="EventVerificationDownloadDocument"
                                  href="javascript:void(0)"
                                  onClick={(e) => this.downloadDocument(e, 'download')}
                                  eventid={this.props.params.eventId}
                                  title={document.documentName} />
                              </div>
                            </div>

                          })
                      }
                      <div className="uploadWrapper">
                        {
                          uploadProgress && uploadProgress > 0 && uploadProgress < 100 &&
                          <React.Fragment>
                            {uploadFileName} <progress className="progress" value={uploadProgress} max={100} id="progress" />
                            <label htmlFor="progress" id="percent">&nbsp;{Math.round(uploadProgress) + '%'}</label>
                          </React.Fragment>
                        }
                      </div>

                      <ViewDocumentModal onRef={ref => (this.ViewDocumentModal = ref)} imageToView={this.download.href} imageToViewName={this.download.download} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment >
    );
  }
}
export default VerificationDocuments;