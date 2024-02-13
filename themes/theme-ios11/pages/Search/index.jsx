import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { View } from '@shopgate/engage/components';
import { RouteContext } from '@shopgate/pwa-common/context';
import Content from './components/Content';

const map = {
  searchPhrase: 'query.s',
  open: 'open',
  pattern: 'pattern',
};

/**
 * The search page component.
 */
class Search extends PureComponent {
  /**
   * @param {Object} props the consumed props.
   * @returns {JSX}
   */
  consumeRenderer = ({ searchPhrase, open, pattern }) => {
    if (!open) {
      return null;
    }

    return <Content searchPhrase={pattern === '/category/:categoryId/all' ? '*' : searchPhrase} pattern={pattern} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    // View is rendered with noContentPortal prop, since the content portal is rendered inside
    return (
      <View aria-hidden={false} noContentPortal>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Search;
