const pass = document.getElementById('password')
const npass = document.getElementById('npassword')
const cpass = document.getElementById('cpassword')
const changePass = document.getElementById('changePass')
const error1 = document.getElementById('passerror')
const error2 = document.getElementById('newpass')
const error3 = document.getElementById('confirmpass')


function passfunc(pwd)
{   
    const passpattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    if(pwd.trim()==="")
    {
        error1.innerHTML = "Please Enter Password."
        error1.style.display = "block"
    }
    else if(!passpattern.test(pwd))
    {
        error1.innerHTML = "Password should only include Numbers and Alphabets."
        error1.style.display = "block"
    }
    else if(pwd.length < 8)
    {
        error1.innerHTML = "Please Enter Atleast 8 characters"
        error1.style.display = "block"
    }
    else{
        error1.innerHTML = ""
        error1.style.display = "none"

    }
}
function pass1func(pwd){
    const passpattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    if(pwd.trim()==="")
    {
        error2.innerHTML = "Please Enter Password."
        error2.style.display = "block"
    }
    else if(!passpattern.test(pwd))
    {
        error2.innerHTML = "Password should only include Numbers and Alphabets."
        error2.style.display = "block"
    }
    else if(pwd.length < 8)
    {
        error2.innerHTML = "Please Enter Atleast 8 characters"
        error2.style.display = "block"
    }
    else{
        error2.innerHTML = ""
        error2.style.display = "none"

    }
}

function confirmpassfunc(pwd)
{   const passpattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    if(pwd.trim()==="")
    {
        error3.innerHTML = "Please Enter Password."
        error3.style.display = "block"
    }
    else if(!passpattern.test(pwd))
    {
        error3.innerHTML = "Password should only include Numbers and Alphabets."
        error3.style.display = "block"
    }
    else if(pwd.length < 8)
    {
        error3.innerHTML = "Please Enter Atleast 8 characters"
        error3.style.display = "block"
    }
    else{
        error3.innerHTML = ""
        error3.style.display = "none"

    }
}


pass.addEventListener('keyup',()=>{
    const passdata = pass.value
    passfunc(passdata)
})
pass.addEventListener('blur',()=>{
    const passdata = pass.value
    passfunc(passdata)
})

npass.addEventListener('keyup',()=>{
    const passdata = npass.value
    pass1func(passdata)
})
npass.addEventListener('blur',()=>{
    const passdata = npass.value
    pass1func(passdata)
})

cpass.addEventListener('keyup',()=>{
    const passdata = cpass.value
    confirmpassfunc(passdata)
})
cpass.addEventListener('blur',()=>{
    const passdata = cpass.value
    confirmpassfunc(passdata)
})

changePass.addEventListener('submit',(event)=>{

    const passdata = pass.value
    const pass1data = npass.value
    const pass2data = cpass.value

    passfunc(passdata)
    pass1func(pass1data)
    confirmpassfunc(pass2data)


    if(error1.innerHTML !== "" || error2.innerHTML !== "" || error3.innerHTML !== "")
    {
        event.preventDefault()
    }
})