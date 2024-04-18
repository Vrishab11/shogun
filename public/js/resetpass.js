const npass = document.getElementById('npassword')
const cpass = document.getElementById('cpassword')
const resetPass = document.getElementById('resetPass')

const error1 = document.getElementById('newpass')
const error2 = document.getElementById('confirmpass')

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

function confirmpassfunc(pwd)
{   const passpattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/
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

npass.addEventListener('keyup',()=>{
    const passdata = npass.value
    passfunc(passdata)
})
npass.addEventListener('blur',()=>{
    const passdata = npass.value
    passfunc(passdata)
})

cpass.addEventListener('keyup',()=>{
    const passdata = cpass.value
    confirmpassfunc(passdata)
})
cpass.addEventListener('blur',()=>{
    const passdata = cpass.value
    confirmpassfunc(passdata)
})

resetPass.addEventListener('submit',(event)=>{

    const pass1data = npass.value
    const pass2data = cpass.value

    passfunc(pass1data)
    confirmpassfunc(pass2data)


    if(error1.innerHTML !== "" || error2.innerHTML !== "")
    {
        event.preventDefault()
    }
})