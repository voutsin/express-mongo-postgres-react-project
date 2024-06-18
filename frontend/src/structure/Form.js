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
            {children}
        </form>
    )
}

export const Input = props => {
    const {
        label
    } = props;

    return (
        <React.Fragment>
            <label>
                <span>{label}</span>
	            <input {...props} />
	        </label>
        </React.Fragment>
    )
}

export const Button = props => {
    return (
        <React.Fragment>
            <button {...props}/>
        </React.Fragment>
    )
}