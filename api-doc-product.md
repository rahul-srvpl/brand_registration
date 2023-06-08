
# Documentation for Inventory API

Git Link: <https://github.com/srvpl/api-node-1/tree/products-route>

# Install Packages

```
yarn
```

or

```
npm i
```

# Launch Server

```
yarn dev
```

## Schema Models

#### Products Schema

```
{
    product_sku: { type: String, unique: true, required: true },
    product_external_id: { type: String, unique: true, required: true },
    product_external_id_type: { type: String, required: true },
    item_name: { type: String, required: true },
    brand_id: { type: mongoose.Types.ObjectId, ref: 'brands' },
    has_brand: { type: Boolean, default: true },
    child_category_id: { type: mongoose.Types.ObjectId, ref: 'categories' },
    sub_category_id: { type: mongoose.Types.ObjectId, ref: 'categories' },
    parent_category_id: { type: mongoose.Types.ObjectId, ref: 'categories' },
    seller_id: { type: mongoose.Types.ObjectId, ref: 'sellers' },
    country_id: { type: mongoose.Types.ObjectId, ref: 'countries' },
    awards: [{ type: mongoose.Types.ObjectId, ref: 'awards' }],
    has_variations: { type: Boolean, default: false },
    item_condition: {
        type: String,
        enum: ['new', 'old'],
        default: 'new'
    },
    sgst: { type: Number, min: 0 },
    cgst: { type: Number, min: 0 },
    status: {
        type: String,
        enum: ['active', 'draft', 'inactive'],
        default: 'draft'
    },
    parent_child: {
        type: String,
        enum: ['parent', 'child'],
        default: 'parent'
    },
    condition: {
        type: String,
        enum: ['new', 'refurbished'],
        default: 'new'
    },
    parent_id: {
        type: mongoose.Types.ObjectId, ref: "products"
    },
    variation_name1: {
        type: String
    },
    variation_value1: {
        type: String
    },
    variation_name2: {
        type: String
    },
    variation_value2: {
        type: String
    },
    list_price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        min: 0,
        get: getter
    },
    max_retail_price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        min: 0,
        get: getter
    },
    sale_price: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        get: getter
    },
    approval_status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    review_status: {
        type: String,
        enum: ['pending', 'reviewed'],
        default: 'pending'
    },
    awards: { type: [mongoose.Types.ObjectId] }
}
```

#### Product Images Schema

```
{
    product_id: {
        type: mongoose.Types.ObjectId, required: true, unique: true,
        ref: "products",
    },
    main_img: { type: String },
    img_2: { type: String },
    img_3: { type: String },
    img_4: { type: String },
    img_5: { type: String },
    img_6: { type: String },
    img_7: { type: String },
    img_8: { type: String },
    main_img_public_id: { type: String },
    img_2_public_id: { type: String },
    img_3_public_id: { type: String },
    img_4_public_id: { type: String },
    img_5_public_id: { type: String },
    img_6_public_id: { type: String },
    img_7_public_id: { type: String },
    img_8_public_id: { type: String }
}
```

## API query usage: Filter, Sort, Pagination, Select, Populate

Example:

```js
GET /invoices?fields=number,amount&filter[name]=Bob
&filter[amount][$gte]=1200&include=customer,items
&fields[customer]=name,number&fields[items]=name,price
&page=1&limit=10&sort[number]=1&sort[amount]=-1
```

Will be parsed into:

```js
{
  filter: { name: "Bob", amount: { $gte: 1200 } },
  paginate: { limit: 10, skip: 0, page: 1 },
  populate: [
   { path: "customer", select: { name: 1, number: 1 } },
   { path: "items", select: { name: 1, price: 1 } }
  ],
  select: { number: 1, amount: 1 },
  sort: { number: 1, amount: -1 }
}
```

Where:

- `filter` : Is valid `mongoose` criteria and can be passed to `find()`
- `paginate` : Contains paging details that can be passed to `limit()`, `skip()`
- `populate` : Is valid `mongoose` populate option and can be passed to `populate()`
- `select` : Is valid `mongoose` project options and can be passed to `select()`
- `sort` : Is valid `mongoose` sort options and can be passed to `sort()`

## Querying

>When passing values as objects or arrays in URLs, they must be valid JSON

### Sort

```js
GET /customers?sort=name
GET /customers?sort=-name
GET /customers?sort={"name":1}
GET /customers?sort={"name":1, "email":-1}

or

GET /customers?sort=name
GET /customers?sort=-name
GET /customers?sort[name]=1&sort[email]=-1
```

### Page

```js
GET /customers?page=1
GET /customers?page=1&limit=10
```

### Skip

```js
GET /customers?skip=10
```

### Limit

Only overrides `maximum limit option set by the plugin` if the queried limit is lower

```js
GET /customers?limit=10
```

### Query or Filters

Supports all [mongodb operators](https://www.mongodb.com/docs/manual/reference/operator/query/) `($regex, $gt, $gte, $lt, $lte, $ne, etc.)`

```js
GET /customers?query={"name":"Bob"}
GET /customers?query={"name":{"$regex":"/Bo$/"}}
GET /customers?query={"age":{"$gt":12}}
GET /customers?query={"age":{"$gte":12}}

or

GET /customers?filter[name]=Bob
GET /customers?filter[name][$regex]="/Bo$/"
GET /customers?filter[age][$gt]=12
GET /customers?filter[age][$gte]=12
```

### Populate or Include

Works with create, read and update operations

```js
GET /invoices?populate=customer
GET /invoices?populate={"path":"customer"}
GET /invoices?populate=[{"path":"customer"},{"path":"products"}]

or

GET /invoices?include=customer
GET /invoices?include[customer]=name,number&includes[items]=name,price
GET /invoices?include=customer,items&fields[customer]=name,number&fields[items]=name,price
```

### Select or Fields

`_id` is always returned unless explicitely excluded

```js
GET /customers?select=name
GET /customers?select=-name
GET /customers?select={"name":1}
GET /customers?select={"name":0}

or

GET /customers?fields=name
GET /customers?fields=-name
GET /customers?fields=name,email
GET /invoices?include=customer&fields[customer]=name
```

## API Reference

#### Add Product

```http
  POST localhost:3000/v1/products/add
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_sku`      | `string` | **Required**.  |
| `product_external_id`      | `string` | **Required**.  |
| `product_external_id_type`      | `string` | **Required**.  |
| `item_name`      | `string` | **Required**.  |
| `category_id`      | `string` | **Required**.  |
| `seller_id`      | `string` | **Required**.  |
| `country_id`      | `string` | **Required**.  |

##### Request Body for product

```
{
    "product_sku": "1234787",
    "product_external_id": "1234878",
    "product_external_id_type": "ASIN",
    "item_name": "Toy",
    "brand_id": "645df7b262ac653eace3d93e",
    "category_id": "645f568d995f3d003270180c",
    "seller_id": "645df7b262ac653eace3d93e",
    "has_variations": "true",
    "list_price": "12000",
    "retail_price": "11599"
}
```

#### Edit Product

```http
  POST localhost:3000/v1/products/edit/:id
```

##### Example Request Body with attributes to be edited/added

```
{
    "status": "inactive"
}
```

#### Get All Product

```http
  GET localhost:3000/v1/products/get
```

#### Get Product by id

```http
  GET localhost:3000/v1/products/get/:id
```

#### Remove Product by id

```http
  POST localhost:3000/v1/products/remove/:id
```

#### Get All Product with filter and sort

```http
  GET localhost:3000/v1/products/get?filter[field][operator]=value&sort[field]=value
```

#### Example: localhost:3000/v1/inventory/get-inventory?filter[product_sku][$eq]=106

#### Get products with select fields

```http
  GET localhost:3000/v1/products/get?fields=field1,field2
```

#### Example: localhost:3000/v1/products/get?fields=product_sku,item_name

#### Add Product-variations (creates new product with additional variation details)

```http
  POST localhost:3000/v1/products/add-variation
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `parent_id`      | `string` | **Required**. Id of the parent product |
| `variation_data`      | `string` | **Required**. Array of variations |

##### Request Body for add variation

```
{
    "parent_id": "6470651e2a79a38135c83e48",
    "variation_data": [
        {
            "product_sku": "066787",
            "product_external_id": "46799",
            "product_external_id_type": "ASIN",
            "item_condition": "new",
            "list_price": 2000,
            "max_retail_price": 2001,
            "qty": 5,
            "variation_name1": "color",
            "variation_value1": "red",
            "variation_name2": "style",
            "variation_value2": "style 1",
            "offer_start_date_offer": "2023-03-25T12:00:00-06:30",
            "offer_end_date_offer": "2023-05-25T12:00:00-06:30"
        },
        {
            "product_sku": "111224",
            "product_external_id": "6488",
            "product_external_id_type": "ASIN",
            "item_condition": "new",
            "list_price": 2000,
            "max_retail_price": 2001,
            "qty": 5,
            "variation_name1": "color",
            "variation_value1": "red",
            "variation_name2": "style",
            "variation_value2": "style 1",
            "offer_start_date_offer": "2023-03-25T12:00:00-06:30",
            "offer_end_date_offer": "2023-05-25T12:00:00-06:30"
        }
    ]
}
```

#### Add Product Images

```http
  POST localhost:3000/v1/product-images/add
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_id`      | `string` | **Required**.  |

##### Request Body for product images

```
{
  product_id: "6464cfb9704d3f191c9f7c81"
  main_img: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_2: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_3: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_4: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_5: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_6: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_7: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_8: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4..."
}


#### Edit Product Images
```http
  POST localhost:3000/v1/product-images/edit/:productId
```

##### Request Body for editing product images: (only need to post attributes with changed values)

```
{
  img_4: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_5: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4...",
  img_8: "data:image/webp;base64,UklGRsrKAQBXRUJQVlA4..."
}


#### Get Images for product by product id:
```http
  GET localhost:3000/v1/product-images/get/product/:productId
```

#### Example: localhost:3000/v1/product-images/get/product/100000111111

#### Upload award certificate

```http
  POST localhost:3000/v1/product-awards/upload
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `award_cert`      | `file` | **Required**.  |

##### Form data for award certificate

```
award_cert : path to file
```

#### Get All products page for B2C

```http
  GET localhost:3000/v1/products/get-all-products
```

#### Get single product page for B2C by product id

```http
  GET localhost:3000/v1/products/get-product/:id
```

#### Get All products page for B2B

```http
  GET localhost:3000/v1/products/get-all-products-b2b
```

#### Get single product page for B2B by product id

```http
  GET localhost:3000/v1/products/get-product-b2b/:id
```


#### Get all variaitons for a product by variation group id

```http
  GET localhost:3000/v1/variations/get-variations?filter[variation_group_id][$eq]={ObjectId}
```
#### Example: localhost:3000/v1/variations/get-variations?filter[variation_group_id][$eq]=64782a5eb803b3330b6f7d5b
