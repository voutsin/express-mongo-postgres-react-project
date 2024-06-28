import React from "react";
import styled from 'styled-components';

const Loader = () => {

    const StyledLoader = styled.div`
        .loader {position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;display: flex;align-items: center;justify-content: center;z-index:1000;background: #5e63cd6e;}
        .loader .body {width: 100%;max-width: 10.6rem;position: relative;display: flex;align-items: center;justify-content: center;}
        .loader .body::before, .loader .body::after {content: "";position: absolute;border-radius: 50%;animation-duration: 1.8s;animation-iteration-count: infinite;animation-timing-function: ease-in-out;filter: drop-shadow(0 0 var(--loader-width)/2.25 rgba(#fff, 0.75));}
        .loader .body::before {width: 100%;padding-bottom: 100%;box-shadow: inset 0 0 0 var(--loader-width) #fff;animation-name: pulsA;}
        .loader .body::after {width: calc(100% - var(--loader-width)*2);padding-bottom: calc(100% - var(--loader-width)*2);box-shadow: 0 0 0 0 #fff;animation-name: pulsB;}
        @keyframes pulsA {0% { box-shadow: inset 0 0 0 var(--loader-width) #fff; opacity: 1; } 50%, 100% { box-shadow: inset 0 0 0 0 #fff; opacity: 0; }}
        @keyframes pulsB {0%, 50% { box-shadow: 0 0 0 0 #fff; opacity: 0; } 100% { box-shadow: 0 0 0 var(--loader-width) #fff; opacity: 1; }}
    `;

    return (
        <React.Fragment>
            <StyledLoader>
                <div className="loader">
                    <div className="body"></div>
                </div>
            </StyledLoader>
        </React.Fragment>
    )
}

export default Loader;