import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import View from 'Components/View';
import { RouteContext } from '@virtuous/react-conductor/Router';
import colors from 'Styles/colors';
import Content from './components/Content';

const map = {
  searchPhrase: 'query.s',
  visible: 'visible',
};

/**
 * The search page component.
 */
class Search extends PureComponent {
  /**
   * @param {Object} props the consumed props.
   * @returns {JSX}
   */
  consumeRenderer = ({ searchPhrase, visible }) => {
    if (!visible) {
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
