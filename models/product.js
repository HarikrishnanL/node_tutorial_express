// const products = [];
const fs = require('fs');
const path = require('path');

// import cart model
const Cart = require('./cart');

// file path - Products.JSON
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
    constructor(id,title,imageUrl,description,price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;

    };

    save(){
        // products.push(this);
        getProductsFromFile(products =>{
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
                    console.log('error while writing a file',err);
                });
            }else{
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    console.log('error while writing a file',err);
                });
            }
        });
    };

    static deleteById(id){
        getProductsFromFile(products =>{
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p,JSON.stringify(updatedProducts),err=>{
                if (!err){
                    Cart.deleteProduct(id,product.price);
                } else{
                    console.log("error while deleting and updating products",err);

                }
            });
        });
    }

    static fetchAll(cb){
        getProductsFromFile(cb)
    };

    static findById(id,cb){
        getProductsFromFile(products =>{
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }

};