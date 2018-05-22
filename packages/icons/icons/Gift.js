
import React, { Component } from 'react';

class GiftIcon extends Component {
  render() {
    var defaults = {
      'aria-hidden': true,
      height: 16,
      width: 14,
      viewBox: '0 0 14 16',
      style: {
        display: 'inline-block',
        verticalAlign: 'text-top',
        fill: 'currentColor',
      },
    };
    return (
      <svg {...defaults} {...this.props}>
        <path fillRule="evenodd" d="M13.02 4h-1.38c.19-.33.33-.67.36-.91.06-.67-.11-1.22-.52-1.61-.36-.38-.81-.48-1.36-.48h-.11c-.53.02-1.11.25-1.53.58-.42.33-.73.72-.97 1.2-.23-.48-.55-.88-.97-1.2-.42-.32-1-.58-1.53-.58h-.03c-.56 0-1.06.09-1.44.48-.41.39-.58.94-.52 1.61.03.23.17.58.36.91H2c-.55 0-1 .45-1 1v3h1v5c0 .55.45 1 1 1h9c.55 0 1-.45 1-1V8h1V5c0-.55-.45-1-1-1h.02zm-4.78-.88c.17-.36.42-.67.75-.92.3-.23.72-.39 1.05-.41h.09c.45 0 .66.11.8.25s.33.39.3.95c-.05.19-.25.61-.5 1h-2.9l.41-.88v.01zM4.11 2.04c.13-.13.31-.25.91-.25.31 0 .72.17 1.03.41.33.25.58.55.75.92l.42.88h-2.9c-.25-.39-.45-.81-.5-1-.03-.56.16-.81.3-.95l-.01-.01zm2.91 10.95h-4V8h4v5-.01zm0-6h-5V5h5v2-.01zm5 6h-4V8h4v5-.01zm1-6h-5V5h5v2-.01z"/>
      </svg>
    );
  }
}
export default GiftIcon;