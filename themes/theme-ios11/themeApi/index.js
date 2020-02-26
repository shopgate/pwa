import { SheetDrawer as Drawer, View } from '@shopgate/engage/components';
import { PriceDifference } from '@shopgate/engage/product';
import AppBar from 'Components/AppBar/presets/BackBar';
import ProductSlider from 'Components/ProductSlider';
import ProductGrid from 'Components/ProductGrid';
import TabBar from 'Components/TabBar';
import { ProductContext } from '../pages/Product/context';
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
  TabBar,
  TextOption,
  SelectOption,
  PriceDifference,
  contexts: {
    ProductContext,
  },
};
