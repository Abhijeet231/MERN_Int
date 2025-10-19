import app from "./app.js";
import { connectDB } from "./db/index.js";

// Connect to Database and Start the server
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(" MongoDB connection failed!", error.message);
    process.exit(1);
  });
