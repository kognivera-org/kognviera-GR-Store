/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from '../../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../../utils/commonUtil';
import Link from '../../../../../lib/ZUILib/Link';

class Notes extends Component {
  state = {
    showNewNote: false,
    isReadingMode: false,
    newNote: '',
    date: '',
    hours: '',
    role: '',
    storeId: '',
    storeName: '',
    author: '',
  }

  handleClose = () => {
    this.setState({
      showNewNote: false,
      newNote: '',
      isReadingMode: false,
    });
  }

  handleShow = (note) => {
    this.setState({
      ...this.state,
      showNewNote: true,
      newNote: note ? note.note : '',
      date: note ? note.creationDate : '',
      hours: note ? note.creationDate : '',
      role: note ? note.userRole : '',
      storeId: note ? note.storeId : '',
      storeName: note ? note.storeName : '',
      author: note ? note.email : '',
      isReadingMode: note && !!note.note,
    });
  }

  addNewNote = (event) => {
    event.preventDefault();
    const queryString = {};
    queryString.eventId = this.props.eventId;
    queryString.note = this.state.newNote;
    this.props.createNote(queryString);
    this.handleClose();
  }

  deleteNote = (note) => {
    const queryString = {};
    queryString.eventId = this.props.eventId;
    queryString.selectedNoteId = note.noteId;
    this.props.deleteNote(queryString);
  }

  setNewNote = (event) => {
    if (event.target.value.length <= 250) {
      this.setState({
        ...this.state,
        newNote: event.target.value,
      });
    }
  }

  renderContent = (notesData) => {
    const notes = notesData.notes;
    const currentStoreUser = commonUtil.getCurrentStoreUser();
    const headerLbl = {
      fontSize: '16px',
      fontFamily: 'robotoRegular',
      padding: '16px 0',
      margin: '-8px 0',
    };

    const infoContainer = {
      width: '100%',
      padding: '3% 0',
    };

    const infoColumn = {
      padding: 0,
    };

    const infoLbl = {
      fontFamily: 'robotoRegular',
      fontSize: '14px',
      color: '#666666',
      float: 'none',
    };

    const infoTxt = {
      color: '#333333',
      display: 'inline',
      paddingLeft: '2%',
    };

    const infoTextArea = {
      fontFamily: 'robotoRegular',
      fontSize: '14px',
      fontWeight: 400,
      borderRadius: '8px',
      resize: 'none',
      height: '200px',
      marginBottom: '5px',
    };

    const buttonContainer = {
      textAlign: 'center',
      paddingBottom: '3%',
    };

    const saveBtn = {
      backgroundColor: '#E10098',
      borderRadius: '4px',
      width: '55%',
    };

    const linkBtnStyle = {
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      padding: '0',
      textDecoration: 'underline',
    };

    const transformDate = (isReadingMode = false, value, type) => {
      const date = value ? new Date(value) : new Date();
      const arrayDate = date.toLocaleString('es-MX', { hour12: true }).split(',');
      if (isReadingMode) {
        if (!value) return 'No disponible';
        return type === 'date' ? arrayDate[0] : arrayDate[1];
      }
      return type === 'date' ? arrayDate[0] : arrayDate[1];
    };

    return (
      <React.Fragment>
        {
          notes && notes.length && notes.map(item => (
            <div className="row notes-note" id="note1">
              <li className="col-xs-11">
                <button
                  className="noteOverflow"
                  style={linkBtnStyle}
                  onClick={() => this.handleShow(item)}
                >
                  {item.note}
                </button>
              </li>
              {
                item.isNoteEligibleToDelete ?
                  <div className="col-xs-1" >
                    <div className="notes-note-btnClose-temp">
                      <Link
                        disabled={!item.isNoteEligibleToDelete}
                        className="deletenote iClass icon-cerrar"
                        onClick={() => this.deleteNote(item)}
                      />
                    </div>
                  </div>
                : null
              }
            </div>
          ))
        }
        <Modal
          show={this.state.showNewNote}
          id="newNoteModal"
          className="modal fade modal-custom"
          type="note"
        >
          <ModalHeader type="note" handleClose={this.handleClose}>
            <h3 style={headerLbl}>Nota del evento</h3>
          </ModalHeader>
          <ModalBody>
            <form id={'newNote'} onSubmit={this.addNewNote}>
              <div className="container" style={infoContainer}>
                <div className="row">
                  <div className="col-xs-6" style={infoColumn}>
                    <p style={infoLbl}>
                      Fecha:
                      <span style={infoTxt}>
                        {transformDate(this.state.isReadingMode, this.state.date, 'date')}
                      </span>
                    </p>
                  </div>
                  <div className="col-xs-6" style={infoColumn}>
                    <p style={infoLbl}>
                        Hora:
                        <span style={infoTxt}>
                          {transformDate(this.state.isReadingMode, this.state.hours, 'hour')}
                        </span>
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6" style={infoColumn}>
                    <p style={infoLbl}>
                        Rol:
                        <span style={infoTxt}>
                          {
                            this.state.isReadingMode ?
                            this.state.role : currentStoreUser.userRoleInfo.roleName
                          }
                        </span>
                    </p>
                  </div>
                  {
                    this.state.isReadingMode ?
                      <div className="col-xs-12" style={infoColumn}>
                        <p style={infoLbl}>
                        Tienda:
                        {
                          this.state.isReadingMode && this.state.storeId && this.state.storeName
                          ?
                            <span style={infoTxt}>
                              {
                                this.state.isReadingMode &&
                                  `${this.state.storeId} ${this.state.storeName}`
                              }
                            </span>
                          : null
                        }
                        </p>
                      </div>
                    : null
                  }
                </div>
                <div className="row">
                  <div className="col-xs-12" style={infoColumn}>
                    <p style={infoLbl}>
                      Autor:
                      <span style={infoTxt}>
                        {this.state.isReadingMode ? this.state.author : currentStoreUser.emailId}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <textarea
                rows="4"
                style={infoTextArea}
                disabled={this.state.isReadingMode}
                value={this.state.newNote}
                onChange={this.setNewNote}
              />
              {
              !this.state.isReadingMode &&
                <React.Fragment>
                  <div className="row">
                    <div className="col-xs-12">
                      <p className="characterLimit">{this.state.newNote.length}/250</p>
                    </div>
                    <div className="col-xs-12" style={buttonContainer}>
                      <button className="btnPrimaryAction size-Full" style={saveBtn}>
                        Guardar
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              }
            </form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }

  render() {
    const { notes } = this.props;
    return (
      <div className="col-xs-12 marginTop15">
        <div className="boxStyle">
          <h3>NOTAS:</h3>
          <div className="notes-header">
            <p>Estas notas sirven para ...</p>
            <div className="notes-header-addNote" data-toggle="modal" data-target="#newNoteModal">
              <span>
                <Link
                  uiname="EventDashboardAddNotes"
                  onClick={() => this.handleShow()}
                >
                  Agregar notas
                </Link>
              </span>
            </div>
          </div>
          {
            this.props.getNotesLoading ? <h3>Loading</h3> :
            <div className={notes.notes ? 'hideExtraNotes' : null}>
              {this.renderContent(notes)}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Notes;
