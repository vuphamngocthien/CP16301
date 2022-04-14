var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const userController = require('../compoments/user/controller');
const productController = require('../compoments/products/controller');
const authencation = require('../middle/authencation');
/**
 * http://localhost:3000/api/dang-nhap
 * method: post
 * desc: tiến hành đăng nhập
 */
router.post("/dang-nhap", async function (req, res, next) {
    const { username, password } = req.body;
    // tiến hành đăng nhập
    const user = await userController.login(username, password);
    // await có tác dung là chờ nó chờ nó lấy
    // await thì phải có async
    if (user) {
        // lưu thông tin login vào session
        const token = jwt.sign({ id: user._id, username: user.username }, 'mykey');
        res.json({ status: true, id: user._id, username: user.username, token });
    } else {
        res.json({ status: false })
    }
});

/**
 * http://localhost:3000/api/dang-ky
 * method: post
 * desc: tiến hành đăng ký
 */
 router.post("/dang-ky", async function (req, res, next) {
    const { username, password, comfirm_password } = req.body;
    // tiến hành đăng nhập
    const user = await userController.register(username, password, comfirm_password);
    // await có tác dung là chờ nó chờ nó lấy
    // await thì phải có async
    if (user) {
        res.json({ status: true });
    } else {
        res.json({ status: false });
    }
});

/*router.get("/bang-san-pham",  async function (req, res, next) {
    // lấy danh sách sản phẩm từ database và hiển thị
    const data = await productController.getProducts();
  
    res.render("products", { products: data });
    //hiển thị(render)
  });*/

  router.get("/san-pham/bang-san-pham",[authencation.checkToken],  async function (req, res, next) {
    // lấy danh sách sản phẩm từ database và hiển thị
    const products = await productController.getProducts();
  
    res.json(products);
    //hiển thị(render)
  });

  exports.checkToken = function(request, response, next)
  {
      let token = null;
      if(request.headers.authorization &&
          request.headers.authorization.split(' ')[0] == 'Bearer')
          token = request.headers.authorization.split(' ')[1];
  
      if(token)
      {
          jwt.verify(token, 'iloveyou', function(error, decoded){
  
              if(error){
                  response.json({status: false})
              }else 
              {
                  next();
              }
          })
        }  else
          {
              response.json({stastus : false})
          }
         
  }

  router.get("/san-pham/bang-san-pham/:id/detail", [authencation.checkToken], async function (req, res, next) {
  
    const { id } = req.params;
    const product = await productController.getProductById(id);

  
    res.json(product);
  
  });
  
module.exports = router;