import React from "react";

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
                return React.cloneElement(child, { formData: data, onChange: handleChange });
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
        type
    } = props;

    const parsedProps = {
        ...props,
        className: className || 'form-input',
    }

    if (type !== 'file') {
        parsedProps.value = formData ? formData[name] : '';
    }   

    return (
        <React.Fragment>
            <label>
                <span>{label}</span>
	            <input {...parsedProps}/>
	        </label>
        </React.Fragment>
    )
}

export const Button = props => {
    const parsedProps = {
        ...props,
        className: props.className || 'standard-btn',
    }
    return (
        <React.Fragment>
            <button {...parsedProps}/>
        </React.Fragment>
    )
}