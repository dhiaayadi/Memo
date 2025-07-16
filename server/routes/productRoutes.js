import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import Product from "../models/productModel.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Routes Admin protégées
router.post('/create-product', userAuth, requireAdmin, createProduct);
router.get('/get-all-products', userAuth, requireAdmin, getAllProducts);
router.get('/get-product/:id', userAuth, requireAdmin, getProductById);
router.put('/update-product/:id', userAuth, requireAdmin, updateProduct);
router.delete('/delete-product/:id', userAuth, requireAdmin, deleteProduct);

// ➕ route publique : voir tous les produits
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
