import React, { useRef, useState } from "react";
import TooltipModal from "../TooltipModal";
import { Button } from "./Form";
import { ClassNames } from "../../styles/classes";
import { MdMoreVert } from "react-icons/md";

const SelectInput = props => {
    const inputRef = useRef(null);
    const [optionsModalFlag, openOptionsModal] = useState(false);

    const { compact, onChange, options, name, label } = props;

    const handleChange = (event) => {
        const value = event.target.value;
        onChange(name, value);
    }

    const handleSelect = option => onChange(name, option.value);

    return (
        <React.Fragment>
            {compact 
                ? <div className="select-input">
                    <Button className={ClassNames.INVISIBLE_BTN} onClick={() => openOptionsModal(true)}>
                        <MdMoreVert/>
                    </Button>
                    {optionsModalFlag && 
                        <TooltipModal
                            handleClose={() => openOptionsModal(false)}
                            flag={optionsModalFlag}
                        >
                            <div className="options">
                                {options.map((option, index) => {
                                    return (
                                        <div key={`option-label-${index}`} className="label" onClick={() => handleSelect(option)}>
                                            {option.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </TooltipModal>
                    }
                </div>
                : <select onChange={handleChange} name={name} ref={inputRef}>
                    <option>{label}</option>
                    {options.map((option, index) => {
                        return (
                            <option key={index}>
                                {option}
                            </option>
                        );
                    })}
                </select>
            }
        </React.Fragment>
    )
}

export default SelectInput;