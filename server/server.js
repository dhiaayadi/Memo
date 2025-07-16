import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';

// 🔹 Charge les variables d’environnement en tout premier
dotenv.config();

// 🔹 Import des routes
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js'; 
import productRoutes from './routes/productRoutes.js';
import statistiquesRouter from './routes/AdminRouter.js';
import reviewRouter from './routes/reviewRoutes.js';
import panierRoutes from './routes/panierRoutes.js';
import newsletterRouter from './routes/newsletterRoutes.js';
import messageRouter from './routes/messageRoutes.js';   // Assure-toi que ce fichier existe
import stripeRoutes from './routes/stripeRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// 🔹 Connexion MongoDB
connectDB();

// ✅ CORS configuration recommandée
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // pour autoriser les cookies
}));

// Middlewares JSON et cookies
app.use(express.json());
app.use(cookieParser());

// 🔹 Headers spécifiques pour la sécurité et Google Auth
app.use((req, res, next) => {
  // Par défaut
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  // Exception pour Google Auth
  if (req.path === '/api/auth/google') {
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }

  next();
});

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRoutes);
app.use('/api/review', reviewRouter);
app.use('/api/prod', statistiquesRouter);
app.use('/api/panier', panierRoutes);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/messages', messageRouter);  // <-- ici doit exister routes/messageRoutes.js
app.use('/api/stripe', stripeRoutes);

// Route test
app.get('/', (req, res) => {
  res.send('✅ Server is running');
});

// 🔹 Middleware d’erreur global (pour mieux voir tes erreurs IA)
app.use((err, req, res, next) => {
  console.error('🔥 Erreur globale :', err);
  res.status(500).json({ message: 'Erreur interne du serveur', detail: err.message });
});

// Lancement serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
