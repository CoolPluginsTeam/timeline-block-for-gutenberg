import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
const {
    Popover,
    ColorPicker
} = wp.components

const ColorController = (props) => {
    const [colorPopup, setColorPopup] = useState(false);
    const [colorPopupActiveCls, setColorPopupActiveCls] = useState('');
    const {
        label,
        attrLabel,
        className,
        color,
        setAttributes
    } = props;

    const resetcolorpalate = (e) => {
        const updateAttr = {};
        updateAttr[attrLabel] = '';
        setAttributes(updateAttr)
    };

    const hideColorPopup=(event)=>{
        const colorElement = event.target.closest('.ctlb-color-picker-popover');
        const colorButton=event.target.closest('.components-color-palette__custom-color-button.ctlb-color-picker-popover-active');
        const colorButtonParent=event.target.classList.contains('ctlb-color-picker-popover-active');
        if(null === colorElement && null === colorButton && !colorButtonParent){
            setColorPopupActiveCls('');
            setColorPopup(false);
            document.removeEventListener('mousedown', hideColorPopup); 
        }
    }

    const showColorPopover =()=>{
        if (!colorPopup) {
            setTimeout(() => {
                document.addEventListener('mousedown', hideColorPopup);
            });
        } else {
            document.removeEventListener('mousedown', hideColorPopup);
        }
        const activeClass=false === colorPopup ? ' ctlb-color-picker-popover-active':'';
        setColorPopupActiveCls(activeClass);
        setColorPopup(!colorPopup);
    }

    return (
        <>
            <div className="cp-timeline-block-style-settings">
                <h2>{__(label, "timeline-block")}</h2>
                <div className={`components-button timeline-block-colorpallete-reset is-small ${className}`} onClick={resetcolorpalate}><span className="dashicon dashicons dashicons-image-rotate"></span></div>
                 <button className={`components-color-palette__custom-color-button${colorPopupActiveCls}`} style={{ background: color }} onClick={showColorPopover}></button>
                {colorPopup &&
                    <Popover className="ctlb-color-picker-popover">
                        <ColorPicker
                            color={color}
                            onChange={(value) => setAttributes({ [attrLabel]: value })}
                            enableAlpha
                            defaultValue="#000"
                        />
                    </Popover>
                }
            </div>
        </>
    );
}

export default ColorController;
