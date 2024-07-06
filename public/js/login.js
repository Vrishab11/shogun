const email = document.getElementById('email')
const password = document.getElementById('password')
const logform = document.getElementById('loginForm')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

function emailfunc(emaild)
{
    const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/
    if(emaild.trim()==="")
    {   
        error1.innerHTML = "Please Enter Email."
        error1.style.display = "block"
    }
    else if(!emailpattern.test(emaild))
    {
        error1.innerHTML = "Invalid Format !!"
        error1.style.display = "block"
    }
    else{
        error1.innerHTML = ""
        error1.style.display = "none"
    }
}


function pass(pwd)
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


email.addEventListener('keyup',()=>{
    const emaildata = email.value
    emailfunc(emaildata)
})
email.addEventListener('blur',()=>{
    const emaildata = email.value
    emailfunc(emaildata)
})

password.addEventListener('keyup',()=>{
    const passdata = password.value
    pass(passdata)
})
password.addEventListener('blur',()=>{
    const passdata = password.value
    pass(passdata)
})

togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);

    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
})

logform.addEventListener('submit',(event)=>{

    const emaildata = email.value
    const passdata = password.value
    emailfunc(emaildata)
    pass(passdata)

    if(error1.innerHTML !== "" || error2.innerHTML !== "")
    {
        event.preventDefault()
    }
})  

