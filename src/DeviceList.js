import React from 'react';
import Device from './Device';
import SmartConnectButton from './SmartConnectButton';
import './DeviceList.css';

export default function DeviceList(props) {

    function renderDevice(device, idx) {
        return (
            <div className={'row'} key={idx}>
                <Device device={device}>
                    <SmartConnectButton device={device} onClick={props.connect} />
                </Device>
            </div>
        );
    }

    return (
        <div className="DeviceList">
            { props.devices.map(renderDevice) }
        </div>
  );
}
