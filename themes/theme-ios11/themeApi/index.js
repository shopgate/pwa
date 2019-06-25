import { SheetDrawer as Drawer } from '@shopgate/engage/components';
import { PriceDifference } from '@shopgate/engage/product';
import AppBar from 'Components/AppBar/presets/BackBar';
import ProductSlider from 'Components/ProductSlider';
import ProductGrid from 'Components/ProductGrid';
import View from 'Components/View';
import TabBar from 'Components/TabBar';
import { ProductContext } from '../pages/Product/context';
import { TextOption, SelectOption } from '../pages/Product/components/Options';
import ProductCard from './ProductCard';

export default {
  AppBar,
  Drawer,
  ProductCard,
  ProductGrid,
  ProductSlider,
  View,
  TabBar,
  TextOption,
  SelectOption,
  PriceDifference,
  contexts: {
    ProductContext,
  },
};
