const mongoose = require("mongoose");

const getConection = async () => {
  try {
    const url =
      "mongodb+srv://admin-mongo-iud:HDJqtKWChZdnl0rZ@cluster0.txxte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    await mongoose.connect(url);
    console.log("conexion exitosa");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getConection
}
