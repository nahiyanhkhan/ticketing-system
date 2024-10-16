const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  if (req.user.role === "admin") {
    req.body.branch = req.user.branch;
  }
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

// const getAllProduct = async (req, res) => {
//   let products;
//   if (req.user.role === "superadmin") {
//     products = await Product.find({});
//   }
//   if (req.user.role === "admin") {
//     let { branch } = req.user;
//     products = await Product.find({ branch });
//   }
//   res.status(StatusCodes.OK).json({ products, count: products.length });
// };

const getAllProduct = async (req, res) => {
  try {
    console.log("User role:", req.user.role);
    console.log("User branch:", req.user.branch);

    let products;
    if (req.user.role === "superadmin") {
      products = await Product.find({});
    } else if (req.user.role === "admin") {
      let { branch } = req.user;
      products = await Product.find({ branch });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    console.log("Products found:", products.length);
    console.log("Sample product:", products[0]);

    res.status(StatusCodes.OK).json({ products, count: products.length });
  } catch (error) {
    console.error("Error in getAllProduct:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`no product found with ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const {id:productId}=req.params;
  const product = await Product.findOneAndUpdate({_id:productId},req.body,{
    new: true,
    runValidators: true,
  })

  if(!product){
    throw new CustomError.NotFoundError(`No product found with ${productId}`)
  }

  res.status(StatusCodes.OK).json({product})
};

const deleteProduct = async (req, res) => {
  const {id:productId}=req.params;
  const product = await Product.findOne({_id:productId})

  if(!product){
    throw new CustomError.NotFoundError(`No product found with ${productId}`)
  }

  await product.remove();
  res.status(StatusCodes.OK).json({msg:'Product removed sucessfully'})
};

const deleteAllProduct = async (req, res) => {
  await Product.deleteMany({});
  res.status(StatusCodes.OK).json({msg:'All products Deleated'})
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteAllProduct,
};
