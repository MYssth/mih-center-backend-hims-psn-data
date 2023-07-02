const dboperations = require('./dboperations');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { request, response } = require('express');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use('/api/hims', router);

router.use((request, response, next) => {
    //write authen here

    response.setHeader('Access-Control-Allow-Origin', '*'); //หรือใส่แค่เฉพาะ domain ที่ต้องการได้
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    console.log('middleware');
    next();
});

router.route('/getallpsndata').get((request, response) => {

    dboperations.getAllPSNData().then(result => {
        response.status(201).json(result);
    }).catch(err => {
        console.error(err);
        response.setStatus(500);
    });

});

router.route('/getpsndatabyid/:stfno').get((request, response) => {

    dboperations.getPSNDataById(request.params.stfno).then(result => {
        response.status(201).json(result);
    }).catch(err => {
        console.error(err);
        response.setStatus(500);
    });

});

router.route('/getalldept').get((request, response) => {

    dboperations.getAllDept().then(result => {
        response.status(201).json(result);
    }).catch(err => {
        console.error(err);
        response.setStatus(500);
    });

});

var port = process.env.PORT;
app.listen(port);
console.log('hims-psn-data API is running at ' + port);