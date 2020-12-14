import React from 'react';
import './SmartConnectButton.css';

export default function SmartConnectButton(props) {

    function onClick() {
        if (props.device.connectable && props.onClick) props.onClick(props.device);
    }

    return (
        <div
            className={`SmartConnectButton ${props.device.online?'online':''} ${props.device.connectable?'connectable':''}`}
            onClick={onClick}
        >{ props.label || 'Connect' }</div>
  );
}
