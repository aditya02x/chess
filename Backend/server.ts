import express from 'express'
import dotenv from 'dotenv'
import authRoute from './src/routes/auth.route.js'

dotenv.config();
const app = express();
app.use("api/auth",authRoute);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});