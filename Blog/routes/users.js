var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var str_db='mongodb://localhost:27017/Blog';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post('/form', function(req, res, next) {
    // res.send('插入失败，请重试')
  // 获取注册信息
    var user=req.body['user'];
    var psw=req.body['psw'];
    var tel=req.body['tel'];
    // var email=req.body['email'];
    // var sex=req.body['sex'];

    var insertdata=function (db,callback) {
        //获取到要插入的数据库
        var coll=db.collection('signup');
        //    然后将数据插入进去

        var data = [{user:user, psw:psw, tel:tel}];
        coll.insert(data,function (err,result) {
            if(err){
                res.send('插入失败，请重试');
            }else {
                console.log(result)
                callback(result);
            }
        })
    };
    //    连接数据库
        mongodb.connect(str_db,function (err,db) {
            if(err){
              console.log('连接失败，请重试')
            }else {
              console.log('连接成功')
              insertdata(db,function (result) {
                  res.redirect('/');
                  db.close();
              })

            }
        })


});

//登录
router.post('/forms', function(req, res, next) {
//     //察看数据

    var finddata=function (db,callback) {
        //找到要查询的集合//数据库可换可不换
        var coll1=db.collection('signup');
        //    然后将数据插入进去
        var data={user:req.body['user'],psw:req.body['psw']};
        console.log(data);
        coll1.find(data).toArray(function (err,result) {
                callback(result);
        })
    }

    //    连接数据库
    mongodb.connect(str_db,function (err,db) {
        if(err){
            console.log('连接失败，请重试')
        }else {
            console.log('连接成功');
            //    连接成功后。将数据推送到mongodb数据库中
            finddata(db,function (result) {
                if(result.length>0){
                    req.session.user = result[0].user;
                    res.redirect('/shouye');
                    db.close();
                }else {
                        console.log(result)
                         res.redirect('/')
                        res.send('用户名或密码错误');

                }
            })
        }
    })
});

//留言
router.post('/list',function(req,res,next){
	var user=req.session.user;
	if(user){
		//留言数据插入到essay集合中
		
		//获取留言板表单数据
		var biaoti=req.body['biaoti']
		var areas=req.body['area']
		var time=new Date();
		var times=time.toLocaleString();
		//插入函数
		var insertdata=function(db,callback){
			//找到要插入的集合
			
			var coll2=db.collection('essay')
			//设置需要插入集合的文档数据
			var data=[{biaoti:biaoti,areas:areas,times:times}]
			coll2.insert(data,function(err,result){
				if(err){
					console.log(err)
				}else{
					callback(result)
				}
			})
		
		}
	

		//链接数据库 
		mongodb.connect(str_db,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功')
				//调用插入函数
				insertdata(db,function(result){
					console.log(result)
//					res.send('发布成功')
					res.redirect('/users/showlist')
					//关闭数据库
					db.close()
				})
				
			}	
		})	
		
	}else{
		res.send('登录失效，请重新登录哦~')
	}
	
})

//显示留言数据

router.get('/showlist',function(req,res,next){
	//获取集合内的留言数据
	//查询函数
		var findData=function(db,callback){
			//找到要查询的集合
			var coll3=db.collection('essay')
			coll3.find({}).toArray(function(err,result){
				callback(result)
			})
		}
		//链接数据库 
		mongodb.connect(str_db,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功11111')
				//调用查询函数
				findData(db,function(result){
					res.render('showlist',{shuju:result})
					console.log(result)
				})
			}
		})
		
		
})






//文章
router.post('/wen',function(req,res,next){
	var user=req.session.user;
	if(user){
		//文章数据插入到essay集合中
		
		//获取文章页面表单数据
		var biaoti=req.body['biaoti']
		var areas=req.body['area']
		var time=new Date();
		var times=time.toLocaleString();
		//插入函数
		var insertdata=function(db,callback){
			//找到要插入的集合
			var coll2=db.collection('news')
			//设置需要插入集合的文档数据
			var data=[{biaoti:biaoti,areas:areas,times:times}]
			coll2.insert(data,function(err,result){
				if(err){
					console.log(err)
				}else{
					callback(result)
				}
			})
		}
	

		//链接数据库 
		mongodb.connect(str_db,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功')
				//调用插入函数
				insertdata(db,function(result){
					console.log(result)
//					res.send('发布成功')
					res.redirect('/users/showessay')
					//关闭数据库
					db.close()
				})
				
			}	
		})	
		
	}else{
		res.send('登录失效，请重新登录哦~')
	}
	
})

//显示文章

router.get('/showessay',function(req,res,next){
	//获取集合内的留言数据
	//查询函数
		var findData=function(db,callback){
			//找到要查询的集合
			var coll3=db.collection('news')
			coll3.find({}).toArray(function(err,result){
				callback(result)
			})
		}
		//链接数据库 
		mongodb.connect(str_db,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功11111')
				//调用查询函数
				findData(db,function(result){
					res.render('showessay',{shuju:result})
					console.log(result)
				})
			}
		})
		
		
})
module.exports = router;
