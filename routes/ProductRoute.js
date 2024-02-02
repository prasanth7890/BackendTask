const express = require("express");
const router = express.Router();

const {
  allProducts,
  createProduct,
  singleProduct,
  updateProduct,
  deleteProduct
} = require("../controller/ProductController");

// GET /products - Get all products
// GET /products/:id - Get single product
// POST /products - Create new product
// PUT /products/:id - Update product
// DELETE /products/:id - Delete product

router.route("/").get(allProducts).post(createProduct);
router.route("/:id").get(singleProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
