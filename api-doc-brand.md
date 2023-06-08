# Documentation for Brands API 
Git Link: https://github.com/srvpl/api-node-2/tree/brandApi

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

#### Brand Schema
```
{
    seller_id: {
      type: mongoose.Types.ObjectId, ref: "sellers",
      required: true
    },
    brand_name: {
      type: String,
      required: true
    },
    brand_logo_url: {
        type: String,
        required: true
    },
    brand_desc: {
        type: String,
        required: true
    }
}
```

#### Get all brands for seller
```http
    GET localhost:3000/v1/brand/getBrand/:seller_id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `seller_id`      | `string` | **Required**.  |


#### Create brand
```http
    POST localhost:3000/v1/brand/createBrand
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `seller_id`      | `string` | **Required**.  |
| `brand_name`      | `string` | **Required**.  |
| `brand_logo_url`      | `string` | **Required**.  |
| `brand_desc`      | `string` | **Required**.  |

##### Request Body for createBrand:
```
{
    "seller_id": "S126",
    "brand_name": "Dell",
    "brand_logo_url": "url.net.com",
    "brand_desc":"very nice prod"
}
```


#### Update brand by id
```http
    PUT localhost:3000/v1/brand/updateBrand
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**.  |
| `brand_logo_url`      | `string` | **Required**. (if brand_desc is not given) |
| `brand_desc`      | `string` | **Required**. (if brand_logo_url is not given) |


##### Request Body for updateCart:
```
{
    "_id": "645b3790bc6eb6d8b0157992",
    "brand_desc": "Product is light wight"
}
```


#### Delete brand by id
```http
    DELETE localhost:3000/v1/brand/deleteBrand
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**.  |

##### Request Body for deleteBrand:
```
{
    "_id": "6459de254f02f711bc8ce295"
}
```
