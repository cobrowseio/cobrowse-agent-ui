import React from 'react';
import Session from './Session';
import './SessionList.css';

export default function SessionList(props) {

    function renderSession(session, idx) {
        return (
            <div className={'row'} key={idx}>
                <Session session={session} />
            </div>
        );
    }

    return (
        <div className="SessionList">
            { props.sessions.map(renderSession) }
        </div>
  );
}
