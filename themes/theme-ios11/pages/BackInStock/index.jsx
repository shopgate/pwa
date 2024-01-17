import { View } from '@shopgate/engage/components';
import React from 'react';
import { i18n } from '@shopgate/engage/core';
// import ProductContent from './components/Content';
import { BackBar } from 'Components/AppBar/presets';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackInStockReminders } from '@shopgate/engage/back-in-stock';

/**
 * The BackInStockPage component.
 */
const BackInStockPage = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.back_in_stock')} />
        }
    />
    <BackInStockReminders />
  </View>
);

export default BackInStockPage;

//
//
//
// const props = {
//   open: 'open',
//   state: 'state',
// };
//
// /**
//  */
// class BackInStock extends PureComponent {
//   /**
//    * @param {Object} props The consumer props.
//    * @returns {JSX}
//    */
//   consumeRenderer = ({ open }) => {
//     if (!open) {
//       return null;
//     }
//
//     // return <ProductContent productId={productId || null} isVariant={!!state.productId} />;
//     return <View>
//       <AppBar />
//       <View>asdf</View>
//     </View>;
//   }
//
//   /**
//    * @return {JSX}
//    */
//   render() {
//     return (
//       <View aria-hidden={false}>
//         <Consume context={RouteContext} props={props}>
//           {this.consumeRenderer}
//         </Consume>
//       </View>
//     );
//   }
// }
//
// export default BackInStock;
