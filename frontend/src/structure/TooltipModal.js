import React, { useEffect, useRef, useState } from "react";
import { ClassNames } from "../styles/classes";

const TooltipModal = props => {
    const modalRef = useRef(null);
    const [opened, setOpened] = useState(false);

    const { children } = props;

    // Add and remove event listener for clicks outside the modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the clicked target is not inside the modalRef element
            if (modalRef.current && !modalRef.current.contains(event.target) && opened) {
                setOpened(false);
                props.handleClose();
            }
        };

        if (props.flag) {
            setOpened(true);
            document.addEventListener('click', handleClickOutside);
        } else {
            setOpened(false);
            document.removeEventListener('click', handleClickOutside);
        }

        // Cleanup event listener on component unmount
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, [props, opened]);

    // add top style to modal to display above target based on its height
    useEffect(() => {
        if (opened && modalRef.current) {
            const topAttr = `-${(modalRef.current.offsetHeight + 5)}px`;
            modalRef.current.style.top = topAttr;
        }
    }, [opened]);

    return (
        <React.Fragment>
            <div 
                className={`${ClassNames.TOOLTIP_MODAL} ${opened ? 'opened' : ''}`} 
                ref={modalRef}
            >
                {children}
            </div>
        </React.Fragment>
    )
}

export default TooltipModal;