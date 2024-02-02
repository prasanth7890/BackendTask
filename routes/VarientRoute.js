const express = require("express");
const router = express.Router();

const {
  allVarients,
  createVarient,
  singleVarient,
  updateVarient,
  deleteVarient,
} = require("../controller/VarientController");

// GET /variants - Get all variants
// GET /variants?productId=xxx - Get variants for a product
// GET /variants/:id - Get single variant
// POST /variants/:productId - Create new variant
// PUT /variants/:id - Update variant
// DELETE /variants/:id - Delete variant

router.route("/").get(allVarients).post(createVarient);
router.route('/:id').get(singleVarient).put(updateVarient).delete(deleteVarient).post(createVarient);


module.exports = router;
