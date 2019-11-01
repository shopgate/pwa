import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import View from 'Components/View';
import { RouteContext } from '@shopgate/pwa-common/context';
import Content from './components/Content';

const map = {
  searchPhrase: 'query.s',
  open: 'open',
};

/**
 * The search page component.
 */
class Search extends PureComponent {
  /**
   * @param {Object} props the consumed props.
   * @returns {JSX}
   */
  consumeRenderer = ({ searchPhrase, open }) => {
    if (!open) {
      return null;
    }

    return <Content searchPhrase={searchPhrase} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View aria-hidden={false}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Search;
