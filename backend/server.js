const mongo = require('mongodb');
const express = require('express');
const isodate = require('isodate')
let {PythonShell} = require('python-shell');
var cors = require('cors');
const querystring = require('querystring')
const API_PORT = 8081;
const router = express.Router();
const app = express();
app.use(cors());
const MongoClient = mongo.MongoClient;
const url = 'mongodb://34.69.61.31:27017';
var q1 = "Loading";
var result = "";
console.log(__dirname);
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) return res.json(err);
    const db = client.db("project").collection("uniondata");
    db.findOne({}, function(err, res){
        console.log(res);
        result = res;
        client.close();
    })
});

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.send('Welcome To Our Mango Mong DB');
    //res.end(JSON.stringify(result));
})

router.get('/getData', function(req,res){
    data = result;
    return res.json({success: true, data: data});
})


router.get('/Query/:id', function(req,res){
    var id = req.params.id;
    var pyshell = new PythonShell(`./queries/query${id}.py`);
    var answer = "";
    pyshell.on('message', function(message){
        console.log(message);
        answer += message + "\n"
    })
    pyshell.end(function(err){
        if(err) return res.json(err)
        var jsdata =
        {
            scriptPrints: ""
        }
        jsdata.scriptPrints = answer;
        return res.json({success: true, data: jsdata});
    })
})

router.get('/search/', function(req,res){
    if(req.query == ""){
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) return res.json(err);
            const db = client.db("project")
            db.listCollections().toArray(function(err, cols){
                if(err) return res.json(err)
                //console.log(cols);
                client.close();
                return res.json(cols);
            })
        });
    }
    else{
        var qs = req.query;
        
        var collection = qs['collection'];
        var queryType = qs['queryType'];
        var direction = qs['direction'];
        var from = qs['from'];
        var to = qs['to'];
        var locationtext = qs['locationtext']
        var startdate = new Date(qs['startdate']) ;
        var enddate = new Date(qs['enddate']);
        var limit = parseInt(qs['limit']);
        
        
        console.log(startdate);
        console.log(req.query);


        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            
            if (err) return res.json(err);
            const db = client.db("project")
            const collect = db.collection(`${collection}`)

            
            //var matchdirection = (direction == null) ? null : {"$match" : {"detectorInfor.direction" : `${direction}`}};
            //var matchfrom = (direction == null) ? null : {"$match" : {"detectorInfor.locationtext" : `${from}`}};
            //console.log(matchdirection);

            var searchQuery = [
            { $match : { "detectorInfor.locationtext" : `${locationtext}`}},
            { $match : { "detectorInfor.direction" : `${direction}`} },
            { $match : { starttime : {$gte : startdate}}} ,
            { $match : { starttime : {$lt : enddate}}},
            { $limit : limit }
        
            ]
        
            console.log(searchQuery)
            collect.aggregate(
                searchQuery
            ).toArray(function(err, cols){
                client.close();
                if(err) return res.json(err);
                //console.log(cols);
    
                return res.json(cols);
            })
        });

        /*
        //query string stuff
        var qy = req.query;
        console.log(qy);
        return res.json(qy);
        */

    }
})



/*
router.get('/collections/:id', function(req,res){
    var id = req.params.id;
    console.log(id);
    

    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;
        const db = client.db("project")
        const coll = db.collection(id);
        
        coll.find().toArray(function(err, cols){
            if(err) throw(err)
            console.log(cols);
            client.close();
            return res.json(cols);
        })
        
      
        
    });
})

*/

app.use('/api', router);

app.listen(API_PORT, '0.0.0.0', () => console.log(`listening to port ${API_PORT}`));
