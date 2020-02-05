import { SheetDrawer as Drawer, View } from '@shopgate/engage/components';
import { PriceDifference } from '@shopgate/engage/product';
import AppBar from 'Components/AppBar/presets/BackBar';
import ProductGrid from 'Components/ProductGrid';
import ProductSlider from 'Components/ProductSlider';
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
  TextOption,
  SelectOption,
  PriceDifference,
  contexts: {
    ProductContext,
  },
};
