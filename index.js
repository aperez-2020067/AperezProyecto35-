//Ejecutar el proyecto
      //desestructurar   
import { initServer } from "./configs/app.js"
import { config } from "dotenv" //Decirle a Node que se usa DOTENV
import { connect } from "./configs/mongo.js"
import mongoose from "mongoose";
import { createDefaultAdmin } from "./src/user/user.controller.js";
import { createDefaultCategory } from './src/category/category.controller.js';     
config()
initServer()
connect()

mongoose.connection.once("open", async () => {
      console.log("Connected to MongoDB");
      await createDefaultAdmin();
      await createDefaultCategory();

});
  