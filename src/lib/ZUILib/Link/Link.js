import React from 'react';
import authenticate from '../../../pages/Authenticate';
import { Link } from 'react-router';

const _Link = (props, context) => {

  const linkProps = Object.assign({}, props);
  delete linkProps.dispatch;

  // add UI controlled component class
  const uiname = linkProps.uiname;
  let className = linkProps.className;
  if (uiname) {
    className = className ? className + ' uic' : 'uic';
  }

  // Generate Link tag
  let link = <Link className={className} {...linkProps}>{linkProps.children}</Link>;
  if (linkProps.notallowed) {
    link = <Link className={className} onClick={(e) => { e.preventDefault(); return false; }} {...linkProps} disabled>{linkProps.children}</Link>;
  }
  return link;
}
_Link.displayName = '_Link';
export default authenticate(_Link);