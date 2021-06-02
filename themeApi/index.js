import { SheetDrawer as Drawer, View } from '@shopgate/engage/components';
import { PriceDifference, ProductSlider, ProductContext } from '@shopgate/engage/product';
import { TextOption, SelectOption } from '@shopgate/engage/product/components/Options';
import AppBar from 'Components/AppBar/presets/BackBar';
import ProductGrid from 'Components/ProductGrid';
import TabBar from 'Components/TabBar';
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
  TabBar,
  TextOption,
  SelectOption,
  PriceDifference,
  contexts: {
    ProductContext,
  },
};
