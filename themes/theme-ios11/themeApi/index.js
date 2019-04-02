import AppBar from 'Components/AppBar/presets/BackBar';
import Drawer from 'Components/Drawer';
import ProductSlider from 'Components/ProductSlider';
import View from 'Components/View';
import TabBar from 'Components/TabBar';
import { ProductContext } from '../pages/Product/context';
import { TextOption, SelectOption, PriceDifference } from '../pages/Product/components/Options';
import ProductCard from './ProductCard';

export default {
  AppBar,
  Drawer,
  ProductCard,
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
