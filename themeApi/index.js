import { SheetDrawer as Drawer, View } from '@shopgate/engage/components';
import { PriceDifference, ProductContext } from '@shopgate/engage/product';
import AppBar from 'Components/AppBar/presets/BackBar';
import ProductGrid from 'Components/ProductGrid';
import ProductSlider from 'Components/ProductSlider';
import { TextOption, SelectOption } from '../pages/Product/components/Options';
import ProductHeader from '../pages/Product/components/Header';
import ProductCard from './ProductCard';

export default {
  AppBar,
  Drawer,
  ProductCard,
  ProductGrid,
  ProductSlider,
  ProductHeader,
  View,
  TextOption,
  SelectOption,
  PriceDifference,
  contexts: {
    ProductContext,
  },
};
