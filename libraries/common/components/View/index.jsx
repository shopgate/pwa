import React, { Component } from 'react';

class View extends Component {
  render() {
    return (
      <div style={{ flexGrow: 1, flexShrink: 1}}>
        {this.props.children}
      </div>
    );
  }
}

export default View;
