const Product = require("../models/ProductSchema");
const Varient = require("../models/VarientSchema");
const { validateProduct, validateVarientArray } = require("../config");
const mongoose = require("mongoose");

const allProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("variants");
    res.status(200).json({ products: products });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, description, price, varients } = req.body;
    const { success } = validateProduct.safeParse({ name, description, price });

    if (!success) {
      res.json({ msg: "Please Enter Correct types of Data" });
      return;
    }

    const newProduct = await Product.create(
      [
        {
          name,
          description,
          price,
        },
      ],
      { session }
    );

    if (!varients) {
      await session.commitTransaction();
      res.status(200).json({ msg: "Product Added Succesfully" });
      return;
    }

    const result = validateVarientArray.safeParse(varients);

    if (!result.success) {
      await session.abortTransaction();
      res.json({ msg: "Please Enter Correct types of Data" });
      console.log(result.error);
      return;
    }

    varients.map((v) => {
      v.productId = newProduct[0]._id;
    });

    const varientDocs = await Varient.create(varients, { session });

    await Product.findByIdAndUpdate(
      newProduct[0]._id,
      { $addToSet: { variants: { $each: varientDocs.map((doc) => doc._id) } } },
      { new: true }
    ).session(session);

    await session.commitTransaction();

    res.status(200).json({ msg: "Added Products with Varients Succesfully" });
  } catch (error) {
    await session.abortTransaction();
    res.json({ msg: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const doc = await Product.findById(id).populate("variants");

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => { 
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const { success } = validateProduct.safeParse({ name, description, price });

    if (!success) {
      await session.abortTransaction();
      res.status(400).json({ msg: "Please Enter Correct types of Data" });
      return;
    }

    const updatedDoc = await Product.findByIdAndUpdate(
      id,
      {
        name: name,
        desription: description,
        price: price,
      },
      { new: true }
    ).session(session);

    if (!updatedDoc) {
      await session.abortTransaction();
      return res.status(404).json({ msg: "Product not found" });
    }

    await session.commitTransaction();
    res.status(200).json(updatedDoc);

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ msg: 'Product not found' });
    }

    await Varient.deleteMany({ productId: id }).session(session);

    const deletedDoc = await Product.deleteOne({ _id: id }).session(session);

    if (deletedDoc.deletedCount == 1) {
      await session.commitTransaction();
      res.status(200).json({ msg: "Successfully Deleted Product" });
    }
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  allProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  singleProduct,
};
