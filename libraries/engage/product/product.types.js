// @flow

export type ProductId = string;

export type ProductCharacteristic = {
  id: string | number,
  name: string,
  label: string,
  value: string,
}

export type ProductTierPrice = {
  from: number | null,
  to: number | null,
  unitPrice: number,
}

export type ProductPrice = {
  currency: string,
  info: string,
  unitPrice: number,
  unitPriceStriked: number,
  unitPriceMin: number,
  unitPriceMax: number,
  unitPriceNet: number,
  unitPriceWithTax: number,
  taxAmount: number,
  taxPercent: number,
  msrp: number,
  tiers: ProductTierPrice[],
  discount: number
}

export type ProductPriceAware = { price?: ProductPrice | null }
export type ProductCharacteristicsAware = { characteristics?: ProductCharacteristic[] | null }

// TODO: Finish product type.
export type Product = {
  id: ProductId;
  name: string,
} & ProductCharacteristicsAware & ProductPriceAware

export type ProductAware = { product?: Product | null }
export type BaseProductAware = { baseProduct?: Product | null }
