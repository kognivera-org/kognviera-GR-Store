/* eslint global-require: "off" */
/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { updatePassword } from '../LoginPage/actions'
import UpdatePasswordForm from './updatePasswordForm'
import CommonUtil from '../../../utils/commonUtil';
import routeconfig from '../../../config/routeconfig';

const defaultUpdatePasswordError = { error: false, message: '' }

@connect(
    store => ({
        user: store.user,
        passwordUpdated: store.user.passwordUpdated,
        updatePasswordError: store.user.updatePasswordError
    }),
    { updatePassword },
)

export default class UpdatePassword extends Component {

    static propTypes = {
        user: PropTypes.object,
        updatePasswordError: PropTypes.object,
    }

    state = {
        updatePasswordError: defaultUpdatePasswordError,
    }

    handleUpdatePasswordx = (event) => {
        event.preventDefault()
        var values = Object.assign({
            currentPassword: event.target.currentPassword.value,
            newPassword: event.target.newPassword.value,
            confirmPassword: event.target.confirmPassword.value,
            storeAssociateId: event.target.storeAssociateId.value,
            userName: event.target.userName.value,
            requestType: event.target.requestType.value,
        })

        const seo = {} // submission error object
        let errorFound = false
        if (values.currentPassword.trim() === '') {
            seo.currentPassword = 'Current Password is required'
            errorFound = true
        }
        if (values.newPassword === '') {
            seo.newPassword = 'New Password is required'
            errorFound = true
        }
        if (values.confirmPassword === '') {
            seo.confirmPassword = 'Confirm Password is required'
            errorFound = true
        }
        if (values.newPassword != values.confirmPassword) {
            seo.confirmPassword = 'New Password and Confirm Password does not match'
            errorFound = true
            this.setState({ updatePasswordError: { message: 'New Password and Confirm Password does not match' } });
            return false;
        }

        // if (errorFound) {
        //     throw new SubmissionError({
        //         ...seo,
        //         _error: 'Update Password failed!',
        //     })
        // }

        // 로그인 요청
        this.props.updatePassword(values)
        return true
    }

    componentDidMount() {
        {/*if (!this.props.user) { // logged in
      this.props.router.push('/maindashboard')
      return
    }*/}
    }

    componentWillReceiveProps(props) {
        if (!this.props.passwordUpdated && props.passwordUpdated) { // logged in
            if (this.props.user.data.userName) {
                window.localStorage.setItem("user", JSON.stringify(this.props.user.data));
                if (this.props.location.query.to) {
                    this.props.router.push(this.props.location.query.to)
                } else {
                    this.props.router.push(CommonUtil.generateRedirect(routeconfig.maindashboard));
                }
            } else {
                window.localStorage.removeItem("tempUser")
                let loginUrl = CommonUtil.generateRedirect(routeconfig.login)
                loginUrl = this.props.location.query.to ? `${loginUrl}?to=${this.props.location.query.to}` : loginUrl
                this.props.router.push(loginUrl);
                // this.props.router.push(CommonUtil.generateRedirect(routeconfig.login));
            }
            return
        }
        if (!this.props.updatePasswordError && props.updatePasswordError) {
            this.setState({
                updatePasswordError: props.updatePasswordError
            })
        } else {
            this.setState({
                updatePasswordError: this.props.updatePasswordError
            })
        }
    }
    // this.setState({
    //     updatePasswordError: (!this.props.updatePasswordError && props.updatePasswordError ?
    //         props.updatePasswordError : this.props.updatePasswordError),
    // })


    render() {
        //const styles = require('./Login.scss')
        const { user, updatingPassword, passwordUpdated } = this.props
        const { updatePasswordError } = this.state
        return (

            <div className="container loginContent">

                {(!passwordUpdated || passwordUpdated == false) ?
                    <UpdatePasswordForm
                        updatePassword={this.props.updatePassword}
                        passwordUpdated={passwordUpdated}
                        updatePasswordError={updatePasswordError}
                        updatingPassword={updatingPassword}
                    /> : ''
                }
            </div>
        )
    }
}
/* eslint-enable */
