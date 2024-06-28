import React, { useEffect, useState } from "react";
import { ClassNames } from "../styles/classes";

export const Form = props => {
    const {
        data,
        onSubmit,
        onChange,
        className,
        children
    } = props;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        onChange(name, value);
    }

    return (
        <form data={data} onSubmit={onSubmit} className={className} onChange={handleChange}>
            {React.Children.map(children, child => {
                // Clone the child element with the additional prop
                return React.cloneElement(child, { formData: data, onFormChange: handleChange });
            })}
        </form>
    )
}

export const Input = props => {
    const {
        label,
        className,
        formData,
        name,
        onFormChange,
        onChange,
        required
    } = props;

    const handleChange = (event) => {
        console.log("handle change")
        const name = event.target.name;
        const value = event.target.value;
        onChange(name, value);
    }

    const parsedProps = {
        ...props,
        className: className || 'form-input',
        value: (formData && formData[name]) ? formData[name] : '',
        onChange: (event) => {
            if (onChange) {handleChange(event);} // Call external onChange if provided
            if (onFormChange) {onFormChange(event);} // Call onFormChange if provided
        },
    }

    const filled = parsedProps.value && parsedProps.value.length > 0;

    const inputLabel = `${label || ''}${required ? ' *' : ''}`;

    return (
        <React.Fragment>
            <label className={ClassNames.INPUT} >
                <span className={`${ClassNames.INPUT_SPAN} ${filled ? ClassNames.INPUT_FILLED : ''}`} >
                    {inputLabel || ''}
                </span>
	            <input {...parsedProps}/>
	        </label>
        </React.Fragment>
    )
}

export const InputFile = props => {
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
        elem.className = className || 'file-form-input';
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
            <label className={`${ClassNames.INPUT} ${ClassNames.FILE_INPUT}`} >
                <span className={`${ClassNames.INPUT_SPAN} ${file ? ClassNames.INPUT_FILLED : ''}`} >
                    {inputLabel}
                </span>
                <span className={ClassNames.FILE_INPUT_NAME}> {file ? file.name : ''} </span>
                <div className={ClassNames.FILE_INPUT_BTNS}>
                    <button onClick={chooseFile} disabled={loading} className={`${ClassNames.STANDARD_BTN} ldn-btn ${loading ? 'loading' : ''}`}>BROWSE</button>
                </div>
	        </label>
        </React.Fragment>
    )
}

export const Button = props => {
    const {
        className,
        extraClass
    } = props;

    const parsedProps = {
        ...props,
        className: className || ClassNames.STANDARD_BTN,
    }

    if (props.extraClass) {
        parsedProps.className += ' ' + extraClass;
    }

    return (
        <React.Fragment>
            <button {...parsedProps}/>
        </React.Fragment>
    )
}

export const LoadingButton = props => {
    const [loading, setLoading] = useState(false);

    const {
        onClick,
        className,
        extraClass,
        apiCallName,
    } = props;

    useEffect(() => {
        if (props[apiCallName]) {
            setLoading(false);
        }
    }, [props, apiCallName]);

    const handleClick = event => {
        setLoading(true);
        onClick(event);
    }

    const parsedProps = {
        ...props,
        onClick: handleClick,
        className: `${(className || ClassNames.STANDARD_BTN)} ${ClassNames.LOADING_BTN} ${loading ? 'loading' : ''}` ,
    }

    if (props.extraClass) {
        parsedProps.className += ' ' + extraClass;
    }

    return (
        <React.Fragment>
            <button {...parsedProps}/>
        </React.Fragment>
    )
}