# Documentation for Award , Country and state details API
Git Link:https://github.com/srvpl/api-node-2/tree/Award_and_Country_Table

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

#### render.com link 
```
  https://country-award-state.onrender.com
```


#### Award details Schema 
```
{
  award_name: {
    type: String,
  },
  image: {
    type: String,
  },
  image_public_id: {
    type: String,
  },
  award_description: {
    type: String,
  },
  country: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}
```

## Award Reference

#### Get Award data
```http
GET localhost:3000/v1/award/all-awards
```
#### Get Award Details by Id
```http
GET localhost:3000/v1/award/single-award/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of Award to fetch |


#### Get count of products by award
```http
  GET localhost:3000/v1/product-awards/get-count
```

#### Add award Details
```http
POST localhost:3000/v1/award/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `award_name`      | `string` | **Required**.  |
| `award_description`      | `string` | **Required**.  |
| `country`      | `string` | **Required**.  |
| `image`      | `string` | **Required**.  |

##### Request Body:
```
{
     "award_name":"test",
     "award_description":"test description",
     "country":"test",
     "image":"URI link"
}
```

#### Edit Award details-attribute by id
```http
  POST http://localhost:3000/v1/award/update/:id
```
##### Request Body with attributes to update:
```
{
    "recommended": "true"
}
```
#### Remove Award details-attribute by id
```http
  DELETE localhost:3000/v1/award/delete/:id
```

#### Country details Schema 
```
{
  country_name: {
    type: String,
  },
  image: {
    type: String,
  },
  image_public_id: { type: String },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}
```

## API Reference


#### Get Country data
```http
GET localhost:3000/v1/country/all-country
```
#### Get Country Details by Id
```http
GET localhost:3000/v1/country/single-country/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of Country to fetch |

#### Add Country Details
```http
POST localhost:3000/v1/country/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `country_name`      | `string` | **Required**.  |
| `image`      | `string` | **Required**.  |

##### Request Body:
```
{
    "country_name":"india",
    "image":"image URI link"
}
```

#### Edit Country details-attribute by id
```http
  POST localhost:3000/v1/country/update/:id
```
##### Request Body with attributes to update:
```
{
    "recommended": "true"
}
```
#### Remove Country details-attribute by id
```http
  DELETE localhost:3000/v1/country/delete/:id
```

#### State details Schema 
```
{
  country_id: {
    type: mongoose.Types.ObjectId, 
    ref: 'countries'
  },
  state_name: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}
```

## State API Reference
#### Get State data by Country
```http
GET localhost:3000/v1/state/single-state/:country_Id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:country_Id`      | `ObjectId` | **Required**. Id of Country from countrySchema |

#### Get all State Details
```http
GET localhost:3000/v1/state/all-state
```

#### Add State Details
```http
POST localhost:3000/v1/state/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `country_Id`      | `ObjectId` | **Required**.from country table  |
| `state_name`      | `string` | **Required**.  |

##### Request Body:
```
{
    "country_Id":"645a3b03bb55883df45062d7",
    "state_name":"UK"
}

```

#### Edit state details-attribute by id
```http
  POST localhost:3000/v1/state/update/:id
```
##### Request Body with attributes to update:
```
{
    "recommended": "true"
}
```
#### Remove state details-attribute by id
```http
  DELETE localhost:3000/v1/state/delete/:id
```
