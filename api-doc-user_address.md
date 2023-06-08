# Documentation for User multiple address (Checkout) API
Git Link : https://github.com/srvpl/api-node-2/tree/order_table-coupon-user_address
# Install Packages
```
yarn
```
or
```
npm i
```
# Run server
```
yarn dev
```
## Schema Models

#### User Address Schema
```
({
    userId: {
      type: String
    },
    adressType:{
      type: String,
      enum: ["Home","Office","Others"],
    },
    country:{
      type:String
    },
    name: {
      type: String,
    },
    mobile: {
      type: String,
    },
    alterNativeMobile: {
      type: String,
    },
    pincode: {
      type: String,
    },
    house_address: {
      type: String,
    },
    area_address: {
      type: String,
    },
    landmark: {
      type: String,
    },
    city: {
      type: String,
    },
    delevery_instruction:{
    type:string
    },
    state: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createOn: {
      type: Date,
      default: new Date(),
    },
    updateOn: {
      type: Date,
      default: new Date(),
    },
  })
```
#### Add User Address
```http
  POST localhost:3000/v1/u-address/add-new-address
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `"userId"`      | `string` | **Required**. References id of 'user' schema  |
| `adressType`      | `string` | **Required**. enum: ["Home","Office","Others"]  |
| `country`      | `string` | **Required**.  |
| `name`      | `string` | **Required**.  |
| `mobile`      | `string` | **Required**.  |
| `alterNativeMobile`      | `string` | **Required**.  |
| `pincode`      | `string` | **Required**.  |
| `house_address`      | `string` | **Required**.  |
| `area_address`      | `string` | **Required**.  |
| `landmark`      | `string` | **Required**.  |
| `city`      | `string` | **Required**.  |
| `state`      | `string` | **Required**.  |
| `delevery_instruction`      | `string` | **Required**.  |

##### Request Body for add address:
```
{
    "userId":"6458c5c2ba7ae9361c20f132", 
    "adressType":"Home",
    "country":"india",
    "name":"Rahul",
    "mobile":"9800506702",
    "alterNativeMobile":"9800506706",
    "pincode":"629497",
    "house_address":"sector v",
    "area_address" : "sector v",
    "landmark" : "kolkata",
    "city": "kolkata",
    "state" : "WB",
    "delevery_instruction":"instructions............",
    "addressType":"Office",
    "isDefault":"isDefault"
}
```
#### Get User Address by User Id
```http
  GET localhost:3000/v1/u-address/single-address/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:id`      | `string` | **Required**. Id of address to fatch |

#### Get User Address by User Id
```http
  GET localhost:3000/v1/u-address/get-all-add/:userId
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:userId`      | `string` | **Required**. Id of user to fetch |

#### Get User Address by User Id with limit
```http
  GET http://localhost:3000/v1/u-address/get-add-limit/:userId?limit=1
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:userId`      | `string` | **Required**. Id of user to fetch |?limit=1

#### Make default Address by Id
```http
  POST http://localhost:3000/v1/u-address/default-address/:userId/:id
```

#### Update User Address Id
```http
  POST //localhost:3000/v1/u-address/update-add/:userId/:id
```
##### Request Body with attributes to update:
```
{
    "recommended": "true"
}
```
#### remove User Address 
```http
  DELETE localhost:3000/v1/u-address/delete-address/:id
```


