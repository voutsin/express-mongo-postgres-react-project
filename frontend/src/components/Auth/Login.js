import React, { useEffect, useState } from "react";
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Button, Form } from "../../structure/Form/Form.js";
import { removeEmptyFields } from "../../common/utils";
import { login, logout } from "../../redux/actions/actions";
import CirclesStyled from "../../styles/circles";
import { ClassNames } from "../../styles/classes";
import Modal from "../../structure/Modal";
import Register from "./Register";
import TextInput from "../../structure/Form/TextInput";

const Login = props => {
    const [formData, setFormData] = useState(null);
    const [logginOut, setLoggingOut] = useState(true);
    const [openModal, setOpenModal] = useState(false);
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

    const handleRegister = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    const registerModal = (
        <Modal
            handleClose={handleModalClose}
            flag={openModal}
        >
            <Register/>
        </Modal>
    )

    return (
        <React.Fragment>
            <div className={ClassNames.LOGIN_PAGE}>
                <CirclesStyled login={true}/>
                <div className={ClassNames.LOGIN_WRAPPER}>
                    <h4 className={ClassNames.LOGIN_TYPING}>
                        Welcome to Nex<span>Gen</span>
                    </h4>
                    <div className={ClassNames.LOGIN_FORM}>
                        <h4>Login or Register</h4>
                        <Form data={formData} onChange={handleChange}>
                            <TextInput
                                type="text" 
                                name="username"
                                label='Username'
                                required={true}
                            />
                            <TextInput
                                type="password" 
                                name="password"
                                label='Password'
                                required={true}
                            />
                        </Form>
                        <div className={ClassNames.LOGIN_BTNS}>
                            <Button onClick={handleSubmit} extraClass={ClassNames.LOGIN_BTN} disabled={checkSubmit()}>
                                Login
                            </Button>
                            <span>OR</span>
                            <Button onClick={handleRegister} className={ClassNames.LOGIN_REGISTER_BTN}>
                                Create New Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {openModal && registerModal}
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