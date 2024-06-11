import React, { Component } from 'react';

class RetryTransaction extends Component {

    render() {

        return(
            <div className="modalContent">
                <div className="modal fade modal-custom" id="suspendModal" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-body">
                        <button className="close" type="button" data-dismiss="modal">×</button>
                        <div className="col-xs-12">
                        <p>¿Quien solicita el ingreso a este evento?</p>
                        <div className="radio">
                            <input id="radio1-sm" type="radio" name="optionsRadios" />
                            <label htmlFor="radio1-sm">Tiempo indefinido</label>
                        </div>
                        <div className="radio">
                            <input id="radio2-sm" type="radio" name="optionsRadios" />
                            <label htmlFor="radio2-sm" data-option="period">Suspención programada por pediodo</label>
                        </div>
                        <div className="calendarContent">
                            <div className="form-group">
                            <div className="row">
                                <div className="col-xs-12">
                                <div id="calendarPeriod" />
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xs-6">
                            <button className="btnSecondaryAction size-Full">Cancelar</button>
                        </div>
                        <div className="col-xs-6">
                            <button className="btnPrimaryAction size-Full">Aceptar</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="modal fade modal-custom" id="deletedModal" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-body">
                        <button className="close" type="button" data-dismiss="modal">×</button>
                        <div className="col-xs-12">
                        <p>¿Estas seguro de eliminar este evento?</p>
                        </div>
                        <div className="row">
                        <div className="col-xs-6">
                            <button className="btnSecondaryAction size-Full">Cancelar</button>
                        </div>
                        <div className="col-xs-6">
                            <button className="btnPrimaryAction size-Full">Aceptar</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="modal fade modal-custom" id="statusModal" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-body">
                        <button className="close" type="button" data-dismiss="modal">×</button>
                        <div className="col-xs-12">
                        <p>¿Estas seguro de cambiar el estatus del evento?</p>
                        </div>
                        <div className="row">
                        <div className="col-xs-6">
                            <button className="btnSecondaryAction size-Full">Cancelar</button>
                        </div>
                        <div className="col-xs-6">
                            <button className="btnPrimaryAction size-Full">Aceptar</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            
        )

    }
}
export default RetryTransaction;