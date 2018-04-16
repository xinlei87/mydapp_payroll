// 链接数据库
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '0807',
  database : 'payroll'
});

connection.connect(function(err){
  if(err) throw err;
  console.log("connected!");
 });


//登录--login  post
//添加员工--addemployee  post
// var post = '';
// request.on('data',function(chunk){
//   post += chunk;
// })
// request.on('end',function(){
//   post = querystring.parse(post);
//   console.log(post);
// })
//删除员工 -- delete  delete

//员工的详细信息  employeeinfo get
// var q = url.parse(request.url, true);
//所有员工信息 employeesinfo get

// var qdata = q.query; //returns an object: { year: 2017, month: 'february' },解析url中的参数

//启动服务器，监听请求
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
http.createServer( function (request, response) {
  // console.log("request:");
  var type = request.url;//哪个页面发的请求
  console.log(type);
  if(type == "/login"){
    //验证用户登录
    var post = '';
    request.on('data',function(chunk){
      post += chunk;
    })
    request.on('end',function(){
      post = querystring.parse(post);
      // console.log(post);
      var accountname = post.accountname;
      var password = post.password;
      //由于node 的异步执行机制，无法将数据库操作单独写为函数
      var sql = "SELECT * FROM accounts WHERE accountname = \'" + accountname + "\' AND password = \'" + password + "\'" ;
      connection.query(sql,function(err,result,fields){
        if(err) throw err;
        // console.log(sql);
        // console.log(result);
        if(result.length == 0){
          response.setHeader("Access-Control-Allow-Origin","*");
          response.writeHead(404, {'Content-Type': 'text/html; charset=utf8'});
          response.end();
        }
        else{
          response.setHeader("Access-Control-Allow-Origin","*");
          response.writeHead(200,{'Content-Type': 'text/html; charset=utf8'});
          var data = {};
          data.id = result[0].id;
          // console.log(result[0].id);
          response.end(JSON.stringify(data));
        }
      })

    })

  }
  else if(type == '/employeesinfo'){
    //查看所有用户信息
    var sql = "SELECT * FROM infos WHERE flag = 1";
    connection.query(sql,function(err,result){
      if(err) throw err;
      console.log("infos:");
      console.log(result);
      response.setHeader("Access-Control-Allow-Origin","*");
      response.writeHead(200,{'Content-Type': 'text/html; charset=utf8'});
      response.end(JSON.stringify(result));
    })
  }

  else if(type  == "/addEmployee"){
    //添加用户
    console.log("add");
    var post = '';
    request.on('data',function(chunk){
      post += chunk;
    })
    request.on('end',function(){
      post = querystring.parse(post);
      console.log(post);
      post.id = parseInt(post.id);
      //name varchar(25),sex int,birth varchar(15),position varchar(35),address varchar(50),accountname varchar(24),id int primary key);
      var sql = "INSERT INTO infos (name,sex,birth,position,address,accountname,id,flag) VALUES(\'" + post.name + "\',\'" + post.sex + "\',\'" + post.birth + "\',\'" + post.position + "\',\'" + post.address + "\',\'" + post.accountname + "\',"+ post.id + ",1)";
      connection.query(sql,function(err,result){
        if(err) throw err;
        sql = "INSERT INTO accounts (accountname,password,id) VALUES(\'" + post.accountname + "\',\'"+ post.password + "\',\'" + post.id + "\')";
        connection.query(sql,function(err,result){
          response.setHeader("Access-Control-Allow-Origin","*");
          response.writeHead(200,{'Content-Type': 'text/html; charset=utf8'});
          response.end();
          console.log(result);
        })
        ;
      })
    })
  }
  else {
    //删除用户置标志位为0
    var q = url.parse(request.url, true).query;
    console.log(q);
    var id = q.id;
    var sql = "UPDATE infos SET flag = 0 WHERE id = " + id;
    connection.query(sql,function(err,result){
      if(err) throw err;
      console.log(result);
      response.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST");
      response.setHeader("Access-Control-Allow-Origin","*");
      response.writeHead(200,{'Content-Type': 'text/html; charset=utf8'});
      response.end();
    })
  }
}).listen(8888);

// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:8888/');
