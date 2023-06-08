const variationSchema = {
  type: 'object',
  properties: {
    product_id: {
      type: 'string',
      format: 'uuid',
      required: true,
    },
    variation_group_id: {
      type: 'string',
      format: 'uuid',
      required: true,
    },
    variation_name1: {
      type: 'string',
    },
    variation_value1: {
      type: 'string',
    },
    variation_name2: {
      type: 'string',
    },
    variation_value2: {
      type: 'string',
    },
  },
  required: ['product_id', 'variation_group_id'],
};

module.exports = variationSchema;
