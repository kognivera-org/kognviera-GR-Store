
import React, { Component } from 'react'
import NewReport from './NewReport'
import { getReportPageData } from '../actions'
import { connect } from 'react-redux'
import commonUtil from '../../../utils/commonUtil'

@connect(
  store => ({
    reportPageData: store.reports.reportPageData,
    isBuildReportPageDataLoaded: store.reports.isBuildReportPageDataLoaded
  }),
  { getReportPageData },
)
class ReportSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedReportType: 0
    }
  }

  componentDidMount() {
    this.props.getReportPageData()
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="main">
            <div className="row">
              <div className="col-xs-12 alignLeft">
                <p className="titleSection">REPORTES</p>
              </div>
              <div className="col-xs-12">
                <hr />
              </div>
              <div className="row row-block">
                <div className="col-xs-8 alignLeft">
                  <p className="articleName">Genera un nuevo reporte o selecciona uno de los guardado en tus favoritos</p>
                </div>
                <div className="col-xs-4 alignRight">
                  <p className="requiredFields">* Campos obligatorios</p>
                </div>
              </div>
              <div className="col-xs-12">
                <div className="radio">
                  <input
                    id="nr-1" type="radio" name="optionsRadios"
                    defaultValue={1}
                    checked={this.state.checkedReportType === 1}
                    onChange={() => {
                      this.setState({ checkedReportType: 1 });
                    }} />
                  <label htmlFor="nr-1">Nuevo reporte</label>
                </div>
                <div className="radio">
                  <input id="fa-1" type="radio" name="optionsRadios" defaultValue={2}
                    checked={this.state.checkedReportType === 2}
                    onChange={() => {
                      this.setState({ checkedReportType: 2 });
                    }} />
                  <label htmlFor="fa-1">Favoritos</label>
                </div>
              </div>
              <div className="col-xs-12">
                <hr />
              </div>
              {this.state.checkedReportType && this.props.isBuildReportPageDataLoaded ? <NewReport viewType={this.state.checkedReportType === 1 ? 'NEW' : 'FAV'} pageData={this.props.reportPageData}></NewReport> : ""}
              {/* {this.state.checkedReportType && Object.keys(this.props.reportPageData).length > 0 ? <NewReport viewType={this.state.checkedReportType === 1 ? 'NEW' : 'FAV'} pageData={this.props.reportPageData}></NewReport> : ""} */}
            </div>
          </div>
          <div className="modalContent">
            <div className="modal fade modal-custom" id="saveAsFavorite" role="dialog">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <button className="close closeBtnOnly" type="button" data-dismiss="modal">×</button>
                  <div className="modal-body">
                    <p className="titleModule">GUARDAR COMO FAVORITO</p>
                    <div className="col-xs-12">
                      <div className="alertError"><i className="icon-tache2" />
                        <p className="fs-12">Nombre de reporte existente. Ingresa un nombre distinto.</p><a className="icon-tache2" />
                      </div>
                    </div>
                    <div className="col-xs-12 pt-20">
                      <div className="formBlock">
                        <div className="materialStyle">
                          <input className="inputMaterial" type="text" required="required" />
                          <label className="placeHolderMaterial"><span>*</span>Ingresa un nombre</label>
                        </div>
                      </div>
                    </div>
                    <div className="row row-block">
                      <div className="col-xs-6">
                        <button className="btnSecondaryAction size-Full">Cancelar</button>
                      </div>
                      <div className="col-xs-6">
                        <button className="btnPrimaryAction size-Full">Guardar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade modal-custom" id="deleteReport" role="dialog">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <button className="close closeBtnOnly" type="button" data-dismiss="modal">×</button>
                  <div className="modal-body">
                    <p className="mainText">Estás por eliminar este reporte, la acción no podrá deshacerse. ¿Deseas continuar?</p>
                    <div className="row row-block">
                      <div className="col-xs-6">
                        <button className="btnSecondaryAction size-Full">Cancelar</button>
                      </div>
                      <div className="col-xs-6">
                        <button className="btnPrimaryAction size-Full">Eliminar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default ReportSummary
