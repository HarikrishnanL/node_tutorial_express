// const products = [];
const fs = require('fs');
const path = require('path');

// file path
const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');


// helper function
const getProductsFromFile = (cb) =>{

    fs.readFile(p,(err,fileContent)=>{
        if(err){
            console.log('error while fetching all products',err);
            // return [];
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
        // return JSON.parse(fileContent);
    })
    // return products;
}



module.exports = class Product {
    constructor(title,imageUrl,description,price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;

    };

    save(){
        // products.push(this);
        getProductsFromFile(products =>{
            products.push(this);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log('error while writing a file',err);
            });
        });
    };

    static fetchAll(cb){
        getProductsFromFile(cb)
    };

};