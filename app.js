const express=require('express');
const fs=require('fs');
const session = require('express-session')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const mongoose = require('mongoose');
const db =require('./models/db')
const userModel=require('./models/users');
const { error } = require('console');


const app=express();



app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.set("view engine",'ejs')

app.use(session({
    secret: 'keyboard cat cat',
    resave: true,
    saveUninitialized: true,
  }))

//single will be used if we are uploading a single file 
//array will be used if we are uploading a multiple file 
//pic is the name of the input field in the form
app.use(upload.single("pic"));

const todos=[];
const userData=[];



app.get('/',function(req,res){
    res.render('homepage')
})

app.use(express.static("public"))
app.use(express.static("uploads"))

app.get('/todohome',function(req,res){
      
       if (!req.session.isLogedIn) {
           res.redirect('/login')
           return;
        }

        let name=req.session.username;


        userModel.task.find({})
        .then((task)=>{
            console.log(task);
            res.render('index',{todos:task,username:name})
        })
        .catch((error)=>{
            res.send("error....in geting task")
        })

        // getToDos(function(error,todos){
        //     if (error) {
        //         res.status(500);
        //         res.json({error:error})
        //     }
        //     else{
        //         res.render('index',{todos:todos, username:name})
        //     }
        // })


        

})

app.post('/todohome',function(req,res){
    let taskUser=req.body.taskUser;
    let userTaskPic=req.file;
    
    let todo={
          text:taskUser,
          taskpic:userTaskPic.filename,
          checked:false

    }


    userModel.task.create(todo)
    .then((task)=>{
        if (task) {
           res.redirect('todohome') 
        }
    })
    .catch((error)=>{
        res.send("error...in create task")
    })


    // saveToDos(todo,function(error){
    //     if (error) {
    //         res.status(500);
    //         res.json({error:error});

    //     }
    //     else{
    //         res.status(200);
    //         res.redirect('todohome')
    //     }
    // })

})

app.patch('/todohome',function(req,res){

    let todoVal=req.body;
    checkedHandler(todoVal,function (error) {
        if (error) {
            res.status(500);
            res.json({error:error})
        }
        else{
           res.status(200);
           res.send();
        }
    })
})

app.delete('/todohome',function(req,res){
    const todoVal=req.body;

      getToDos(function(error,todos){
            if (error) {
                res.status(500);
                res.json({error:error});
            }
            else{

                const filteredData=todos.filter(function(todo){
                    return todo.text!==todoVal.text;
                })

                fs.writeFile('todos.text',JSON.stringify(filteredData),function(error){
                    if (error) {
                        res.status(500);
                        res.json({error:error});
                    }
                    else{
                        res.status(200);
                        res.send();
                    }
                })

            }
      })
})

app.get('/signup',function(req,res){
   res.render('signup')
})

app.post('/signup',function(req,res){
    const name=req.body.username
    const email=req.body.useremail
    const password=req.body.userpassword

    const user={
        username:name,
        useremail:email,
        userpassword:password,

    }

    userModel.user.create(user)
    .then(function(user){
         res.redirect('/login')
    })
    .catch(function(error){
        res.send('error.....mongoDB Model')
    });


    // saveUserInfo(name,email,password,function(error){
    //     if (error) {
    //         res.status(403);
    //         res.send();
    //     }
    //     else{
    //         res.redirect('/login')

    //     }
    // })

})

app.get('/login',function(req,res){

   res.render('login')
})

app.post('/login',function(req,res){
    const name=req.body.username
    const email=req.body.useremail
    const password=req.body.userpassword

    userModel.user.findOne({useremail:email,userpassword:password})
       .then((user)=>{
        if(user){
            req.session.isLogedIn=true;
            req.session.username=name;
            res.redirect('/todohome') 
        }
        else{
            res.send("error....in login time")
        }
       })
      .catch((error)=>{
        res.send("error....in login time")
      }) 
    // getUserInfo(email,password,function(error){
    //     if (error) {
    //        res.status(404);
    //         res.render('userillegal') 
    //     }
    //     else{
    //         req.session.isLogedIn=true;
    //         req.session.username=name;
    //         res.redirect('/todohome')
    //     }
    // })
})




db.init().then(function(){
    
    app.listen(3000,()=>{
        console.log('server run at port 3000');
    
    })

})






function getToDos(callback){
    fs.readFile('todos.text','utf-8',function(error,data){
        if (error) {
            callback(error);
        }
        else{
            if(data.length===0){
                data='[]'
            }

            try{
                let todos=JSON.parse(data);

                callback(null,todos);

            }
            catch(error){
                callback(null,[]);
            }
        }
    })
}






function checkedHandler(val,callback){
    
    fs.readFile('todos.text','utf-8',function(error,data){
        if (error) {

            callback(error);
        }
        else{

            let todos=JSON.parse(data);
                    todos.forEach((todo) => {
                            if(todo.text===val.text){
                            if(todo.checked===true){
                                  return todo.checked=false;
                            }
                            else{
                                 return  todo.checked=true;
                            }
                        }
                    });


             fs.writeFile('todos.text',JSON.stringify(todos),function(error){

                if (error) {
                         callback(error)
                }
                else{
                       callback()
                    }
                })


        }

    })

}

    

                
 function saveToDos(todo,callback){
     getToDos(function(error,todos){
         if(error){
             callback(error);
         }
         else{
             todos.push(todo);
             fs.writeFile('todos.text',JSON.stringify(todos),function(error){
                if(error){
                 callback(error);
                }
                else{
                 callback();
                }
             })
         }
     })
 }


 
function getUserInfo(email,password,callback){
    fs.readFile('personalinfo.text','utf-8',function (error,data) {
          if (error) {
            callback(error);
          }
          else{
            
              let userDataBase=JSON.parse(data);

              const user=userDataBase.filter((user)=>{
                if(user.email===email&&user.password===password){
                    nameU=user.name;
                    return user;
                }
              })

              if (user.length===1) {
                callback();
              }
              else{
                callback('user not found');
              }

          }
    })
}


function saveUserInfo(name,email1,password1,callback) {
    fs.readFile('personalinfo.text','utf-8',function (error,data) {
        if (error) {
            callback(error);
        }
        else{
            if(data.length===0){
                data='[]';
            }

            let userDataBase=JSON.parse(data);
          
            const user=userDataBase.filter((user)=>{
                if(user.email===email1 && user.password===password1)
                {
                    return user;
                }
               
                    
                
              })
            

              if (user.length===1) {
                callback('user exist')
              }
              else{
                
                let uinfo={name:name,email:email1,password:password1}
                  userData.push(uinfo)
                  fs.writeFile('personalinfo.text',JSON.stringify(userData),function(error){
                    if (error) {
                        callback(error);
                    }
                    else{
                        callback();
                    }
                  })
              }

            
        }
        
    })
}



