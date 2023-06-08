
# Documentation for Brand register API

Git Link: https://github.com/srvpl/api-node-2/tree/register_brand

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

#### Brand register Schema
```
(
  {
    brand_name: {
      type: String,
    },
    trademark_office: {
      type: String,
    },
    trademark_reg_no: {
      type: String,
    },
    trademark_status: {
      type: String,
      enum: ["registered", "pending"],
      message: "trademark_status must have value of 'registered' or 'pending'",
    },
    trademark_type: {
      type: String,
      enum: ["word mark", "device mark"],
      message: "trademark_type must have value of 'word mark' or 'device mark'",
    },
    images: {
      type: Object,
      required: true,
    },
    seller: {
      type: Boolean,
      default: false,
    },
    vendor: {
      type: Boolean,
      default: false,
    },
    neither: {
      type: Boolean,
      default: false,
    },
    product_category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    ASINs_no: [
      {
        type: String,
      },
    ],
    url_brands_official_website: [
      {
        type: String,
      },
    ],
    sell_to_distributors: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    distributors_sell_on_amazone: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    product_distributed_to_country: {
      type: mongoose.Schema.Types.ObjectId,
    },
    license_information: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    is_license_sell_on_amazon: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  },
  { timestamps: true }
);
```
#### Register brand
```http
  POST http://localhost:3000/v1/brand-registration/registration/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:id`      | `string` | **Required**. Id of seller  |


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `"brand_name"`      | `string` | **Required**.|
| `"trademark_office"`      | `string` | **Require** |
| `"trademark_reg_no"`      | `string` | **Required**.  |
| `trademark_status`      | `string` | **Required**.enum: ["registered", "pending"] |
| `trademark_type`      | `string` | **Required**. enum: ["word mark", "device mark"]  |
| `seller`      | `Boolean` | **Required**. |
| `vendor`      | `Boolean` | **Required**.  |
| `neither`      | `Boolean` | **Required**.  |
| `product_category`| `string` | **Required**. Id of category  |
| `ASINs_no`      | `string` | **Required**.  |
| `product_distributed_to_country` | `string` | **Required**. Id of country  |
| `url_brands_official_website`      | `string` | **Required**.  |
| `sell_to_distributors`      | `string` | **Required**.  enum: ["yes", "no"] |
| `distributors_sell_on_amazone`      | `string` | **Required**.  enum: ["yes", "no"]  |
| `is_license_sell_on_amazon`      | `string` | **Required**.  enum: ["yes", "no"]   |
| `images`      | `string` | **Required**. |

##### Request Body for Brand registration :
```
{
      "brand_name":"Canon",
      "trademark_office":"India - Trademark Registry - TMR",
      "trademark_reg_no":"4533211",
      "trademark_status":"registered",
      "trademark_type":"word mark",
      "seller":"true",
      "ASINs_no":["HAGSDGSDF","FSDFSHFSGF"],
      "product_category":["647d7f98ab4b30b8ff95156f","647d7f74ab4b30b8ff951565"],
      "url_brands_official_website":["https://in.canon/en/consumer"],
      "sell_to_distributors":"yes",
      "distributors_sell_on_amazone":"no",
      "product_distributed_to_country":"645c9628413bc82024d7861e",
      "license_information":"yes",
      "is_license_sell_on_amazon":"yes",
      "images": ""
 }    
```
#### Get Brand registration data
```http
   POST localhost:3000/v1/brand-registration/get_registration-data
```

#### Get Brand registration data Id 
```http
   POST localhost:3000/v1/brand-registration/get_registration-data/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:id`      | `string` | **Required**. Id of coupon to fetch |


