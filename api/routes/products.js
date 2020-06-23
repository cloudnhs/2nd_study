const express = require('express'); //express 모듈 연동
const router = express.Router(); //라우터 함수 묶음 정의

const productModel = require('../../models/product');

router.get('/', (req, res) => {
    productModel
        .find()
        .then(results => {
            const response = {
                count : results.length,
                productInfo : results.map(result => {
                    return{
                        name: result.name,
                        price: result.price,
                        id: result._id,
                        request:{
                            type: "GET",
                            url: "http://localhost:6000/product/"+result._id
                        }
                    }
                })
            }  
            res.json(response);
        })
        .catch(err => {
            res.json({
                error : err.message
            })
        });
    });


// 제품 등록하기 api
router.post('/register', (req, res) => {
    const newProduct = new productModel({
        name : req.body.productName,
        price : req.body.productPrice
    });
    newProduct
        .save()
        .then(result => {
            res.json({
                message : 'saved data',
                productInfo : {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                    request:{
                        type: "GET",
                        url: "http://localhost:6000/product/"+ result._id
                    }
                }


            })
        })
        .catch(err => {
            res.json({
                error: err.message
            });
        });
    });

// 상세제품 불러오기 api
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    productModel
        .findById(productId)
        .then(result => {
            res.json({
                productInfo : {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:6000/product"
                    }
                },

            });
        })
        .catch(err => {
            res.json({
                error: err.message        
            });
            
        });
});

// 제품 업데이트 api 
router.patch('/:id', (req, res) => {
    const productId = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
        console.log(ops)
    }
    console.log(updateOps);
    productModel
        .updateOne({ _id: productId}, { $set: updateOps}) // 업데이트 대상자, 업데이트 내용
        .then(result => {
            res.status(200).json({
                message : "updated product",
                request:{
                    type : "GET",
                    url : "http://localhost:6000/product/"+productId
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });   
    });

router.delete('/:id', (req, res) => {
        const productId = req.params.id;
        productModel
            .findByIdAndDelete(productId)
            .then(result => {
                res.json({
                    message : "deleted data",
                    request: {
                        type: "GET",
                        url: "http://localhost:6000/product"
                    }
    
                });
            })
            .catch(err => {
                res.json({
                    error : err.message
                });
            });
        });

module.exports = router;