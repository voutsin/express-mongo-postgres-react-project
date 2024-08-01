import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { formatDate, urlToFile } from "../../common/utils";
import { Button, Form } from "../../structure/Form/Form";
import { ClassNames } from "../../styles/classes";
import { MdAddPhotoAlternate, MdClose, MdUpload } from "react-icons/md";
import Loader from "../../structure/Loader";
import TextInput from "../../structure/Form/TextInput";
import DateInput from "../../structure/Form/DateInput";
import { updateUser } from "../../redux/actions/actions";

const EditUser = props => {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({});
    const [fileInputFlag, openFileInput] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputsAdded, setInputsAdded] = useState(false);
    const [changePass, setChangePassword] = useState(false);

    const { editUser, auth } = props;

    useEffect(() => {
        const setFileFromUrl = async profilePictureUrl => {
            const mediaFile = await urlToFile(profilePictureUrl);
            if (mediaFile) {
                // Create a DataTransfer object and add the file to it
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(mediaFile);
                // Assign the DataTransfer object to the input's files property
                if (fileInputRef.current) {
                    fileInputRef.current.files = dataTransfer.files;
                    // Manually trigger the change event
                    fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                }
                setFile(mediaFile);
            }
        }

        if (auth && !inputsAdded) {
            setFormData({
                ...auth,
                birthDate: formatDate(auth.birthDate),
            });
            if (auth.profilePictureUrl) {
                setFileFromUrl(auth.profilePictureUrl);
                openFileInput(true);
            }

            setInputsAdded(true);
        }
    }, [auth, inputsAdded, fileInputRef]);

    useEffect(() => {
        if (previewUrl && file) {
            setLoading(false);
        }
    }, [previewUrl, file])

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = event => handleFile(event.target.files[0]);

    const handleFile = (selectedFile) => {
        setLoading(true);
        setPreviewUrl(null);
        setFile(null);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
            setFile(selectedFile);
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy'; // Show a copy icon when dragging files
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const selectedFile = event.dataTransfer.files[0];
        handleFile(selectedFile);
    };

    const handleCloseDragDrop = () => {
        setPreviewUrl(null);
        setFile(null);
        openFileInput(false);
    }

    const handleSubmit = () => {
        const finalBody = {
            username: formData.username,
            email: formData.email,
            name: formData.name,
            description: formData.description,
            birthDate: formData.birthDate,
            changePasswordFlag: changePass
        }

        if (changePass) {
            finalBody.password = formData.password;
            finalBody.confirmPassword = formData.confirmPassword;
        }

        editUser({finalBody, file});
    }

    const toggleChagnePassword = (e) => {
        e.preventDefault();
        setChangePassword(!changePass)
    }

    return (
        <React.Fragment>
            <div className={ClassNames.EDIT_USER_WRAPPER}>
                <Form data={formData} onChange={handleChange} onClick={e => e.preventDefault()}>
                    <TextInput
                        type="text" 
                        name="username"
                        label='Username'
                        disabled={true}
                    />
                    <TextInput
                        type="email" 
                        name="email"
                        label='Email'
                        required={true}
                    />
                    <Button className={ClassNames.INVISIBLE_BTN} onClick={toggleChagnePassword}>Change Password</Button>
                    {changePass
                        ? <React.Fragment>
                            <TextInput
                                type="password" 
                                name="password"
                                label='Password'
                                required={true}
                            />
                            <TextInput
                                type="password" 
                                name="confirmPassword"
                                label='Confirm Password'
                                required={true}
                            />
                        </React.Fragment> 
                        : null
                    }
                    <TextInput
                        type="text" 
                        name="name"
                        label='Displayed Name'
                        required={true}
                    />
                    <DateInput
                        name="birthDate"
                        label='Date of Birth'
                    />
                    <TextInput
                        type="textarea" 
                        name="description"
                        label='Description'
                        height={100}
                    />
                    <input
                        type="file"
                        name={"profile_pic"}
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className={ClassNames.DROP_FILE_INPUT}
                    />
                </Form>
                <Button className={'file-toggle'} onClick={() => openFileInput(true)}>
                    <span className="icon"><MdUpload/></span>
                    <span className="text">Upload Media</span>
                </Button>
                {fileInputFlag && 
                    <React.Fragment>
                        <div className={ClassNames.DRAG_DROP_WRAPPER}>
                            <div className="actions">
                                <Button className={ClassNames.MODAL_CLOSE_BTN} onClick={handleCloseDragDrop}>
                                    <MdClose/>
                                </Button>
                            </div>
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className={ClassNames.DRAG_DROP_DIV}
                                onClick={() => fileInputRef.current.click()}
                            >

                                {previewUrl && !loading ? (
                                    file.type.startsWith('image/') ? (
                                        <img src={previewUrl} alt="Media Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                    ) : <span>File type not supported.</span>
                                ) : loading ? <Loader mini={true} />
                                : (
                                    <p>
                                        <span className="icon"><MdAddPhotoAlternate/></span>
                                        <span className="text">Drag and drop an image, or click to select one</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                }
                <Button extraClass={ClassNames.ADD_NEW_POST_SUBMIT_BTN} onClick={handleSubmit}>
                    Publish
                </Button>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth ? {...state.auth, id: parseInt(state.auth.id)} : null,
});

const mapDispatchToProps = dispatch => ({
    editUser: inputs => dispatch(updateUser(inputs)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditUser);