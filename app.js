const Express = require("express");
const BodyParser = require("body-parser");
const Speakeasy = require("speakeasy");
const cors = require("cors");
var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
 
app.post("/totp-secret", (request, response, next) => {
    var secret = Speakeasy.generateSecret({ length: 20 });
    response.send({ "secret": secret.base32 });
});
app.post("/totp-generateValidator",cors(),  (request, response, next) => {
    response.send({
        "token prev": Speakeasy.totpprev({
            secret: request.body.secret,
            encoding: "base32"
        }),
        "token curr": Speakeasy.totp({
            secret: request.body.secret,
            encoding: "base32"
        }),
        "token next": Speakeasy.totpnext({
            secret: request.body.secret,
            encoding: "base32"
        }),
        "remaining": (5 - Math.floor((new Date()).getTime() / 1000.0 % 5))
    });
});

app.post("/totp-generate", (request, response, next) => {
    response.send({       
        "token curr": Speakeasy.totp({
            secret: request.body.secret,
            encoding: "base32"
        }),
      
        "remaining": (5 - Math.floor((new Date()).getTime() / 1000.0 % 5))
    });
});
app.post("/totp-validate", (request, response, next) => {
    response.send({
        "valid": Speakeasy.totp.verify({
            secret: request.body.secret,
            encoding: "base32",
            token: request.body.token,
            window: 0
        })
    });
});

app.listen(8100,'10.254.5.159', () => {
    console.log("Listening at :8100...");
});
app.listen(8100,'0.0.0.0', () => {
    console.log("Listening at :8100...");
});