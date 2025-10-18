import app from "./app.js";
import { connectDB } from "./db/index.js";

// Connect to Database and Start the server
connectDB().then(
    () => {
        app.listen(process.env.PORT), () => {
            console.log(`Server is Running on Port: ${process.env.PORT}`)
        }
    }
)
.catch((error) => {
    console.log('MongoDB Connection Failed!', error.message);
    process.exit(1);
});
