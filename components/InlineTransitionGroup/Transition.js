/**
 * Copyright (c) 2016, Felipe Thomé
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var TransitionHooks = require('react-transition-hooks');
var uniqBy = require('lodash/uniqBy');
var TransitionChild = require('./TransitionChild');

var Transition = React.createClass({
  displayName: 'Transition',
  prevChildren: null,

  propTypes: {
    children: React.PropTypes.node,
    childrenStyles: React.PropTypes.shape({
      base: React.PropTypes.object,
      appear: React.PropTypes.object,
      enter: React.PropTypes.object,
      leave: React.PropTypes.object,
    }),
    component: React.PropTypes.string,
    onPhaseEnd: React.PropTypes.func,
    onPhaseStart: React.PropTypes.func,
  },

  getDefaultProps: function () {
    return {
      childrenStyles: {},
      component: 'div',
    };
  },

  render: function () {
    var {
      children,
      childrenStyles,
      component,
      onPhaseEnd,
      onPhaseStart,
      ...others
    } = this.props;

    var allChildren = React.Children.toArray(children);

    if (this.prevChildren && this.prevChildren.length) {
      allChildren = allChildren.concat(this.prevChildren);
      allChildren = uniqBy(allChildren, 'key');
    }

    this.prevChildren = React.Children.toArray(children);

    return (
      <TransitionHooks component={component} {...others}>
        {React.Children.map(allChildren, function (child) {
          return (
            <TransitionChild
              id={((child || {}).props || {}).id}
              childrenBaseStyle={childrenStyles.base}
              childrenAppearStyle={childrenStyles.appear}
              childrenEnterStyle={childrenStyles.enter}
              childrenLeaveStyle={childrenStyles.leave}
              onChildAppeared={onPhaseEnd}
              onChildEntered={onPhaseEnd}
              onChildLeft={onPhaseEnd}
              onChildStartAppear={onPhaseStart}
              onChildStartEnter={(...args) => {
                allChildren.shift();
                this.forceUpdate();

                if (typeof onPhaseStart === 'function') {
                    onPhaseStart(...args);
                }
              }}
              onChildStartLeave={onPhaseStart}
              style={((child || {}).props || {}).style}
            >
              {child}
            </TransitionChild>
          );
        }, this)}
      </TransitionHooks>
    );
  },

});

module.exports = Transition;
