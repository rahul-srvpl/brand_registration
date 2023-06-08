
# Documentation for Inventory API

Git Link: https://github.com/srvpl/api-node-1/tree/products-route

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

#### Inventory Schema
```
{
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft', 'unlisted', 'supressed'],
        default: 'active'
    },
    product_id: {
        type: mongoose.Types.ObjectId, unique: true,
        ref: "products",
    },
    parent_product_id: {
        type: mongoose.Types.ObjectId,
        ref: "products",
    },
    parent_child: {
        type: String,
        enum: ['parent', 'child'],
        default: 'parent'
    },
    seller_id: {
        type: String, required: true,
        ref: "sellers",
    },
    qty_available: { type: Number, min: 0, default: 0 },
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
    business_price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        min: 0,
        get: getter
    },
    business_discount_type: {
        type: String,
        enum: ['percent', 'fixed', null],
        default: null
    },
    min_qty1: {
        type: Number, min: 0,
    },
    max_qty1: {
        type: Number, min: 0,
    },
    min_qty2: {
        type: Number, min: 0,
    },
    max_qty2: {
        type: Number, min: 0,
    },
    min_qty3: {
        type: Number, min: 0,
    },
    max_qty3: {
        type: Number, min: 0,
    },
    percent_off1: {
        type: Number, min: 0,
    },
    percent_off2: {
        type: Number, min: 0,
    },
    percent_off3: {
        type: Number, min: 0,
    },
    fixed_price1: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        get: getter
    },
    fixed_price2: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        get: getter
    },
    fixed_price3: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        get: getter
    }
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

#### Get all inventory

```http
  GET localhost:3000/v1/inventory/get
```


##### Request Query for optional pagination:
```http
  GET localhost:3000/v1/inventory/get?page=1&limit=10
```


#### Get inventory by Id

```http
  GET localhost:3000/v1/inventory/get/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of inventory to fetch |



#### Edit inventory by Id
```http
  POST localhost:3000/v1/inventory/edit/:id
```

##### Request Body with attributes to edit:
```
{
    "max_retail_price": 12999
}
```

#### Remove inventory by Id
```http
  POST localhost:3000/v1/inventory/remove/:id
```

#### Get inventory with filter and sort
```http
  GET localhost:3000/v1/inventory/get?filter[field][operator]=value&sort[field]=value
```
#### Example: localhost:3000/v1/inventory/get?filter[status][$eq]=active&sort[price_shipping_cost]=-1
#### Example: localhost:3000/v1/inventory/get?filter[createdAt][$gte]=2022-12-31&filter[createdAt][$lte]=2024-12-31
#### Example: localhost:3000/v1/inventory/get?filter[product_id][$eq]=106

#### Get inventory with select fields
```http
  GET localhost:3000/v1/inventory/get?fields=field1,field2
```
#### Example: localhost:3000/v1/inventory/get?fields=product_id,seller_id


#### Get inventory page with only approved products
```http
  GET localhost:3000/v1/inventory/get-page?filter[status][$eq]=active&page=1&limit=20&sort[createdAt]=1
```


#### Get single inventory with only approved products by inventory id
```http
  GET localhost:3000/v1/inventory/get-page/:id
```
