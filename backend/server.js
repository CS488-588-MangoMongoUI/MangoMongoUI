const mongo = require('mongodb');
const express = require('express');

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
    if (err) throw err;
    const db = client.db("project").collection("detectors");
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
        if(err) throw (err)
        var jsdata =
        {
            scriptPrints: ""
        }
        jsdata.scriptPrints = answer;
        return res.json({success: true, data: jsdata});
    })
})

router.get('/collections/', function(req,res){
    if(req.query == null){
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) throw err;
            const db = client.db("project")
            db.listCollections().toArray(function(err, cols){
                if(err) throw(err)
                //console.log(cols);
                client.close();
                return res.json(cols);
            })
        });
    }
    else{
        var qs = req.query;
        var qy = qs['queryType'];
    
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            
            if (err) throw err;
            const db = client.db("project")
            const collect = db.collection('uniondata')
          
            collect.find({ [qy] : {"$gt":100}}).toArray(function(err, cols){
                if(err) throw(err)
                //console.log(cols);
                client.close();
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
