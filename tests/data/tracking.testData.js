/*
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */

const sgData = {
  "shop": {
    "name": "Offizieller Shopgate Testshop",
    "shop_number": "10006",
    "market_id": "DE"
  },
  "user": {
    "sessionId": "xxx",
    "loggedIn": true,
    "email": "xxx@shopgate.com",
    "phone": "+1223456",
    "birthday": "1904-12-17",
    "gender": "f"
  },
  "device": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
    "os": "Other",
    "type": "Phone",
    "access": "Web",
    "codebase": ""
  },
  "page": {
    "referrer": "http://testshop.xxx.localdev.cc/php/shopgate/checkout_success/87424",
    "name": "startpage",
    "link": "http://testshop.xxx.localdev.cc/php/shopgate/index"
  },
  "tracking": {
    "get": []
  }
};


const sgDataAddress = {
  firstName: 'Bernd',
  surname: 'Mustermann',
  company: 'Shopgate',
  street: 'Teststreet 101',
  street2: '',
  zipcode: '35510',
  stateId: null,
  city: 'Butzbach',
  countryId: 'DE'
};


const sgDataOrder = {
  ...sgData,
  "order": {
    "number": "1700001978",
    "amount": {
      "currency": "EUR",
      "gross": "303.36",
      "net": "303.36",
      "tax": "-0.00",
      "coupons": {
        "currency": "EUR",
        "net": "0.00",
        "gross": "0.00"
      }
    },
    "invoiceAddress": sgDataAddress,
    "shippingAddress": sgDataAddress,
    "shipping": {
      "name": "DHL",
      "amount": {
        "currency": "EUR",
        "gross": "10.00",
        "net": "9.00",
        "tax": "0.00"
      }
    },
    "payment": {
      "name": "Vorkasse (Shopgate (powered by Adyen))",
      "amount": {
        "currency": "EUR",
        "gross": "0.00",
        "net": "0.00",
        "tax": "0.00"
      }
    },
    "user": {
      "email": "test@shopgate.com",
      "gender": "m",
      "phone": "12346",
      "birthday": "1970-01-01",
      "customerNumber": "101889",
      "externalCustomerId": "",
      "externalCustomerNumber": ""
    },
    "products": [
      {
        "uid": "SG10",
        "productNumber": "item_number_public-10",
        "name": "Produkt mit einem Grundpreis – langer Text",
        "quantity": "1",
        "tags": [],
        "amount": {
          "currency": "EUR",
          "gross": "75.63",
          "net": "75.63",
          "tax": "0.00"
        },
        "stockQuantity": 81
      },
      {
        "uid": "SG38",
        "productNumber": "item_number_public-38",
        "name": "Produkt als Highlight 2",
        "quantity": "1",
        "tags": [],
        "amount": {
          "currency": "EUR",
          "gross": "227.73",
          "net": "227.73",
          "tax": "0.00"
        },
        "stockQuantity": 69
      }
    ],
    "coupons": [],
    "field": {
      "fi_fa_fo": {
        "label": "Fi F Fo",
        "value": ""
      }
    }
  }
};


const sgDataSearch = {
  "search": {
    "query": "test",
    "resultCount": 5
  },
  "products": [
    {
      "uid": "LEOTEST10",
      "productNumber": "LEOTEST10",
      "name": "LEO TEST 10 (can be deleted)",
      "amount": {
        "currency": "EUR",
        "net": "2200.00",
        "gross": "2200.00",
        "tax": "0.00",
        "taxRate": "0.00"
      },
      "tags": [],
      "stockQuantity": 0
    },
    {
      "uid": "test-size-01",
      "productNumber": "",
      "name": "Product with different sizings",
      "amount": {
        "currency": "EUR",
        "net": "0.00",
        "gross": "0.00",
        "tax": "0.00",
        "taxRate": "0.00"
      },
      "tags": [],
      "stockQuantity": 0
    },
    {
      "uid": "1234567",
      "productNumber": "1234567",
      "name": "LEO TEST (can be deleted)",
      "amount": {
        "currency": "EUR",
        "net": "60.00",
        "gross": "60.00",
        "tax": "0.00",
        "taxRate": "0.00"
      },
      "tags": ["tag01", " tag02"],
      "stockQuantity": 0
    }
  ],
  "shop": {
    "name": "Offizieller Shopgate Testshop",
    "shop_number": "10006",
    "market_id": "DE"
  },
  "user": {
    "sessionId": "2034a73978bd4b5af547b82514dea39f",
    "loggedIn": false
  },
  "device": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
    "os": "Other",
    "type": "Phone",
    "access": "Web",
    "codebase": ""
  },
  "page": {
    "referrer": "http://testshop.schneider.localdev.cc/php/shopgate/item/534736",
    "name": "search",
    "link": "http://testshop.schneider.localdev.cc/php/shopgate/search?s=test&sort=relevance_desc",
    "title": "Search: test - Offizieller Shopgate Testshop"
  },
  "tracking": { "get": [] }
};

const sgDataProduct = {
  "product": {
    "uid": "SG6",
    "productNumber": "item_number_public-6",
    "name": "Produkt mit einem Sonderpreis",
    "amount": {
      "currency": "EUR",
      "taxRate": "19.00",
      "net": "21.01",
      "gross": "25.00",
      "tax": "3.99"
    },
    "tags": [],
    "stockQuantity": 66
  },
  "shop": { "name": "Offizieller Shopgate Testshop", "shop_number": "10006", "market_id": "DE" },
  "user": {
    "sessionId": "2034a73978bd4b5af547b82514dea39f",
    "loggedIn": true,
    "email": "carsten.schneider@shopgate.com",
    "phone": "12346",
    "birthday": "1989-09-09",
    "gender": "m"
  },
  "device": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
    "os": "Other",
    "type": "Phone",
    "access": "Web",
    "codebase": ""
  },
  "page": {
    "referrer": "http://testshop.schneider.localdev.cc/php/shopgate/cart",
    "name": "productDetails",
    "link": "http://testshop.schneider.localdev.cc/php/shopgate/item/534736",
    "title": "Produkt mit einem Sonderpreis - Offizieller Shopgate Testshop"
  },
  "tracking": { "get": [] }
};

const sgDataCheckout = {
  "cart": {
    "amount": {
      "currency": "EUR",
      "net": "42.02",
      "gross": "42.02",
      "tax": "0.00",
      "taxes": [],
      "products": { "net": "42.02", "gross": "42.02" },
      "complete_amount_string": "42.02"
    },
    "orderable": true,
    "products": [{
      "uid": "SG6",
      "parentUid": null,
      "productNumber": "item_number_public-6",
      "name": "Produkt mit einem Sonderpreis",
      "amount": {
        "currency": "EUR",
        "net": "21.01",
        "gross": "25.00",
        "tax": "3.99",
        "taxRate": "19.00"
      },
      "tags": [],
      "additionalShippingCosts": { "perOrder": "0", "perUnit": "0" },
      "quantity": "2",
      "stockQuantity": 66
    }],
    "coupons": [],
    "productsCount": 2
  },
  "checkout": {
    "shipping": { "name": "Österreichische Post" },
    "payment": { "name": "Vorkasse (Shopgate (powered by Adyen))" },
    "shippingAddress": sgDataAddress,
    "invoiceAddress": sgDataAddress
  },
  "shop": { "name": "Offizieller Shopgate Testshop", "shop_number": "10006", "market_id": "DE" },
  "user": {
    "sessionId": "2034a73978bd4b5af547b82514dea39f",
    "loggedIn": true,
    "email": "carsten.schneider@shopgate.com",
    "phone": "12346",
    "birthday": "1989-09-09",
    "gender": "m"
  },
  "device": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
    "os": "Other",
    "type": "Phone",
    "access": "Web",
    "codebase": ""
  },
  "page": {
    "referrer": "http://testshop.schneider.localdev.cc/php/shopgate/register",
    "name": "checkoutConfirm",
    "link": "http://testshop.schneider.localdev.cc/php/shopgate/checkout/default",
    "title": "Offizieller Shopgate Testshop: Bestellung überprüfen - Offizieller Shopgate Testshop"
  },
  "tracking": { "get": [] }
};

const product = {
  "id": 32938370,
  "parent_id": null,
  "has_children": false,
  "currency_id": "EUR",
  "shop_id": "131",
  "product_number": "SG6",
  "product_number_public": "item_number_public-6",
  "manufacturer": "MANUFACTURER",
  "manufacturer_item_number": "manufacturer_item_number-6",
  "name": "Produkt mit einem Sonderpreis",
  "tax_percent": "19.00",
  "tax_class_item_id": "1416",
  "msrp": "0",
  "additional_shipping_costs_per_unit": "0",
  "available_text": "<font color='#007700'>Available_Text</font>",
  "is_free_shipping": false,
  "description": "<p>Dieses Produkt hat einen Sonderpreis. Der aktuelle Preis könnte ein Aktionspreis sein. Diesem gegenüber steht der alte Preis.</p><p></p><p>\nALT: 50,00 EUR – NEU: 25,00 EUR</p><p></p><p>\nEs sollte ein Störer mit entsprechendem prozentualen Hinweis zu sehen sein.</p>",
  "age_rating": "0",
  "weight": "1000.0000",
  "properties": { "Artikel-Nr.": "item_number_public-6" },
  "ean": "",
  "isbn": "",
  "upc": null,
  "pzn": "0",
  "ignore_stock": false,
  "stock_quantity": 69,
  "delivery_days": "0",
  "is_available": true,
  "unit_amount_with_tax": "2500",
  "old_unit_amount_with_tax": "5000",
  "unit_amount_display": "2500",
  "unit_amount_display_old": "5000",
  "amount_info_text": "",
  "internal_order_info": "",
  "has_image": true,
  "display_type": "0",
  "is_active": true,
  "image_count": 1,
  "attribute_1": "",
  "attribute_2": "",
  "attribute_3": "",
  "attribute_4": "",
  "attribute_5": "",
  "attribute_6": "",
  "attribute_7": "",
  "attribute_8": "",
  "attribute_9": "",
  "attribute_10": "",
  "review_count": "1",
  "review_average_score": "6",
  "review_score_count": "1",
  "has_options": false,
  "has_input_fields": false,
  "has_block_pricing": false,
  "is_not_orderable": false,
  "deeplink_onlineshop": "http://www.shopgate.com?shopgate_redirect=1",
  "tags": null,
  "unit_amount_net": "2100.840336",
  "shipping_costs_per_order": "0",
  "unit_amount_with_tax_formatted": "25,00",
  "additional_shipping_costs_per_unit_formatted": "0,00",
  "msrp_formatted": "0,00",
  "old_unit_amount_with_tax_formatted": "50,00",
  "shipping_costs": 0,
  "shipping_info": {
    "shipping_notification": [],
    "shipping_costs_display_formatted": "Kostenloser Versand",
    "additional_shipping_costs_per_unit_formatted": "0,00 €"
  },
  "image_urls": [{
    "image_url_base": "http://testshop.schneider.localdev.cc/php/shopgate/sites/img/image.php/10006/1/5ae75db6116871392501166d5651eb67292c9be2f482f7e7134a5b0d69583363",
    "image_url_140": "http://testshop.schneider.localdev.cc/php/shopgate/sites/img/image.php/1000…651eb67292c9be2f482f7e7134a5b0d69583363?w=140&h=140&zc=resize&fillc=000000",
    "image_url_440": "http://testshop.schneider.localdev.cc/php/shopgate/sites/img/image.php/1000…651eb67292c9be2f482f7e7134a5b0d69583363?w=440&h=440&zc=resize&fillc=000000",
    "image_url_640": "http://testshop.schneider.localdev.cc/php/shopgate/sites/img/image.php/1000…651eb67292c9be2f482f7e7134a5b0d69583363?w=640&h=640&zc=resize&fillc=000000",
    "image_url_1024": "http://testshop.schneider.localdev.cc/php/shopgate/sites/img/image.php/1000…1eb67292c9be2f482f7e7134a5b0d69583363?w=1024&h=1024&zc=resize&fillc=000000",
    "image_url_150": "http://testshop.schneider.localdev.cc/php/shopgate/sites/img/image.php/1000…651eb67292c9be2f482f7e7134a5b0d69583363?w=150&h=150&zc=resize&fillc=000000"
  }],
  "discount_was_applied": false,
  "unit_amount_display_min": "",
  "unit_amount_display_max": "",
  "price_info": {
    "unit_amount_display_formatted": "21,01 €",
    "unit_amount_display": 2100,
    "price_label": "Old Price",
    "discount_label": "Angebot",
    "discount_from_msrp": false,
    "strike_price_display": 5000,
    "strike_price_display_formatted": "50,00 €",
    "discount_amount_formatted": "28,99 €",
    "discount_amount": 2899.159664,
    "discount_percent": 58,
    "discount_percent_formatted": "58%",
    "discount_display_formatted": "28,99 €(58%)",
    "discount_percent_is_final": false
  },
  "available_text_priority": 1,
  "stock_text": "Noch 69 mal auf Lager",
  "stock_text_priority": 1,
  "shipping_text": "Noch 69 mal auf Lager",
  "product_labels": [],
  "product_url": "item/534736",
  "product_info_url": "product_info/534736",
  "add_review_url": "add_review/534736",
  "reviews_url": "reviews/534736",
  "extended_fields": true,
  "quantity_in_cart": 1,
  "update_image_gallery": true
};

const sgDataCategoryAll = {
  "category": {
    "uid": "16",
    "name": "3 – Darstellung (Text/Bild/etc.)",
    "path": "3 – Darstellung (Text/Bild/etc.)"
  },
  "products": [{
    "uid": "SG114",
    "productNumber": "item_number_public-114",
    "name": "Produkt mit vielen Bewertungen",
    "amount": {
      "currency": "EUR",
      "net": "21.01",
      "gross": "25.00",
      "tax": "3.99",
      "taxRate": "19.00"
    },
    "tags": [],
    "stockQuantity": 0
  }, {
    "uid": "SG13",
    "productNumber": "item_number_public-13",
    "name": "Produkt mit vielen Bildern",
    "amount": {
      "currency": "EUR",
      "net": "25.21",
      "gross": "30.00",
      "tax": "4.79",
      "taxRate": "19.00"
    },
    "tags": [],
    "stockQuantity": 98
  }],
  "shop": { "name": "Offizieller Shopgate Testshop", "shop_number": "10006", "market_id": "DE" },
  "user": {
    "sessionId": "2034a73978bd4b5af547b82514dea39f",
    "loggedIn": true,
    "email": "carsten.schneider@shopgate.com",
    "phone": "12346",
    "birthday": "1989-09-09",
    "gender": "m"
  },
  "device": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
    "os": "Other",
    "type": "Phone",
    "access": "Web",
    "codebase": ""
  },
  "page": {
    "referrer": "http://testshop.schneider.localdev.cc/php/shopgate/item/534733",
    "name": "productList",
    "link": "http://testshop.schneider.localdev.cc/php/shopgate/category/3136/all?cat_id…egory=3+%E2%80%93+Darstellung+%28Text%2FBild%2Fetc.%29&sort=relevance_desc",
    "title": "3 – Darstellung (Text/Bild/etc.) - Offizieller Shopgate Testshop"
  },
  "tracking": { "get": [] }
};

const sgDataReviews = {
  "shop": {
    "name": "Offizieller Shopgate Testshop",
    "shop_number": "10006",
    "market_id": "DE"
  },
  "user": {
    "sessionId": "2034a73978bd4b5af547b82514dea39f",
    "loggedIn": true,
    "email": "carsten.schneider@shopgate.com",
    "phone": "12346",
    "birthday": "1989-09-09",
    "gender": "m"
  },
  "device": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
    "os": "Other",
    "type": "Phone",
    "access": "Web",
    "codebase": ""
  },
  "page": {
    "referrer": "http://testshop.schneider.localdev.cc/php/shopgate/item/5347313134",
    "name": "reviews",
    "link": "http://testshop.schneider.localdev.cc/php/shopgate/reviews/5347313134",
    "title": "Rezensionen - Produkt mit vielen Bewertungen - Offizieller Shopgate Testshop"
  },
  "tracking": { "get": [] }
};

const addedToCartProduct = {
  products: [{
    uid: 'SG6',
    productNumber: 'item_number_public-6',
    name: 'Produkt mit einem Sonderpreis',
    amount: {
      currency: 'EUR',
      taxRate: '19.00',
      net: '21.01',
      gross: '25.00',
      tax: '3.99',
    },
    tags: [],
    stockQuantity: 69,
    quantity: 1,
  }],
};

export { sgData, sgDataOrder, sgDataSearch, sgDataCategoryAll, sgDataProduct, sgDataCheckout, addedToCartProduct, product };
