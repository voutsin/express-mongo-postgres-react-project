import React, { useEffect, useState } from "react";
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { clearData, logout, notify, registerUser } from "../../redux/actions/actions";
import { Button, Form, Input } from "../../structure/Form";
import { checkRequiredFields, removeEmptyFields } from '../../common/utils.js'
import { selectApiState } from "../../redux/reducers/apiReducer.js";
import { AUTH_ROUTES } from "../../config/apiRoutes.js";
import { NotifyTypes } from "../../common/enums.js";
import ROUTES from '../../config/routes.js'

const intitialData = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    description: '',
}

const Register = props => {
    const [formData, setFormData] = useState(intitialData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch the logout action when the component mounts
        dispatch(logout());
    }, [dispatch]);

    useEffect(() => {
        if (props.registerUserResponse && props.registerUserResponse.success) {
            props.clearData();
            setFormData(intitialData);
            navigate(ROUTES.BASE.path);
        }
    }, [props, navigate])

    const handleSubmit = () => {
        const finalBody = removeEmptyFields(formData);
        const passwordsOk = finalBody && finalBody.password === finalBody.confirmPassword;
        if (!passwordsOk) {
            props.notify('Passwords does not match!', NotifyTypes.ERROR);
        } else {
            props.clearData();
            props.registerUser(finalBody);
        }
    }

    const checkSubmit = () => {
        const finalBody = removeEmptyFields(formData);
        const requiredFields = [
            'username',
            'password',
            'confirmPassword',
            'email',
            'name',
        ];
        const dataOk = formData && checkRequiredFields(finalBody, requiredFields);
        
        return !(dataOk);
    }

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    return (
        <React.Fragment>
            <div>
                <h4>Register New User</h4>
                <div className={'login-wrapper'}>
                    <Form data={formData} onChange={handleChange} className={'login-form'}>
                        <Input
                            type="text" 
                            name="username"
                            label='Username'
                            required={true}
                        />
                        <Input
                            type="email" 
                            name="email"
                            label='Email'
                            required={true}
                        />
                        <Input
                            type="password" 
                            name="password"
                            label='Password'
                            required={true}
                        />
                        <Input
                            type="password" 
                            name="confirmPassword"
                            label='Confirm Password'
                            required={true}
                        />
                        <Input
                            type="text" 
                            name="name"
                            label='Displayed Name'
                            required={true}
                        />
                        <Input
                            type="text" 
                            name="description"
                            label='Description'
                        />
                        <Input
                            type="file" 
                            name="profilePictureUrl"
                            label='Profile Picture'
                        />
                    </Form>
                    <Button onClick={handleSubmit} className={'login-btn'} disabled={checkSubmit()}>
                        Login
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    registerUserResponse: selectApiState(state, AUTH_ROUTES.REGISTER_USER.name),
});

const mapDispatchToProps = (dispatch) => ({
    registerUser: data => dispatch(registerUser(data)),
    clearData: () => dispatch(clearData()),
    notify: (message, type) => dispatch(notify(message, type))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);