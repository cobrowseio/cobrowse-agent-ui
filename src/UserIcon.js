import React, { Component } from 'react';

import './UserIcon.css';

export default class UserIcon extends Component {

    initials = () => {
        if (!this.props.user) return '';
        if (!this.props.user.name) return '';
        if (this.props.user.picture) return '';
        return this.props.user.name.split(' ')
            .map(i => i.toUpperCase().charAt(0))
            .join('').substr(0,2);
    }

    render() {
        if (!this.props.user) return null;
        return (
            <div
                className={'UserIcon'}
                style={{
                    backgroundImage: this.props.user.picture ? `url(${this.props.user.picture||''})` : undefined,
                    backgroundColor: this.props.user.colour
                }}
            >
                <span>{this.initials()}</span>
            </div>
        );
    }
}
