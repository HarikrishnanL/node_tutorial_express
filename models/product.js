// const products = [];
const fs = require('fs');
const path = require('path');



module.exports = class Product {
    constructor(title) {
        this.title = title;
    };

    save(){
        // products.push(this);
        const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');
        fs.readFile(p,(err,fileContent)=>{
            let products = [];
            console.log('file content for products',fileContent);
            if(!err){
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log('error while writing a file',err);
            });
        });
    };

    static fetchAll(cb){
        const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');

        fs.readFile(p,(err,fileContent)=>{
            if(err){
                console.log('error while fetching all products',err);
                // return [];
                cb([]);
            }
            // return JSON.parse(fileContent);
            cb(JSON.parse(fileContent));
        })
        // return products;
    };

};