import React, { useEffect, useState } from "react";
import { ClassNames } from "../../../styles/classes";
import { Button } from "../../../structure/Form/Form";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import { BASE_URL } from "../../../config/apiRoutes";

const Slider = props => {
    const [activeImage, setActiveImage] = useState(null);

    const {
        photos,
        target,
        handleClose
    } = props;

    useEffect(() => {
        if (target) {
            setActiveImage(target);
        }
    }, [target]);

    const handleNext = () => {
        const current = photos.indexOf(activeImage);
        const next = current + 1;
        if (next !== photos.length) {
            setActiveImage(photos[next]);
        }
    }

    const handlePrev = () => {
        const current = photos.indexOf(activeImage);
        const prev = current - 1;
        if (prev >= 0) {
            setActiveImage(photos[prev]);
        }
    }

    return (
        <React.Fragment>
            <div className="slider-wrapper">
                <div className={ClassNames.MODAL_CLOSE}>
                    <Button className={ClassNames.MODAL_CLOSE_BTN} onClick={handleClose}>
                        <MdClose/>
                    </Button>
                </div>
                <div className="view">
                    {activeImage && <img src={`${BASE_URL}${activeImage.url}`} alt=""/>}
                </div>
                <div className='controls'>
                    <Button className={'prev'} onClick={handlePrev}>
                        <MdChevronLeft/>
                    </Button>
                    <Button className='next' onClick={handleNext}>
                        <MdChevronRight/>
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Slider;