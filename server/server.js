import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});
