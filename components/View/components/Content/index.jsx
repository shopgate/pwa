import React from 'react';
import { ViewContext } from '../../context';
import ContentContainer from './components/Container';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ViewContent = props => (
  <ViewContext.Consumer>
    {({ setContentRef }) => (
      <ContentContainer {...props} setContentRef={setContentRef} />
    )}
  </ViewContext.Consumer>
);

export default ViewContent;
