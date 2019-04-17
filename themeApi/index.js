import AppBar from 'Components/AppBar/presets/BackBar';
import Drawer from 'Components/Drawer';
import ProductGrid from 'Components/ProductGrid';
import ProductSlider from 'Components/ProductSlider';
import View from 'Components/View';
import { ProductContext } from '../pages/Product/context';
import ProductCard from './ProductCard';

export default {
  AppBar,
  Drawer,
  ProductCard,
  ProductGrid,
  ProductSlider,
  View,
  contexts: {
    ProductContext,
  },
};
