import React, { PureComponent } from 'react';
import { Consume } from '@shopgate/engage/components';
import View from 'Components/View';
import { RouteContext } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from './components/Content';

const { colors } = themeConfig;

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
      <View background={colors.background}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Search;
