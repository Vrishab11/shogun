const pass = document.getElementById('password')
const npass = document.getElementById('npassword')
const cpass = document.getElementById('cpassword')
const changePass = document.getElementById('changePass')
const error1 = document.getElementById('passerror')
const error2 = document.getElementById('newpass')
const error3 = document.getElementById('confirmpass')
const ntogglePassword = document.getElementById('ntogglePassword');
const ctogglePassword = document.getElementById('ctogglePassword');
const neyeIcon = document.getElementById('neyeIcon');
const ceyeIcon = document.getElementById('ceyeIcon');


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

ntogglePassword.addEventListener('click', () => {
    const type = npass.getAttribute('type') === 'password' ? 'text' : 'password';
    npass.setAttribute('type', type);

    neyeIcon.classList.toggle('fa-eye');
    neyeIcon.classList.toggle('fa-eye-slash');
})

ctogglePassword.addEventListener('click', () => {
    const type = cpass.getAttribute('type') === 'password' ? 'text' : 'password';
    cpass.setAttribute('type', type);

    ceyeIcon.classList.toggle('fa-eye');
    ceyeIcon.classList.toggle('fa-eye-slash');
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


const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const mob = document.getElementById('mobile')
const profileForm = document.getElementById('profileChange')

const error4 = document.getElementById('error4')
const error5 = document.getElementById('error5')
const error6 = document.getElementById('error6')


function fnamevalidate(name)
{   
    const namepattern = /^[a-zA-Z]+$/
    if(name.trim()==="")
    {
        error4.innerHTML = "Please Enter Firstname."
        error4.style.display = "block"
    }
    else if(!namepattern.test(name))
    {
        error4.innerHTML = "Name should only include Alphabets."
        error4.style.display = "block"
    }
    else{
        error4.innerHTML = ""
        error4.style.display = "none"
    }
}

function lnamevalidate(name)
{   
    const namepattern = /^[a-zA-Z]+$/
    if(name.trim()==="")
    {
        error5.innerHTML = "Please Enter Lastname."
        error5.style.display = "block"
    }
    else if(!namepattern.test(name))
    {
        error5.innerHTML = "Name should only include Alphabets."
        error5.style.display = "block"
    }
    else{
        error5.innerHTML = ""
        error5.style.display = "none"
    }
}

function mobvalidate(mob)
{
    const mobpattern = /^\d+$/
    if(mob.trim()==="")
    {
        error6.innerHTML = "Please Enter Mobile Number."
        error6.style.display = "block"
    }
    else if(!mobpattern.test(mob))
    {
        error6.innerHTML = "Please Enter Digits."
        error6.style.display = "block"
    }
    else if(mob.length!== 10)
    {
        error6.innerHTML = "Please Enter Atleast 10 Digits."
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
mob.addEventListener('keyup',()=>{
    const mdata = mob.value
    mobvalidate(mdata)
})
mob.addEventListener('blur',()=>{
    const mdata = mob.value
    mobvalidate(mdata)
})

profileForm.addEventListener('submit',(event)=>{
    const ldata = lname.value
    const fdata = fname.value
    const mdata = mob.value
    
    mobvalidate(mdata)
    fnamevalidate(fdata)
    lnamevalidate(ldata)

    if(error4.innerHTML !== "" || error5.innerHTML !== "" || error6.innerHTML !== "")
    {
        event.preventDefault()
    }
})