import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "../../structure/Form/Form";
import TextInput from "../../structure/Form/TextInput";
import { MdAddPhotoAlternate, MdClose, MdUpload } from "react-icons/md";
import { ClassNames } from "../../styles/classes";
import Loader from "../../structure/Loader";
import { PostTypes } from "../../common/enums";
import { getYoutubeVideoId } from "../../common/utils";

const AddNewPostForm = props => {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({});
    const [fileInputFlag, openFileInput] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [linkPreview, setLinkPreview] = useState(null);

    const { handlePublishPost } = props;

    useEffect(() => {
        if (previewUrl && file) {
            setLoading(false);
        }
    }, [previewUrl, file])

    const handleChange = (name, value) => {
        if (name === 'content') {
            const youtubeVideoId = getYoutubeVideoId(value);
            if (youtubeVideoId) {
                setLinkPreview(`https://www.youtube.com/embed/${youtubeVideoId}`);
            } else {
                setLinkPreview(null);
            }
        }

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
            ...formData,
            postType: file != null ? PostTypes.MULTIMEDIA : PostTypes.STATUS,
        }
        handlePublishPost({finalBody, file});
    }

    return (
        <React.Fragment>
            <Form data={formData} onChange={handleChange} onClick={e => e.preventDefault()}>
                <TextInput
                    type={"textarea"}
                    name={"content"}
                    label={'Write something...'}
                    className={'text-input'}
                />
                <input
                    type="file"
                    name={"media_url"}
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className={ClassNames.DROP_FILE_INPUT}
                />
            </Form>
            {linkPreview && (
                <iframe
                    width="100%"
                    height="300"
                    src={linkPreview}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Link Preview"
                    style={{ marginBottom: '10px' }}
                ></iframe>
            )}
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
                                ) : (
                                    <video controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
                                        <source src={previewUrl} type={file.type} />
                                        Your browser does not support the video tag.
                                    </video>
                                )
                            ) : loading ? <Loader mini={true} />
                            : (
                                <p>
                                    <span className="icon"><MdAddPhotoAlternate/></span>
                                    <span className="text">Drag and drop an image or video here, or click to select one</span>
                                </p>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            }
            <Button extraClass={ClassNames.ADD_NEW_POST_SUBMIT_BTN} onClick={handleSubmit}>
                Publish
            </Button>
        </React.Fragment>
    )
}

export default AddNewPostForm;