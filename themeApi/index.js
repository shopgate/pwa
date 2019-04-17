import AppBar from 'Components/AppBar/presets/BackBar';
import Drawer from 'Components/Drawer';
import ProductSlider from 'Components/ProductSlider';
import ProductGrid from 'Components/ProductGrid';
import View from 'Components/View';
import TabBar from 'Components/TabBar';
import { ProductContext } from '../pages/Product/context';
import ProductCard from './ProductCard';

export default {
  AppBar,
  Drawer,
  ProductCard,
  ProductGrid,
  ProductSlider,
  View,
  TabBar,
  contexts: {
    ProductContext,
  },
};
