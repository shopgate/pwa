import Loadable from 'react-loadable';
import Loading from '@shopgate/pwa-common/components/Loading';

const ShopgateCommerceWidgetsImage = Loadable({
  loader: () => import('Image'),
  loading: Loading,
});

const ShopgateCommerceWidgetsImageSlider = Loadable({
  loader: () => import('ImageSlider'),
  loading: Loading,
});

const ShopgateCommerceWidgetsHtml = Loadable({
  loader: () => import('Html'),
  loading: Loading,
});

const ShopgateCommerceWidgetsProductSlider = Loadable({
  loader: () => import('ProductSlider'),
  loading: Loading,
});

const ShopgateCommerceWidgetsCategoryList = Loadable({
  loader: () => import('CategoryList'),
  loading: Loading,
});

const ShopgateCommerceWidgetsProductList = Loadable({
  loader: () => import('Products'),
  loading: Loading,
});

const ShopgateCommerceWidgetsLiveshopping = Loadable({
  loader: () => import('Liveshopping'),
  loading: Loading,
});

export default {
  '@shopgate/commerce-widgets/image': ShopgateCommerceWidgetsImage,
  '@shopgate/commerce-widgets/image_slider': ShopgateCommerceWidgetsImageSlider,
  '@shopgate/commerce-widgets/html': ShopgateCommerceWidgetsHtml,
  '@shopgate/commerce-widgets/product_slider': ShopgateCommerceWidgetsProductSlider,
  '@shopgate/commerce-widgets/category_list': ShopgateCommerceWidgetsCategoryList,
  '@shopgate/commerce-widgets/product_list': ShopgateCommerceWidgetsProductList,
  '@shopgate/commerce-widgets/liveshopping': ShopgateCommerceWidgetsLiveshopping,
};
