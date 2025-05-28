import { SheetDrawer as Drawer, View } from '@shopgate/engage/components';
import { ProductContext } from '@shopgate/engage/product/contexts';
import {
  ProductSlider,
  PriceDifference,
  TextOption,
  SelectOption,
} from '@shopgate/engage/product/components';
import AppBar from 'Components/AppBar/presets/BackBar';
import ProductGrid from 'Components/ProductGrid';
import ProductHeader from '../pages/Product/components/Header';
import ProductCard from './ProductCard';

export const legacyThemeAPI = {
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

export const themeComponents = {
  AppBar,
  ProductCard,
  ProductGrid,
  ProductHeader,
};
