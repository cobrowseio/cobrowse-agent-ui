import React from 'react';
import { dateFromNow } from './utils';

const defaultContent = (online, lastActive) => {
  if (online) {
    return 'Online';
  }

  return `Last seen ${dateFromNow(lastActive)}`;
};

const LastSeen = ({ online, lastActive, children }) => {
  return (
    <div className='last-seen'>
      {children || defaultContent(online, lastActive)}
    </div>
  );
};

export default LastSeen;
