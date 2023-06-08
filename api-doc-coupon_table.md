# Documentation for Copon table API
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

#### Coupon Schema
```
const couponSchema = new mongoose.Schema({
  coupon_code: {
    type: String,
  },
  category_type: {
    type: String,
    enm: ["parent", "sub", "child", "hole webside"],
  },
 category:{type: String,},

  discount_type:{
    type:String,
    enm:['percentage','amount']
  },
  discount:{
    type:String
  },
  quantity_type:{
    type:String,
    enm:['limited','unlimited']
  },
  quantity:{
    type:Number
  },
  start_date:{
    type:String
  },
  end_date:{
    type:String
  },
  isActive:{
    type:Boolean,
    default:false
  },
  usedCount:{
    type:Number,
    default:0
  }
},{timestamps:true});
```
#### Create Coupon
```http
  POST http://localhost:3000/v1/coupon/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `"coupon_code"`      | `string` | **Required**.|
| `"category_type"`      | `string` | **Required**. enm:["parent","sub","child","hole website"]  |
| `"category"`      | `string` | **Required**.  |
| `discount_type`      | `string` | **Required**. |
| `discount`      | `string` | **Required**.  |
| `quantity_type`      | `string` | **Required**.enm:["limited","unlimited"]  |
| `quantity`      | `string` | **Required**.  |
| `start_date`      | `string` | **Required**.  |
| `end_date`      | `string` | **Required**.  |

##### Request Body for create coupon :
```
{
    "coupon_code": "REDX",
    "category_type": "child",
    "category":"child",
    "discount_type": "percentage",
    "discount": "20%",
    "quantity_type": "limited",
    "quantity": "200",
    "start_date": "01/01/23",
    "end_date": "02/02/23"
}
```
#### Get coupon data by populate
```http
  GET localhost:3000/v1/coupon/get-All-category-populated
```

#### Get coupon data by populate by coupon Id 
```http
  GET localhost:3000/v1/coupon/get-category-populated/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:id`      | `string` | **Required**. Id of coupon to fetch |


#### Update Coupon by Id
```http
  POST localhost:3000/v1/coupon/update-coupon/:id
```
##### Request Body with attributes to update:
```
{
    "recommended": "true"
}
```
#### remove Coupon Data 
```http
  DELETE //localhost:3000/v1/coupon/delete/:id
```
#### active coupon status
```http
POST localhost:3000/v1/coupon/activate-coupon/:id
```
```
{
    "isActive": "true"
}
```

#### Search Coupon data
```http
POST localhost:3000/v1/coupon/search
```
```
{
    "couponCode":"R"
}
```
#### view Coupon data by paginate
```http
localhost:3000/v1/coupon/paginate-coupon?page=1&pageSize=10
```


