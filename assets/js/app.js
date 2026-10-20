

let cl = console.log;
const albumContainer = document.getElementById('albumContainer')
const albumForm = document.getElementById('albumForm');
const titleControl = document.getElementById("title")
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');


function snakBar(msg, icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000,
    })
}




const BASE_URL = "https://jsonplaceholder.typicode.com";
const ALBUM_URL = `${BASE_URL}/albums`


//read
let xhr = new XMLHttpRequest();

xhr.open("GET", ALBUM_URL);
xhr.send(null);
xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <= 299){
        let res = JSON.parse(xhr.response);
        cl(res);
        let result = "";
        res.forEach((ele)=> {
            result += `<div class="col-md-4 mb-5" id=${ele.id}>
               <div class="card h-100">
               <div class="card-header">
                 <h3 class="m-0">${ele.title}</h3>
               </div>
              <div class="card-body"></div>
               <div class="card-footer d-flex justify-content-between">
                <button onclick="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                <button onclick="onRemove(this)" class="btn btn-danger btn-sm">delete</button>
            </div>
               </div>
        </div>`
        })
        albumContainer.innerHTML = result;
    }else{
        cl("error")
    }
}



//create
function onAddalbum(eve){
    eve.preventDefault();

    newObj = {
        title : titleControl.value,
        userId : userIdControl.value,
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", ALBUM_URL);
    xhr.send(JSON.stringify(newObj));
    xhr.onload = function(){
        if(xhr.status === 201){
            let res = JSON.parse(xhr.response);
            cl(res);
            let div = document.createElement("div");
            div.id = res.id;
            cl(div)
            div.className = `col-md-4 mb-5`
            div.innerHTML = ` <div class="card h-100">
                  <div class="card-header">
                 <h3 class="m-0">${newObj.title}</h3>
               </div>
              <div class="card-body"></div>
               <div class="card-footer d-flex justify-content-between">
                <button onclick="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                <button onclick="onRemove(this)" class="btn btn-danger btn-sm">delete</button>
            </div>
               </div>`
               albumContainer.prepend(div);
               albumForm.reset()
               snakBar("This Ablbum is added successfully...")
        }else{
            cl("error")
        }
    }
}


//edit
function onEdit(ele){
    let EDIT_ID = ele.closest(".col-md-4").id;
    cl(EDIT_ID)
    localStorage.setItem("EDIT_ID", EDIT_ID);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${ALBUM_URL}/${EDIT_ID}`);
    xhr.send(null);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            cl(res)

            titleControl.value = res.title;
            userIdControl.value = res.userId;
            submitBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
        }else{
            cl("error")
        }
    }
}


//update
function onUpdateAlbum(eve){
    let UPDATE_ID = localStorage.getItem("EDIT_ID");
    UPDATE_OBJ = {
        title : titleControl.value,
        userId : userIdControl.value,
        id : UPDATE_ID
    }
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", `${ALBUM_URL}/${UPDATE_ID}`);
    xhr.send(JSON.stringify(UPDATE_OBJ));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            cl(res);
            let div = document.getElementById(UPDATE_ID)
            div.querySelector(".card-header h3").innerHTML = titleControl.value;
            updateBtn.classList.add("d-none");
            submitBtn.classList.remove('d-none');
            albumForm.reset()
            snakBar("This Ablbum is updated successfully...")

        }else{
            cl("error")
        }
    }
}


//remove
function onRemove(ele){
Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    let REMOVE_ID = ele.closest(".col-md-4").id;
    cl(REMOVE_ID)
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${ALBUM_URL}/${REMOVE_ID}`);
    xhr.send(null);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            cl(res);
            ele.closest(".col-md-4").remove()
               snakBar("This Ablbum is deleted successfully...")

        }else{
            cl("error")
        }
    }
  }
});


}

albumForm.addEventListener("submit", onAddalbum);
updateBtn.addEventListener("click", onUpdateAlbum)