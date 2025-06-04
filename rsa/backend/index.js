import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';
import confirmationRoutes from './routes/confirmationRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import Razorpay from 'razorpay';

dotenv.config();
connectDB();

const app = express();

// ✅ Allow frontend domain (e.g., Netlify, Vercel)

app.use(cors({
  origin: "https://vehicle-insurance-qx28.onrender.com",
  credentials: true
}));

app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_RhIH6rDK5qiYTS",
  key_secret: "6gqQ3PdXeVFQCW5llCa2AMlX",
  // key_id: process.env.RAZORPAY_KEY_ID,
  // key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: 'receipt_order_74394',
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).send('Something went wrong');
  }
});

app.use('/api/customers', customerRoutes);
app.use('/api/confirmations', confirmationRoutes);
app.use('/api/policies', policyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
