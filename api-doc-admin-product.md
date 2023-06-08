
# Documentation for Inventory API

Git Link: https://github.com/srvpl/api-node-2/tree/test

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


#### Get Admin panel all products list
```http
  GET localhost:3000/v1/products/get-products-list/id
```

#### Get Admin panel all products list with filters (filtered by id of field-value)
```http
  GET localhost:3000/v1/products/get-products-list/id?filter[approval_status][$eq]=approved&filter[review_status][$eq]=reviewed&award={ObjectId}&seller={ObjectId}&country={ObjectId}&parent_category={ObjectId}&sub_category={ObjectId}&child_category=={ObjectId}
```

#### Get Admin panel all products list with filters (filtered by name of field-value)
```http
  GET localhost:3000/v1/products/get-products-list/name?filter[approval_status][$eq]=approved&filter[review_status][$eq]=reviewed&award={name}&seller={name}&country={name}&parent_category={name}&sub_category={name}&child_category=={name}
```

#### List of filter parameters
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `country`      | `ObjectId` | Id of selected country |
| `award`      | `ObjectId` | Id of selected award |
| `seller`      | `ObjectId` | Id of seller |
| `parent_category`      | `ObjectId` | Id of selected parent_category |
| `sub_category`      | `ObjectId` | Id of selected sub_category |
| `child_category`      | `ObjectId` | Id of selected child_category |
| `approval_status`      | `string` | string value of required approval status |
| `review_status`      | `string` | string value of required review status |