const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const mob = document.getElementById('mobile')
const pass = document.getElementById('password')
const cpass = document.getElementById('cpassword')

const registerform = document.getElementById('registerForm')
const error1 = document.getElementById('fnameerror')
const error2 = document.getElementById('lnameerror')
const error3 = document.getElementById('emailerror')
const error4 = document.getElementById('moberror')
const error5 = document.getElementById('passerror')
const error6 = document.getElementById('confirmpasserror')




function fnamevalidate(name)
{   
    const namepattern = /^[a-zA-Z]+$/
    if(name.trim()==="")
    {
        error1.innerHTML = "Please Enter Firstname."
        error1.style.display = "block"
    }
    else if(!namepattern.test(name))
    {
        error1.innerHTML = "Name should only include Alphabets."
        error1.style.display = "block"
    }
    else{
        error1.innerHTML = ""
        error1.style.display = "none"
    }
}

function lnamevalidate(name)
{   
    const namepattern = /^[a-zA-Z]+$/
    if(name.trim()==="")
    {
        error2.innerHTML = "Please Enter Lastname."
        error2.style.display = "block"
    }
    else if(!namepattern.test(name))
    {
        error2.innerHTML = "Name should only include Alphabets."
        error2.style.display = "block"
    }
    else{
        error2.innerHTML = ""
        error2.style.display = "none"
    }
}





function emailfunc(emaild)
{
    const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/
    if(emaild.trim()==="")
    {   
        error3.innerHTML = "Please Enter Email."
        error3.style.display = "block"
    }
    else if(!emailpattern.test(emaild))
    {
        error3.innerHTML = "Invalid Format !!"
        error3.style.display = "block"
    }
    else{
        error3.innerHTML = ""
        error3.style.display = "none"
    }
}


function mobvalidate(mob)
{
    const mobpattern = /^\d+$/
    if(mob.trim()==="")
    {
        error4.innerHTML = "Please Enter Mobile Number."
        error4.style.display = "block"
    }
    else if(!mobpattern.test(mob))
    {
        error4.innerHTML = "Please Enter Digits."
        error4.style.display = "block"
    }
    else if(mob.length!== 10)
    {
        error4.innerHTML = "Please Enter Atleast 10 Digits."
        error4.style.display = "block"
    }
    else{
        error4.innerHTML = ""
        error4.style.display = "none"
    }
}

function passfunc(pwd)
{   const passpattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    if(pwd.trim()==="")
    {
        error5.innerHTML = "Please Enter Password."
        error5.style.display = "block"
    }
    else if(!passpattern.test(pwd))
    {
        error5.innerHTML = "Password should only include Numbers and Alphabets."
        error5.style.display = "block"
    }
    else if(pwd.length < 8)
    {
        error5.innerHTML = "Please Enter Atleast 8 characters"
        error5.style.display = "block"
    }
    else{
        error5.innerHTML = ""
        error5.style.display = "none"

    }
}

function confirmpassfunc(pwd)
{   const passpattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    if(pwd.trim()==="")
    {
        error6.innerHTML = "Please Enter Password."
        error6.style.display = "block"
    }
    else if(!passpattern.test(pwd))
    {
        error6.innerHTML = "Password should only include Numbers and Alphabets."
        error6.style.display = "block"
    }
    else if(pwd.length < 8)
    {
        error6.innerHTML = "Please Enter Atleast 8 characters"
        error6.style.display = "block"
    }
    else{
        error6.innerHTML = ""
        error6.style.display = "none"

    }
}


fname.addEventListener('keyup',()=>{
    const fdata = fname.value
    fnamevalidate(fdata)
})
fname.addEventListener('blur',()=>{
    const fdata = fname.value
    fnamevalidate(fdata)
})

lname.addEventListener('keyup',()=>{
    const ldata = lname.value
    lnamevalidate(ldata)
})
lname.addEventListener('blur',()=>{
    const ldata = lname.value
    lnamevalidate(ldata)
})



email.addEventListener('keyup',()=>{
    const emaildata = email.value
    emailfunc(emaildata)
})
email.addEventListener('blur',()=>{
    const emaildata = email.value
    emailfunc(emaildata)
})


mob.addEventListener('keyup',()=>{
    const mdata = mob.value
    mobvalidate(mdata)
})
mob.addEventListener('blur',()=>{
    const mdata = mob.value
    mobvalidate(mdata)
})

pass.addEventListener('keyup',()=>{
    const passdata = pass.value
    passfunc(passdata)
})
pass.addEventListener('blur',()=>{
    const passdata = pass.value
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

registerform.addEventListener('submit',(event)=>{
    const emaildata = email.value
    const passdata = pass.value
    const pass1data = cpass.value
    const ldata = lname.value
    const fdata = fname.value
    const mdata = mob.value
    
    mobvalidate(mdata)
    fnamevalidate(fdata)
    lnamevalidate(ldata)
    emailfunc(emaildata)
    passfunc(passdata)
    confirmpassfunc(pass1data)


    if(error1.innerHTML !== "" || error2.innerHTML !== "" || error3.innerHTML !== "" || error4.innerHTML !== "" || error5.innerHTML !== "" || error6.innerHTML !== "")
    {
        event.preventDefault()
    }
})