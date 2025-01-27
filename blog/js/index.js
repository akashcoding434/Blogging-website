//control login code 
let sActiveEl=document.querySelector(".s-active-el");
let lActiveEl=document.querySelector(".l-active-el");
let sBtn=document.querySelector(".s-btn");
let lBtn=document.querySelector(".l-btn");

sBtn.onclick=()=>{
    sActiveEl.style.opacity="0";
    sActiveEl.classList="animate__animated animate__fadeOutUp active-box s-active-el";
    lActiveEl.style.opacity="1";
    lActiveEl.style.zIndex="1";
    lActiveEl.classList="animate__animated animate__fadeInDown active-box l-active-el"
}
lBtn.onclick=()=>{
    lActiveEl.style.opacity="0";
    lActiveEl.classList="animate__animated animate__fadeOutUp active-box s-active-el";
    sActiveEl.style.opacity="1";
    sActiveEl.style.zIndex="1";
    sActiveEl.classList="animate__animated animate__fadeInDown active-box l-active-el"
}

//register coding
let registerForm=document.querySelector(".reg-form");
let allRinput=registerForm.querySelectorAll("INPUT");
let Snotice=document.querySelector(".s_notice");
let sign_btn=document.querySelector("#sign-btn");
let allRegData=[];
if(localStorage.getItem("allRegData")!=null){
    allRegData=JSON.parse(localStorage.getItem("allRegData"));
}
registerForm.onsubmit=(e)=>{
    e.preventDefault();
    let checkEmail=allRegData.find((data,index)=>data.email==allRinput[3].value);
    if(allRinput[0].value!="" && allRinput[1].value!="" && allRinput[2].value!="" && allRinput[3].value!="" && allRinput[4].value!=""){
        if(checkEmail==undefined){
            let data={};
            for(let el of allRinput){
                let key=el.name;
                data[key]=el.value;
            }
            sign_btn.innerHTML="please Wait.....";
            setTimeout(function(){
                sign_btn.innerHTML="SIGN UP";
                allRegData.push(data);
                localStorage.setItem("allRegData",JSON.stringify(allRegData));
                swal("Good","Register Successfully","success");
                registerForm.reset("");
            },3000)
        }
        else{
            swal("warning!","Email already exist","warning");
        }
    }
    else{
        Snotice.innerHTML="Field Is Empty!";
        setTimeout(function(){
            Snotice.innerHTML="";
        },3000);
    }
}

//login coding start
let loginForm=document.querySelector(".login-form");
let allLinput=loginForm.querySelectorAll("INPUT");
let Lnotice=document.querySelector(".l_notice");
let login_btn=document.querySelector("#log-btn");
loginForm.onsubmit=(e)=>{
    e.preventDefault();
    let checkLEmail=allRegData.find((data,index)=>data.email==allLinput[0].value);
    let checkPassword=allRegData.find((data,index)=>data.password==allLinput[1].value);
    if(allLinput[0].value!="" && allLinput[1].value!=""){
         if(checkLEmail!=undefined){
            if(checkPassword!=undefined){
                login_btn.innerHTML="please wait.....";
                setTimeout(function(){
                    login_btn.innerHTML="SIGN IN";
                    window.location="UserDash/user.html";
                    sessionStorage.setItem("User",JSON.stringify(checkLEmail));
                },3000);
            }
            else{
                swal("error!","Password is not matched","error");
            }
         }
         else{
            swal("error!","Email is not matched","error");
         }
    }
    else{
        Lnotice.innerHTML="Field Is Empty!";
        setTimeout(function(){
            Lnotice.innerHTML="";
        },3000); 
    }
}