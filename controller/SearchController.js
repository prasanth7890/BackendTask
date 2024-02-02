const Product = require('../models/ProductSchema');
const Variant = require('../models/VarientSchema');

const searchItems = async (req, res) => {
    const { term } = req.query;
  
    const regex = new RegExp(term, 'i');
  
    const products = await Product.find({ 
      $or: [
        { name: regex }, 
        { description: regex },
      ]
    });

    const variants = await Variant.find({
      name: regex 
   });
 
   const results = { products: products, variants: variants }
  
  res.json(results);
}


module.exports = {
    searchItems
}