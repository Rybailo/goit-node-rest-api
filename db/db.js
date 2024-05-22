import mongoose from "mongoose";

const DB_URI =
  "mongodb+srv://rybailoorest4:JjvQbo7e4ei7lGIi@cluster0.g4rgyos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.log("Database connection error", error);
    process.exit(1);
  });
