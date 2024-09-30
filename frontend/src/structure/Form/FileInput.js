import React, { useEffect, useState } from "react";
import { ClassNames } from "../../styles/classes";

const FileInput = props => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(null);

    const {
        label,
        name,
        className,
        onFormChange,
        onChange,
        required
    } = props;

    const handleChange = (event) => {
        const name = event.target.name;
        const inputFile = event.target.files[0];
        onChange(name, inputFile);
    }

    // store file locally
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };

    const handleCancel = () => setLoading(false);

    const [fileInput] = useState(() => {
        const elem = document.createElement('input');
        elem.type = 'file';
        elem.name = name;
        elem.className = className || 'custom-form-input';
        elem.addEventListener('cancel', handleCancel);
        elem.addEventListener('change', (event) => {
            handleFileChange(event); 
            if (onChange) handleChange(event); // Call external onChange if provided
            if (onFormChange) onFormChange(event); // Call onFormChange if provided
        });
        return elem;
    });

    useEffect(() => {
        setLoading(false);
    }, [file]);

     // Clean up when the component unmounts
    useEffect(() => {
      return () => {
        // Remove the element from the DOM
        if (fileInput.parentNode) {
          fileInput.parentNode.removeChild(fileInput);
        }
      };
    }, [fileInput]);

    const inputLabel = `${label}${required ? ' *' : ''}`;

    const chooseFile = (event) => {
        event.preventDefault();
        setLoading(true);
        fileInput.click();
    }

    return (
        <React.Fragment>
            <label className={`${ClassNames.INPUT} ${ClassNames.CUSTOM_INPUT}`} >
                <span className={`${ClassNames.INPUT_SPAN} ${file ? ClassNames.INPUT_FILLED : ''}`} >
                    {inputLabel}
                </span>
                <span className={ClassNames.CUSTOM_INPUT_NAME}> {file ? file.name : ''} </span>
                <div className={ClassNames.CUSTOM_INPUT_BTNS}>
                    <button onClick={chooseFile} disabled={loading} className={`${ClassNames.STANDARD_BTN} ldn-btn ${loading ? 'loading' : ''}`}>BROWSE</button>
                </div>
	        </label>
        </React.Fragment>
    )
}

export default FileInput;