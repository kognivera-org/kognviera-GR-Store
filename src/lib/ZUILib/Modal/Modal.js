import React, { Component } from 'react';

const modalStyle= {
    borderRadius: '4px',
    width: '478px',
}

const headerStyle = {
    backgroundColor: '#F5F5F5',
    height: '60px',
    borderRadius: '4px 4px 0 0',
    boxShadow:'0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
}

export const Modal = ({ ...props }) => {

    return <React.Fragment>
        <div className={props.className + ' in'} id={props.id} style={{ display: props.show ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
            <div className={"modal-dialog " + props.content} role="document">
                <div className="modal-content" style={props.type === 'note' ? modalStyle : null}>
                    {props.children}
                </div>
            </div>
        </div>
        {props.show &&
            <div className="modal-backdrop fade in"></div>
        }
    </React.Fragment>
}

export const ModalHeader = ({ ...props }) => {
    return <div className="modal-header" style={props.type === 'note' ? headerStyle : null}>
        <button type="button" className="close" onClick={props.handleClose}>
            <span aria-hidden="true">&times;</span>
        </button>
        {props.children}
    </div>
}

export const ModalTitle = ({ ...props }) => {
    return <h4 className="modal-title">{props.children}</h4>
}

export const ModalBody = ({ ...props }) => {
    return <div className="modal-body">
        {props.children}
    </div>
}
