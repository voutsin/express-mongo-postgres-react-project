import React, { useEffect, useState } from "react";
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "../../structure/Form";
import { removeEmptyFields } from "../../common/utils";
import { login, logout } from "../../redux/actions/actions";

const Login = props => {
    const [formData, setFormData] = useState(null);
    const [logginOut, setLoggingOut] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch the logout action when the component mounts
        try {
            dispatch(logout());
        } finally {
            setLoggingOut(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (props.auth && props.auth.authSuccess && !logginOut) {
            navigate('/');
        }
    }, [props, navigate, logginOut]);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = () => {
        const finalBody = removeEmptyFields(formData);
        props.login(finalBody);
    }

    const checkSubmit = () => {
        const finalBody = removeEmptyFields(formData);
        const dataOk = formData && finalBody.username && finalBody.password;
        return !dataOk;
    }

    return (
        <React.Fragment>
            <div>
                <h4>Login to our Social Media platform</h4>
                <div>
                    <p>Login Form</p>
                    <Form data={formData} onChange={handleChange} className={'login-form'}>
                        <Input
                            type="text" 
                            name="username"
                            label='Username'
                            required={true}
                        />
                        <Input
                            type="text" 
                            name="password"
                            label='Password'
                            required={true}
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
    auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    login: credentials => dispatch(login(credentials)),
    logout: () => dispatch(logout()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);