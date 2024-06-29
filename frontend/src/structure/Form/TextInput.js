import React from "react";
import { ClassNames } from "../../styles/classes";

const TextInput = props => {
    const {
        label,
        className,
        formData,
        name,
        type,
        onFormChange,
        onChange,
        required,
        height
    } = props;

    const handleChange = (event) => {
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

    const styles = type === 'textarea' ? {height: height + 'px'} : {}
    return (
        <React.Fragment>
            <label className={`${ClassNames.INPUT} ${type === 'textarea' ? 'textarea' : ''}`} >
                <span className={`${ClassNames.INPUT_SPAN} ${filled ? ClassNames.INPUT_FILLED : ''}`} >
                    {inputLabel || ''}
                </span>
	            {type === 'textarea' ? <textarea {...parsedProps} style={styles} /> 
                : <input {...parsedProps}/>}
	        </label>
        </React.Fragment>
    )
}

export default TextInput;