const         http = require("http"),
           express = require("express"),
       serveStatic = require("serve-static"),
              path = require("path"),
           winston = require("winston"),
    expressWinston = require("express-winston"),
        bodyParser = require("body-parser"),
                fs = require("fs");

const { sequelize } = require("./database");

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");
app.set("json spaces", 40);

app.use(serveStatic(path.join(__dirname, "..", "public")));

const logs = path.join(__dirname, "..", "logs");
if(!fs.existsSync(logs)) { fs.mkdirSync(logs); }
app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: path.join(logs, "list.log"),
            colorize: true
        })
    ],
    expressFormat: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", require("./routes")());
app.use((req, res, next) => {
    res.status(404).render("error", {
        title: "Ups! Not Found",
        code: 404,
        message: "The page you requested was not found"
    });
});  
app.use((err, req, res, next) => {
    res.status(500).render("error", {
        title: "Ups! Server Error",
        code: res.statusCode,
        message: err.message
    });
});

sequelize.sync().then(() => {
    http.createServer(app).listen(app.get("port"), () => {
        console.log(`Serving: localhost ${app.get("port")}`);
    });
});


