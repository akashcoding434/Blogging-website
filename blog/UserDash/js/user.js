//url security
let user=sessionStorage.getItem("User");

if(user==null){
   window.location="http://127.0.0.1:5500/index.html?";
}
//logou coding
let logoutBtn=document.querySelector("#logout-btn");
let userD=document.querySelector("#user-name");
logoutBtn.onclick=()=>{
    logoutBtn.innerHTML="please wait...";
    setTimeout(function(){
        logoutBtn.innerHTML="Logout";
        window.location="http://127.0.0.1:5500/index.html?";
        sessionStorage.removeItem("User");
    },3000) 
}
let userdata=JSON.parse(sessionStorage.getItem("User"));
let User=userdata.email.split("@")[0];
let u_data=userdata.fname.split("k")[0];
userD.innerHTML="Welcome"+" "+u_data;


//userD.innerHTML=u_data;

// control navbaar
const toggleFunc=()=>{
    let menuBtn=document.querySelector("#menu-btn");
    let sideNav=document.querySelector(".side-nav");
    let page=document.querySelector(".page");
    menuBtn.onclick=()=>{
       let open=sideNav.classList.contains("open");
       if(open){
        sideNav.classList.add("close");
        sideNav.classList.remove("open");
        page.classList.add("close");
        page.classList.remove("open");
       } 
       else{
        sideNav.classList.add("open");
        sideNav.classList.remove("close");
        page.classList.add("open");
        page.classList.remove("close");
       } 
    }
}


// routing coding
const dynamicRequestFunc=()=>{
     let allBtn=document.querySelectorAll(".collapse-btn");
     for(let btn of allBtn){
        btn.onclick=(e)=>{
          let link=e.target.getAttribute("access-link");
          dynamicAjaxFunc(link);
        }
     }
}
const dynamicAjaxFunc=(link)=>{
    let pageNav=document.querySelector(".page-nav");
    let ajax=new XMLHttpRequest();
    ajax.open("GET",link,true);
    ajax.send();
    //ajax response
    ajax.onload=()=>{
      pageNav.innerHTML=ajax.response;
      toggleFunc();
      if(link=="dynamic/cat_design.html"){
        cateogryFunc();
      }
      else if(link=="dynamic/blog_design.html"){
        blogFunc();
      }
      else if(link=="dynamic/profile.html"){
        profileSave();
      }
      else if(link=="dynamic/profileview.html"){
        profileView();
      }
    }
   
}
dynamicRequestFunc();


//start cateopgry coding
let allCatData=[];
const fetchDataFunc=(key)=>{
    if(localStorage.getItem(key)!=null){
        let data=JSON.parse(localStorage.getItem(key));
        return data;
    }
    else{
        return [];
    }
}

const formatDate=(data)=>{
    const date=new Date(data);
    let yy=date.getFullYear();
    let mm=date.getMonth()+1;
    let dd=date.getDate();
    let time=date.toLocaleTimeString();
    dd=dd<10 ? "0"+dd : dd;
    mm=mm<10 ? "0"+mm:mm;
    return`${dd}-${mm}-${yy} ${time}`;
  }
const cateogryFunc=()=>{
    let cateogryForm=document.querySelector(".cateogry-form");
    allCatData=fetchDataFunc(User+"__allCatData");
    let addField=document.querySelector(".add-field");
    let inputBox=document.querySelector(".input-box");
    addField.onclick=()=>{
        inputBox.innerHTML+=`
         <div>
            <input type="text" required class="form-control mb-2 mt-3" placeholder="cateogry">
            <i class="fa fa-trash float-end mb-2 text-danger del-btn" style="cursor:pointer;"></i>
         </div>
        `;
        let delBtn=inputBox.querySelectorAll(".del-btn");
        for(let btn of delBtn){
            btn.onclick=function(){
                this.parentElement.remove();
            }
        }
    }
    // create catoegry coding
    cateogryForm.onsubmit=(e)=>{
           e.preventDefault();
           let allInput=cateogryForm.querySelectorAll("INPUT");
           for(let input of allInput){
            allCatData.push({
                createdAt:new Date(),
                cateogry:input.value
            });
           }
           localStorage.setItem(User+"__allCatData",JSON.stringify(allCatData));
           swal("Good","insert","success");
           cateogryForm.reset("");
           getcatData();
    }

    //read cateogry data
    let catList=document.querySelector(".cat-list");
    const getcatData=()=>{
        catList.innerHTML="";
        allCatData.forEach((data,index)=>{
            let dataStr=JSON.stringify(data);
            let finaldata=dataStr.replace(/"/g,"'");
            catList.innerHTML+=`
            
                  <tr>
                    <td>${index+1}</td>
                    <td>${data.cateogry}</td>
                    <td>${formatDate(data.createdAt)}</td>
                    <td>
                        <button class="bg-danger btn text-white del-btn" index="${index}"><i class="fa fa-trash"></i></button>
                        <button class="bg-info text-white btn edit-btn" index="${index}" data="${finaldata}"><i class="fa fa-edit"></i></button>
                    </td>
                </tr>

            `;
        })
        //delete coding
        let alldelBtn=catList.querySelectorAll(".del-btn");
        for(let btn of alldelBtn){
            btn.onclick=()=>{
                index=btn.getAttribute("index");
                swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this cateogry!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                      allCatData.splice(index,1);
                      localStorage.setItem(User+"__allCatData",JSON.stringify(allCatData));
                      getcatData();
                      swal("Poof! Your cateogry has been deleted!", {
                        icon: "success",
                      });
                    } else {
                      swal("Your cateogry is safe!");
                    }
                  });
            }
        }
        //update coding
        let allEBtn=catList.querySelectorAll(".edit-btn");
        let allInput=cateogryForm.querySelectorAll("INPUT");
        let allbtn=cateogryForm.querySelectorAll("BUTTON");
        for(let btn of allEBtn){
            btn.onclick=()=>{
                index=btn.getAttribute("index");
                let dataStr=btn.getAttribute("data");
                let finaldata=dataStr.replace(/'/g,'"');
                let data=JSON.parse(finaldata);
                allInput[0].value=data.cateogry;
                allbtn[0].disabled=true;
                allbtn[1].disabled=true;
                allbtn[2].disabled=false;
                allbtn[2].onclick=()=>{
                for(let input of allInput){   
                var data={
                    createdAt:new Date(),
                    cateogry:input.value
                } 
            }
                allCatData[index]=data;
                localStorage.setItem(User+"__allCatData",JSON.stringify(allCatData));
                swal("Good!","cateogry upadated succesfully!")
                getcatData();
                allbtn[0].disabled=false;
                allbtn[1].disabled=false;
                allbtn[2].disabled=true;
            }
        }
    }
}
    getcatData();

}

const blogFunc=()=>{
    let allBlogData=[];
    let url="";
    allBlogData=fetchDataFunc(User+"__allBlogData");
    let user=JSON.parse(localStorage.getItem(User+"__allCatData"));
    let blogForm=document.querySelector(".blog-form");
    let allbInput=document.querySelectorAll("INPUT");
    console.log(allbInput);
    let catSelect=blogForm.querySelector("select");
    for(let data of user){
        catSelect.innerHTML+=`
           <option>${data.cateogry}</option>
        `;
    }
    //create blog
    blogForm.onsubmit=(e)=>{
        e.preventDefault();
        let data={
            createdAt:new Date(),
            cateogry:catSelect.value,
            blogName:allbInput[0].value,
            discription:allbInput[1].value,
            blogPic:url==="" ? "user1.png" : url,
        }
        allBlogData.push(data);
        localStorage.setItem(User+"__allBlogData",JSON.stringify(allBlogData));
        swal("Good!","blog created succesfully!","success");
        blogForm.reset("");
        getblogData();
    }
    //upload blog image
    allbInput[2].onchange=()=>{
        let freader=new FileReader();
        freader.readAsDataURL(allbInput[2].files[0]);
        freader.onload=(e)=>{
             url=e.target.result;
        }
    } 
    //start read blog
    let blogList=document.querySelector(".blog-list");
    const getblogData=()=>{
        blogList.innerHTML="";
        allBlogData.forEach((data,index)=>{
            let dataS=JSON.stringify(data);
            let finaldata=dataS.replace(/"/g,"'");
            blogList.innerHTML+=`
                  
             <tr>
                    <td>${index+1}</td>
                    <td class="text-nowrap"><img src="${data.blogPic}" width="50"/></td>
                    <td class="text-nowrap">${data.blogName}</td>
                    <td class="text-nowrap">${data.cateogry}</td>
                    <td class="text-nowrap">${data.discription}</td>
                    <td class="text-nowrap">${formatDate(data.createdAt)}</td>
                    <td class="text-nowrap">
                        <button class="bg-danger btn text-white del-btn" index="${index}"><i class="fa fa-trash"></i></button>
                        <button class="bg-info text-white btn edit-btn" index="${index}" data="${finaldata}"><i class="fa fa-edit"></i></button>
                    </td>
                </tr>
            
            `;
        })

        //delete blog coding
        let bBtn=blogList.querySelectorAll(".del-btn");
        for(let btn of bBtn){
            btn.onclick=()=>{
                index=btn.getAttribute("index");
                swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this blog!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                      allBlogData.splice(index,1);
                      localStorage.setItem(User+"__allBlogData",JSON.stringify(allBlogData));
                      getblogData();
                      swal("Poof! Your blog has been deleted!", {
                        icon: "success",
                      });
                    } else {
                      swal("Your blog is safe!");
                    }
                  });
            }
        }

        //start blog update coding
        let Ebtn=blogList.querySelectorAll(".edit-btn");
        let bTN=blogForm.querySelectorAll("BUTTON");
        for(let btn of Ebtn){
            btn.onclick=()=>{
                index=btn.getAttribute("index");
                dataStr=btn.getAttribute("data");
                let finaldata=dataStr.replace(/'/g,'"');
                let data=JSON.parse(finaldata);
                bTN[0].disabled=true;
                bTN[1].disabled=false;
                catSelect.value=data.cateogry;
                allbInput[0].value=data.blogName;
                allbInput[1].value=data.discription;
                url=data.blogPic;
                bTN[1].onclick=()=>{
                    var data={
                        createdAt:new Date(),
                        cateogry:catSelect.value,
                        blogName:allbInput[0].value,
                        discription:allbInput[1].value,
                        blogPic:url==="" ? "user1.png" : url,
                    }
                     allBlogData[index]=data
                     localStorage.setItem(User+"__allBlogData",JSON.stringify(allBlogData));
                     swal("Good!","blog updated succesfully!","success");
                     blogForm.reset("");
                     getblogData();
                     bTN[0].disabled=false;
                     bTN[1].disabled=true;
                }
            }

        }
    }
    getblogData();
}


//start profile save coding
let allProfileData=[];
allProfileData=fetchDataFunc(User+"__allProfileData");
const profileSave=()=>{
   let url="";
   let profileForm=document.querySelector(".profile-form");
   let allPInput=profileForm.querySelectorAll("INPUT");
   let ptextArea=document.querySelector("textarea");
   let closeBtn=document.querySelector(".close_btn");
   profileForm.onsubmit=(e)=>{
          e.preventDefault();
          let data={
            createdAt:new Date(),
            Education:ptextArea.value,
            Name:allPInput[0].value,
            Mobile:allPInput[1].value,
            Email:allPInput[2].value,
            Address:allPInput[3].value,
            Skill:allPInput[4].value,
            Dob:allPInput[6].value,
            profile:url==="" ? "user1.png" : url,
          }
          allProfileData.push(data);
          localStorage.setItem(User+"__allProfileData",JSON.stringify(allProfileData));
          swal("Good","profile creadted succesfully","success");
          profileForm.reset("");
          closeBtn.click();
   }
   //upload image coding
   allPInput[5].onchange=()=>{
    let freader=new FileReader();
    freader.readAsDataURL(allPInput[5].files[0]);
    freader.onload=(e)=>{
        url=e.target.result;
    }
   }
}

const profileView=()=>{
    let profileList=document.querySelector(".profile-box");
    let url="";
    //let allProfileData=[];
    //allProfileData=fetchDataFunc(User+"__allProfileData");
    const getProfileData=()=>{
        profileList.innerHTML="";
        allProfileData.forEach((data,index)=>{
            let dataStr=JSON.stringify(data);
            let finaldata=dataStr.replace(/"/g,"'");
           profileList.innerHTML+=`
           
             <div class="col-sm-2"></div>      
           <div class="col-sm-3 shadow p-3">
            <img src="${data.profile}" alt="" width="100" style="margin-left: 30%;">
           </div>
        <div class="col-md-5 shadow text-center p-3">
            <h2 class="text-center mt-2 fw-bold">presonal Detail</h2>
            <hr>
            <b>Name</b>:-<span>${data.Name}</span><br><br>
            <b>Mobile</b>:-<span>${data.Mobile}</span><br><br>
            <b>Email</b>:-<span>${data.Email}</span><br><br>
            <b>Address</b>:-<span>${data.Address}</span><br><br>
            <b>Education</b>:-<span>${data.Education}</span><br><br>
            <b>Skill</b>:-<span>${data.Skill}</span><br><br>
            <b>DOB</b>:-<span>${data.Dob}</span><br><br>
             <b>Created date</b>:-<span>${formatDate(data.createdAt)}</span><br><br>
            <button class="btn btn-danger text-white fw-bold del-btn" index="${index}"><i class="fa fa-trash"></i>Delete</button>
            <button class="btn btn-info text-white fw-bold edit-btn" index="${index}" data="${finaldata}"><i class="fa fa-edit"></i>Edit</button>
         </div>
           <div class="col-sm-2"></div>
           
           `;
        })
        //delete coding
        let pdBtn=profileList.querySelectorAll(".del-btn");
        for(let btn of pdBtn){
           btn.onclick=()=>{
            index=btn.getAttribute("index");
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this profile!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                  allProfileData.splice(index,1);
                  localStorage.setItem(User+"__allProfileData",JSON.stringify(allProfileData));
                  getProfileData();
                  swal("Poof! Your profile has been deleted!", {
                    icon: "success",
                  });
                } else {
                  swal("Your profile is safe!");
                }
              });
           }
        }

        //edit coding
        let pEBtn=profileList.querySelectorAll(".edit-btn");
        let modalBtn=document.querySelector(".model-btn");
        let updateForm=document.querySelector(".update-form");
        updateForm.onsubmit=(e)=>{
            e.preventDefault();
        }
        let allPInput=updateForm.querySelectorAll("INPUT");
        let ptextArea=document.querySelector("textarea");
        let FButton=updateForm.querySelector("BUTTON");
        let mcloseBtn=document.querySelector(".m_close_btn");
        for(let btn of pEBtn){
            btn.onclick=()=>{
                index=btn.getAttribute("index");
                dataStr=btn.getAttribute("data");
                let finaldata=dataStr.replace(/'/g,'"');
                let data=JSON.parse(finaldata);
                allPInput[0].value=data.Name;
                allPInput[1].value=data.Mobile;
                allPInput[2].value=data.Email;
                allPInput[3].value=data.Address;
                ptextArea.value=data.Education;
                allPInput[4].value=data.Skill;
                url=data.profile;
                console.log(url);
                allPInput[6].value=data.Dob;
                modalBtn.click();
                FButton.onclick=()=>{
                    var datal={
                        createdAt:new Date(),
                        Education:ptextArea.value,
                        Name:allPInput[0].value,
                        Mobile:allPInput[1].value,
                        Email:allPInput[2].value,
                        Address:allPInput[3].value,
                        Skill:allPInput[4].value,
                        Dob:allPInput[6].value,
                        profile:url==="" ? "user1.png" : url,
                      }
                       allProfileData[index]=datal;
                       localStorage.setItem(User+"__allProfileData",JSON.stringify(allProfileData));
                       swal("Good","profile updated succesfully","success");
                       updateForm.reset("");
                       mcloseBtn.click();
                       getProfileData();
                }
            }
        }
    }
    getProfileData();
}
let allBlogData=[];
allBlogData=fetchDataFunc(User+"__allBlogData");
let blog_data=document.querySelector(".blog-info");
const blogdata=()=>{
    blog_data.innerHTML="";
    allBlogData.forEach((data,index)=>{
        blog_data.innerHTML+=`
           
 <div class="col-md-3 blog-data">
            <div class="card">
                <img src="${data.blogPic}" alt="" class="w-100">
                <b class="text-center">Name:-<span>${data.cateogry}</span></b>
                <p class="text-center">${data.discription}</p>
                <b class="text-center">CreatedAt</b>
                 <p class="text-center">${formatDate(data.createdAt)}</p>
            </div>
        </div>
        `;
    })
}
blogdata();

