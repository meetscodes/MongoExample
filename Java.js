

function validateform() {
    let name=document.getElementById('name');
    let email=document.getElementById('email');
    let password=document.getElementById('password');
    let flag=1
    
    if (name.value  == "") {
        document.getElementById("error-messege").innerHTML = "User name empty";
        flag = 0;
    }
    else{
        document.getElementById("error-messege").innerHTML = "";
        flag = 1;   
     }

     if (email.value == "") {
        document.getElementById("email-error").innerHTML = "User email empyt";
        flag=0;

    }
    else{
        document.getElementById("email-error").innerHTML = "";
        flag = 1;   
     }

     if (password.value == "") {
        document.getElementById("password-messege").innerHTML = "User password empyt";
        flag =0;
    }
    else {
        document.getElementById("password-messege").innerHTML = "";
        flag=1;
    }
    if(flag){
        return true;
    }else{
        return false;
    }
}







