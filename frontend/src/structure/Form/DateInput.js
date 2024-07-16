import React, { useRef } from "react";
import { ClassNames } from "../../styles/classes";

export const DateInput = props => {
    const dateInputRef = useRef(null);

    const {
        label,
        className,
        formData,
        name,
        onFormChange,
        onChange,
        required,
    } = props;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        onChange(name, value);
    }

    const chooseDate = (event) => {
        event.preventDefault();
        dateInputRef.current.showPicker();
    }

    const parsedProps = {
        ...props,
        type: 'date',
        onChange: (event) => {
            if (onChange) handleChange(event); 
            if (onFormChange) onFormChange(event); 
        },
        className: className || 'form-input',
        value: (formData && formData[name]) ? formData[name] : '',
    }

    const filled = parsedProps.value && parsedProps.value.length > 0;

    const inputLabel = `${label || ''}${required ? ' *' : ''}`;

    return (
        <React.Fragment>
            <label className={`${ClassNames.INPUT} ${ClassNames.CUSTOM_INPUT} date`} onClick={chooseDate}>
                <span className={`${ClassNames.INPUT_SPAN} ${filled ? ClassNames.INPUT_FILLED : ''}`} >
                    {inputLabel}
                </span>
                <span className={ClassNames.CUSTOM_INPUT_NAME}> {parsedProps.value} </span>
                <input {...parsedProps} ref={dateInputRef}/>
	        </label>
        </React.Fragment>
    )
}

export default DateInput;