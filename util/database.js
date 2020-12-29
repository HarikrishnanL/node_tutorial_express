const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db ;


const mongoConnect = (callback) =>{
    MongoClient.connect('mongodb+srv://hari_007:Hari@cluster0.xbazb.mongodb.net/shop?retryWrites=true&w=majority',{useUnifiedTopology: true})
        .then(client=>{
            console.log('mongoDb got connected');
            _db = client.db();
            callback();
        })
        .catch(err =>{
            console.log('error while connecting to mongodb ====>',err)
            throw err;
        });
};

const getDb = ()=>{
    if (_db){
        return _db;
    }
    throw 'No dataBase found '
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


