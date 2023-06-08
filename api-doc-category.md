
# Documentation for Categories API

Git Link: https://github.com/srvpl/api-node-1/tree/category-route

# Install Packages
```
yarn
```
or
```
npm i
```

# Optional (Only if using new DB)
### Run seed scripts to enter attributes data
```
yarn seed-attribute
```

# Launch Server
```
yarn dev
```

## Schema Models

#### Category Schema
```
{
    category_slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active',
        required: function () {
            return this.category_type === "child"
        },
    },
    category_name: { type: String, required: true, trim: true },
    category_desc: { type: String, required: true },
    category_type: {
        type: String,
        enum: {
            values: ['parent', 'sub', 'child'],
            message: "category_type must have value of 'parent', 'sub' or 'child'",
        },
        required: true,
    },
    parent_category_id: {
        type: String,
        ref: "categories",
        required: function () {
            return this.category_type === "sub" || this.category_type === "child"
        }
    },
    sub_category_id: {
        type: String,
        ref: "categories",
        required: function () {
            return this.category_type === "child"
        }
    }
}
```
#### Category Attributes Schema
```
{
    attribute_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: "attributes"
    },
    category_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: "categories"
    },
    required: { type: Boolean },
    recommended: { type: Boolean }
}
```


#### Attributes Schema
```
{
    attribute_slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    attribute_name: { type: String, required: true, trim: true },
    attribute_group_slug: { type: String, required: true, trim: true, lowercase: true},
    attribute_group_name: { type: String, trim: true },
    attribute_desc: {type: String, trim: true},
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active'
    },
    input_type: {type: String, default: "input"},
    data_type: {type: String, default: "string"}
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

#### Get all categories

```http
  GET localhost:3000/v1/categories/get
```
##### Request Query for optional pagination:
```http
  GET localhost:3000/v1/categories/get?page=1&limit=10
```

#### Get all categories with parent and sub categories populated
```http
  GET localhost:3000/v1/categories/get-populated
```
##### Request Query for optional pagination:
```http
  GET localhost:3000/v1/categories/get-populated?page=1&limit=10
```

#### Get category by Id

```http
  GET localhost:3000/v1/categories/get/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of category to fetch |


#### Get category by Id with parent and sub categories populated

```http
  GET localhost:3000/v1/categories/get-populated/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of category to fetch |

#### Add category
```http
  POST localhost:3000/v1/categories/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**.  |
| `category_name`      | `string` | **Required**.  |
| `category_desc`      | `string` | **Required**.  |

##### Request Body for parent category:
```
{
    "category_slug": "men",
    "category_name": "Men",
    "category_desc": "Items regarding Men",
    "category_type": "parent"
}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `category_type`      | `string` | **Required**. Has to be 'parent'  |

##### Request Body for sub category:
```
{
    "category_slug": "fashion",
    "category_name": "Fashion",
    "category_desc": "Items regarding Fashion",
    "category_type": "sub"
    "parent_category_id": "644fbbf86bc09d0590506878"
}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `category_type`      | `string` | **Required**. Has to be 'sub' |
| `parent_category_id`      | `array` | **Required**. References id of 'categories' schema |

##### Request Body for child category with associated attributes:
```
{
    "category_slug": "watches",
    "category_name": "Watches",
    "category_desc": "Items regarding Watches",
    "category_type": "child"
    "parent_category_id": "644fbbf86bc09d0590506878",
    "sub_category_id": "644f7938940b6926aceae0c0"
}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `category_type`      | `string` | **Required**. Has to be 'child' |
| `parent_category_id`      | `array` | **Required**. References id of 'categories' schema |
| `sub_category_id`      | `array` | **Required**. References id of 'categories' schema |

#### Edit category by Id
```http
  POST localhost:3000/v1/categories/edit/:id
```

##### Request Body with attributes to edit:
```
{
    "status": "archived"
}
```

#### Remove category by Id
```http
  POST localhost:3000/v1/categories/remove/:id
```

#### Get category with filter and sort
```http
  GET localhost:3000/v1/categories/get?filter[field][operator]=value&sort[field]=value
```
#### Example: localhost:3000/v1/categories/get?filter[category_type][$eq]=child&sort[_id]=-1


#### Get category with select fields
```http
  GET localhost:3000/v1/categories/get?fields=field1,field2
```
#### Example: localhost:3000/v1/categories/get?fields=category_type,category_desc


#### Get count of parent, sub, child category
```http
  GET localhost:3000/v1/categories/get/count
```


#### Get all attributes

```http
  GET localhost:3000/v1/attributes/get
```
##### Request Query for optional pagination:
```http
  GET localhost:3000/v1/attributes/get?page=1&limit=10
```

#### Get attribute by Id

```http
  GET localhost:3000/v1/attributes/get/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of attribute to fetch |


#### Add attribute
```http
  POST localhost:3000/v1/attributes/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `attribute_slug`      | `string` | **Required**.  |
| `attribute_name`      | `string` | **Required**.  |
| `attribute_group_slug`      | `string` | **Required**.  |
| `attribute_group_name`      | `string` | **Required**.  |

##### Request Body:
```
{
    attribute_slug: "manufacturer_vital_info",
    attribute_name: "Manufacturer",
    attribute_group_slug: "vital_info",
    attribute_group_name: "Vital Info",
    status: "active"
}
```

#### Edit attribute by id
```http
  POST localhost:3000/v1/attributes/edit/:id
```
##### Request Body with attributes to update:
```
{
    "attribute_group_slug": "vital_info"
    "attribute_group_name": "Vital Info"
}
```

#### Remove attribute by id
```http
  POST localhost:3000/v1/attributes/remove/:id
```

#### Get attribute with filter and sort
```http
  GET localhost:3000/v1/attributes/get?filter[field][operator]=value&sort[field]=value
```
#### Example: localhost:3000/v1/attributes/get-attribute?filter[attribute_group][$eq]=Vital Info&sort[_id]=-1

#### Get attribute with select fields
```http
  GET localhost:3000/v1/attributes/get?fields=field1,field2
```
#### Example: localhost:3000/v1/attributes/get-attribute?fields=attribute_name,attribute_group



#### Get all category-attributes

```http
  GET localhost:3000/v1/category-attributes/get
```
##### Request Query for optional pagination:
```http
  GET localhost:3000/v1/category-attributes/get?page=1&limit=10
```

#### Get category-attribute by Id

```http
  GET localhost:3000/v1/category-attributes/get/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of attribute to fetch |


#### Add category-attribute
```http
  POST localhost:3000/v1/category-attributes/add/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `category_id`      | `string` | **Required**. References id of 'categories' schema. |
| `attribute_id`      | `string` | **Required**. References id of 'attributes' schema. |
| `required`      | `string` |  Boolean value for required flag |
| `recommended`      | `string` |  Boolean value for recommended flag |

##### Request Body:
```
{
    "attribute_id": "64535ff345d2920e20c5bbb1",
    "category_id": "645364b3cf072300345f0444",
    "required": "true",
    "recommended": "false"
}
```

#### Add multiple category-attributes
```http
  POST localhost:3000/v1/category-attributes/add-many
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `category_id`      | `string` | **Required**. References id of 'categories' schema. |
| `attribute_id`      | `string` | **Required**. References id of 'attributes' schema. |
| `required`      | `string` |  Boolean value for required flag |
| `recommended`      | `string` |  Boolean value for recommended flag |

##### Request Body:
```
[
    {
        "attribute_id": "64535ff345d2920e20c5bbb3",
        "category_id": "645364b3cf072300345f0444",
        "required": "true",
        "recommended": "false"
    },
    {
        "attribute_id": "64535ff345d2920e20c5bbb4",
        "category_id": "645364b3cf072300345f0444",
        "required": "true",
        "recommended": "false"
    }
]
```

#### Edit category-attribute by id
```http
  POST localhost:3000/v1/category-attributes/edit/:id
```
##### Request Body with attributes to update:
```
{
    "recommended": "true"
}
```

#### Remove category-attribute by id
```http
  POST localhost:3000/v1/category-attributes/remove/:id
```

#### Get category-attribute with filter and sort
```http
  GET localhost:3000/v1/category-attributes/get?filter[field][operator]=value&sort[field]=value
```
#### Example: localhost:3000/v1/category-attributes/get?filter[category_id][$eq]=645364b3cf072300345f0444&sort[_id]=-1

#### Get category-attribute with select fields
```http
  GET localhost:3000/v1/category-attributes/get?fields=field1,field2
```
#### Example: localhost:3000/v1/category-attributes/get?fields=attribute_id,category_id


#### Get all category-attributes with category and attribute ids populated

```http
  GET localhost:3000/v1/category-attributes/get-populated
```


#### Get category-attribute by Id with category and attribute ids populated populated

```http
  GET localhost:3000/v1/categories/get-populated/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of category-attribute to fetch |


#### Get all attribute-groups

```http
  GET localhost:3000/v1/attribute-groups/get
```
##### Request Query for optional pagination:
```http
  GET localhost:3000/v1/attribute-groups/get?page=1&limit=100
```

#### Get attribute-groups by Id

```http
  GET localhost:3000/v1/attribute-groups/get/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of attribute to fetch |


#### Add attribute-group
```http
  POST localhost:3000/v1/attribute-groups/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `group_slug`      | `string` | **Required**. Name of the group in slug form |
| `group_name`      | `string` | **Required**. Name of the group |
| `group_desc`      | `string` | Description of the group |

##### Request Body:
```
{
    "group_slug": "vital_info",
    "group_name": "Vital Info",
    "group_desc": "Description of the group"
}
```


#### Edit attribute-group by id
```http
  POST localhost:3000/v1/attribute-groups/edit/:id
```
##### Request Body with attributes to update:
```
{
    "status": "archived"
}
```

#### Remove attribute-group by id
```http
  POST localhost:3000/v1/attribute-groups/remove/:id
```

#### Get attribute-group with filter and sort
```http
  GET localhost:3000/v1/attribute-groups/get?filter[field][operator]=value&sort[field]=value
```
#### Example: localhost:3000/v1/attribute-groups/get?page=1&limit=300&filter[group_slug][$eq]=vital_info&sort[_id]=-1

#### Get attribute-group with select fields
```http
  GET localhost:3000/v1/attribute-groups/get?fields=field1,field2
```
#### Example: localhost:3000/v1/attribute-groups/get?fields=group_slug,group_name&page=1&limit=300

