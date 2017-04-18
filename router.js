var express = require('express');
var router = express.Router();
var fs = require('fs');
//获得行政区县数据，数据作为配置文件传进来
var area = require('../area.json');
var province = area.province;
var city = area.city;
var country = area.country;

router.get('/', function (req, res, next) {
    res.send('hello, this is index page');
});

router.get('/ajax/test', function (req, res, next) {
    var userName = req.query.userName;
    var location = req.query.location;
    var obj = {
        userName: userName,
        location : location
    }
    //res.send(userName+'  '+location);
    res.send(obj);
    //res.status(404).send(userName+'  '+location);
});

router.post('/ajax/test',function (req,res,next) {
    var value1 = req.body.userName;
    var value2 = req.body.location;
    console.log(value1,value2);
    setTimeout(function () {
        res.send('post success'+value1+value2);
    },2000);
});

router.post('/ajax/checkname',function (req,res,next) {
    var userName = req.body.userName;
    console.log(userName);
    //调用数据库查用户是否存在
    var result = '0';//初始化默认值
    if('wuKong'===userName){
        //不可用
        //result = '1';
        result = '<span style="color:red"> 不可用</span>';
    }else{
        //返回可用
        // result = '2';
        result = '<span style="color:green"> 可用</span>';
    }
    res.send(result);
});

router.get('/ajax/test/json',function (req,res,next) {

    var provinces = [
        {
            "id": "吉林省",
            "citys": [
                "长春",
                "吉林市",
                "四平"
            ]
        },
        {
            "id": "辽宁省",
            "citys": [
                "沈阳",
                "大连",
                "葫芦岛"
            ]
        },
        {
            "id": "山东省",
            "citys": [
                "济南",
                "青岛",
                "烟台"
            ]
        }
    ]

    res.send(provinces);

});

router.get('/ajax/xml',function (req,res,next) {
    //xml格式的数据不能直接复制到后台，要通过读文件来获取
    var path = '../public/work/06_xml/province.xml'
    fs.readFile(path,function (err, data) {
        if (err){
            console.error(err);
        }else{
            //发送之前要让前端知道使用的数据格式是xml
            res.set('content-type', 'text/xml;charset=utf-8');
            res.send(data.toString());
        }
    });
});
///ajax_province
//获得省的数据
router.get('/ajax_province',function (req,res,next) {

    res.send(province);
});
///ajax_city
//获得县市的数据
router.get('/ajax_city',function (req,res,next) {
    var provinceID = req.query.provinceID;
    var resultArr = [];
    city.forEach(function (item,index) {
       var parent =  item.parent;
       if(parent === provinceID){
           resultArr.push(item);
       }
    });
    var resultObj = {
      city :resultArr
    };
    console.log(resultObj);
    res.send(resultObj);
});

///ajax_country
//获得乡的数据
router.get('/ajax_country',function (req,res,next) {
    var cityID = req.query.cityID;
    var resultArr = [];
    country.forEach(function (item,index) {
        var parent =  item.parent;
        if(parent === cityID){
            resultArr.push(item);
        }
    });
    var resultObj = {
        county :resultArr
    };
    console.log(resultObj);
    res.send(resultObj);
});

module.exports = router;


