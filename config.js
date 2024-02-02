const { z } = require("zod");

const validateProduct = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

const validateVarient = z.object({
  name: z.string(),
  sku: z.string(),
  additionalCost: z.number(),
  stockCount: z.number(),
});

const validateVarientArray = z.array(validateVarient);

module.exports = {
  validateProduct,
  validateVarient,
  validateVarientArray,
};
