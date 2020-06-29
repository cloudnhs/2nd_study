const express = require('express'); //express 모듈 연동
const router = express.Router(); //라우터 함수 묶음 정의

const productModel = require('../../models/product');
const orderModel = require('../../models/order');

router.get('/', (req, res) => {
    
    orderModel
        .find()
        .populate('product', ["name", "price"])
        .then(results => {
            const response = {
                count : results.length,
                orderInfo : results.map(result => {
                    return{
                        qty: result.qty,
                        product : result.product,
                        id: result._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:6000/order/"+result._id
                        }
                    }
                }) 
            }
            res.json(response);
        })
        .catch(err => {
            res.json({
                error: err.message
            })
        });
});


router.post('/register', (res, req) => {
    console.log(req.body.productId)
    productModel
        .findById(req.body.productId)
        .then(product => {
            console.log(req.body.productId)
            const order = new orderModel({
                product: req.body.productId,
                qty: req.body.quantity
            });

            order
                .save()
                .then(result => {
                    res.status(200).json({
                        message: "order stored",
                        createdOrder: {
                            id: result._id,
                            product: result.product,
                            qty: result.qty,
                            request: {
                                tyep: "GET",
                                url: "http://localhost:6000/order/"+result._id
                            }
                        }
                    })
                })
                .catch(err => {
                    res.json({
                        error: err.message
                    });
                });

        })
        .catch(err => {
            res.statusCode(404).json({
                message: "Product not found"
            })
        })
})

router.get('/:id', (res, req) => {
    const orderId = req.params.id;
    
    orderModel
        .findById(orderId)
        .then(result => {
            res.json({
                orderInfo: {
                    qty: result.qty,
                    product: result.product,
                    id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:6000/order/"+result._id
                    }

                }
            });
        })
        .catch(err => {
            res.json({
                error: err.message
            })
        })
})

router.patch('/:id', (res, req) => {
    const orderId = req.params.id;
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    orderModel
        .updateOne({_id: orderId}, {$set: updateOps})
        .then(result => {
            res.status(200).json({
                message: "updated order",
                request: {
                    type: "GET",
                    url: "http://localhost:6000/order/"+orderId
                }
            })
        })
        .catch(err => {
            res.json({
                error : err.message
            });
        })
});

router.delete('/:id', (res, req) => {
    const orderId = req.params.id;
    orderModel
        .findByIdAndDelete(orderId)
        .then(result => {
            res.status(200).json({
                message: "deleted data",
                request: {
                    type: "GET",
                    url: "http://localhost:6000/order/"
                }
            })
        })
        .catch(err => {
            res.json({
                error: err.message
            });
        })
});

module.exports = router;