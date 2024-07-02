import React, { useEffect, useState } from "react";
import { ClassNames } from "../../styles/classes";
import { MdCheck } from "react-icons/md";

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
    const [callFlag, setCallFlag] = useState(false);

    const {
        onClick,
        className,
        extraClass,
        apiCall,
        children,
    } = props;

    useEffect(() => {
        if (apiCall && loading) {
            setLoading(false);
            setCallFlag(true);
        }
    }, [props, apiCall, loading]);

    const handleClick = event => {
        setLoading(true);
        onClick(event);
    }

    const parsedProps = {
        ...props,
        onClick: callFlag ? null : handleClick,
        className: `${(className || ClassNames.STANDARD_BTN)} ${ClassNames.LOADING_BTN} ${loading ? 'loading' : ''}` ,
    }

    if (props.extraClass) {
        parsedProps.className += ' ' + extraClass;
    }

    return (
        <React.Fragment>
            <button {...parsedProps}>
                {callFlag ? <MdCheck/> : children}
            </button>
        </React.Fragment>
    )
}