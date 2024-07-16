import React from "react";
import { ClassNames } from "../styles/classes";
import { Button } from "./Form/Form.js";
import { MdClose } from "react-icons/md";

const Modal = props => {
    const {
        children,
        handleClose,
        header,
        flag
    } = props;

    return flag ? (
        <React.Fragment>
            <div className={`${ClassNames.MODAL_WRAPPER} ${flag && 'opened'}`}>

                <div className={ClassNames.MODAL_CONTENT}>
                    <div className={ClassNames.MODAL_CLOSE}>
                        <Button className={ClassNames.MODAL_CLOSE_BTN} onClick={handleClose}>
                            <MdClose/>
                        </Button>
                    </div>
                    {header && 
                        <div className={ClassNames.MODAL_HEADER}>
                            <h4>{header}</h4>
                        </div>
                    }
                    <div className={ClassNames.MODAL_BODY}>
                      {children}
                    </div>
                </div>

            </div>
        </React.Fragment>
    ) : null;
}

export default Modal;