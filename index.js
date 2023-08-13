const newTask= document.getElementsByClassName('todoTask')[0];
const newt   = document.getElementById('taskTodo')


let taskValue=document.getElementById('userTask').innerText;
let checkboxUser=document.getElementById('check');
checkboxUser.addEventListener('change',(e)=>{
    if (e.currentTarget.checked) {   
        
        checkedHandler(taskValue,function(error){
            if (error) {
                alert(error);
            }
            else{
                userTask.classList.add('cut');
            }
        });

    }
    else{
        checkedHandler(taskValue,function(error){
            if (error) {
                alert(error);
            }
            else{
               
                userTask.classList.remove('cut');
            }
        });
       

    }
})

// let parentU=document.getElementById('parentUl')
// console.log(parentU);
let chiledL=document.getElementById('chiledLi')
console.log(chiledL);
let deletUser=document.getElementById('deleteData');
deletUser.addEventListener('click',()=>{
    deleteToDo(taskValue,function(error){
        if (error) {
            alert(error);
        }
        else{
           // parentU.removeChild();
            chiledL.remove();
        }
    });

})


function deleteToDo(val,callback){
    fetch('/todohome',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text:val})
    })
    .then(function(res){
        if(res.status===200){
            callback();
        }
        else{
            callback('not deleted');
        }
    })
}

function checkedHandler(value,callback){
   
    fetch('/todohome',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text:value})
    })
    .then((res)=>{
        if (res.status===200) {
            callback();
        }
        else{
            callback("error in checked change time ")
        }
    })

}



