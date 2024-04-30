const express = require("express");
const dbconnection = require("./models/mongodb");
const userdbcontrollers = require("./controllers/usercontrollersdb");
const usercontrollers = require("./controllers/userdbcontrollers");
const index = require("./models/users");
const morgan = require("morgan");
const swaggerui = require("swagger-ui-express");
const swaggerjsdoc = require("swagger-jsdoc");
const { version } = require("mongoose");

const app = express();
// middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", usercontrollers);
app.use("/api", userdbcontrollers);
app.use(morgan("dev"));

//swagger api documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Classa-user-demo',
      version: '1.0.0',
    },
    server: [
      {
        url: "http://localhost:5609",
        
      },
    ],
  },
  apis: ["./controllers/userdbcontrollers.js"],
};

const specs = swaggerjsdoc(options);

app.use("/api-docs", swaggerui.serve, swaggerui.setup(specs));

//function to connect to database
dbconnection();
//port initiallizaation
app.listen(5609, () => {
  console.log("server is at 5609 runnig...");
});
