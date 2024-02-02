const Product = require("../models/ProductSchema");
const Varient = require("../models/VarientSchema");
const {validateVarient} = require('../config');
const mongoose = require('mongoose');

const allVarients = async (req, res) => {
  try {
    const { productId } = req.query;

    let query = {};
    
    if (productId) {
      const product = await Product.findOne({_id: productId});

      if(!product) {
        res.status(404).json({msg: 'No Product found'});
        return;
      }

      query = { productId };
    }

    const varients = await Varient.find(query);

    res.json(varients);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createVarient = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const { success } = validateVarient.safeParse(req.body);

    if (!success) {
      await session.abortTransaction();
      res.status(400).json({ msg: "Please Enter Correct types of Data" });
      return;
    }

    const data = req.body;
    data.productId = id;

    const newDoc = await Varient.create([data], {session});

    await Product.findByIdAndUpdate(id, {
      $addToSet: { variants : newDoc[0]._id },
    }).session(session);

    await session.commitTransaction();
    res.status(200).json({ msg: "Varient Created Succesfully" });

  } catch (error) {
    await session.abortTransaction();
    res.json({ msg: error.message });
  }
};

const singleVarient = async (req, res) => {
  try {
    const id = req.params.id;

    const doc = await Varient.findById(id).select("-productId");

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateVarient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    const { success } = validateVarient.safeParse(req.body);

    if (!success) {
      await session.abortTransaction();
      res.status(400).json({ msg: "Please Enter Correct types of Data" });
      return;
    }

    const updatedDoc = await Varient.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-productId").session(session);

    await session.commitTransaction();
    res.status(200).json(updatedDoc);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ msg: error.message });
  }
};

const deleteVarient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const doc = await Varient.findOne({_id: id});

    if(!doc) {
      res.status(404).json({msg: "Varient Not Found"});
      return;
    }

    const deletedDoc = await Varient.findByIdAndDelete(id).session(session);

    const response = await Product.updateOne({_id: deletedDoc.productId }, { $pull: { variants: deletedDoc._id } }).session(session);
  
    await session.commitTransaction();
    res.status(200).json({ msg: "Document Deleted Succesfully" });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  allVarients,
  createVarient,
  singleVarient,
  updateVarient,
  deleteVarient,
};
