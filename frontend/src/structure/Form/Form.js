import React, { useEffect, useState } from "react";
import { ClassNames } from "../../styles/classes";

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