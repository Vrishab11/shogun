const couponcode = document.getElementById('couponcode')
const coupondescription = document.getElementById('coupondescription')
const couponname = document.getElementById('couponname')
const limit = document.getElementById('limit')
const reduction = document.getElementById('reduction')


const couponform = document.getElementById('couponform')


const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const error3 = document.getElementById('error3')
const error4 = document.getElementById('error4')
const error5 = document.getElementById('error5')



function pnameval(data)
{
    if(data.trim()==="")
    {
        error1.innerHTML = "Please Enter Coupon Name."
        error1.style.display = "block"
    }
    else{
        error1.innerHTML = ""
        error1.style.display = "none"
    }
}


function descval(data)
{
    if(data.trim()==="")
    {
        error2.innerHTML = "Please Enter Description."
        error2.style.display = "block"
    }
    else{
        error2.innerHTML = ""
        error2.style.display = "none"
    }
}

function codeval(data)
{
    const codeR = /^[a-zA-Z0-9]+$/


    if(data.trim()==="")
    {
        error3.innerHTML = "Please Enter Coupon Code."
        error3.style.display = "block"
    }
    else if(!codeR.test(data)){
        error3.innerHTML = "Please Enter Alphabets and Digits Only."
        error3.style.display = "block"
    }
    else{
        error3.innerHTML = ""
        error3.style.display = "none"
    }
}

function discval(data)
{
    const nonNegPattern = /^\d+$/;

    if(data.trim()==="")
    {
        error4.innerHTML = "Please Enter Coupon Limit."
        error4.style.display = "block"
    }
    else if(!nonNegPattern.test(data))
    {
        error4.innerHTML = "Please Enter Valid Coupon Limit."
        error4.style.display = "block"
    }
    else{
        error4.innerHTML = ""
        error4.style.display = "none"
    }
}

function disc1val(data)
{
    const nonNegPattern = /^\d+$/;

    if(data.trim()==="")
    {
        error5.innerHTML = "Please Enter Reduction Rate."
        error5.style.display = "block"
    }
    else if(!nonNegPattern.test(data))
    {
        error5.innerHTML = "Please Enter Valid Reduction Rate."
        error5.style.display = "block"
    }
    else{
        error5.innerHTML = ""
        error5.style.display = "none"
    }
}

couponname.addEventListener('keyup',()=>{
    const pdata = couponname.value
    pnameval(pdata)
})
couponname.addEventListener('blur',()=>{
    const pdata = couponname.value
    pnameval(pdata)
})

coupondescription.addEventListener('keyup',()=>{
    const ddata = coupondescription.value
    descval(ddata)
})
coupondescription.addEventListener('blur',()=>{
    const ddata = coupondescription.value
    descval(ddata)
})
couponcode.addEventListener('keyup',()=>{
    const codedata = couponcode.value
    codeval(codedata)
})
couponcode.addEventListener('blur',()=>{
    const codedata = couponcode.value
    codeval(codedata)
})
limit.addEventListener('keyup',()=>{
    const pdata = limit.value
    discval(pdata)
})
limit.addEventListener('blur',()=>{
    const pdata = limit.value
    discval(pdata)
})
reduction.addEventListener('keyup',()=>{
    const reddata = reduction.value
    disc1val(reddata)
})
reduction.addEventListener('blur',()=>{
    const reddata = reduction.value
    disc1val(reddata)
})

couponform.addEventListener('submit',(e)=>{
    const pdata = couponname.value
    const ddata = coupondescription.value
    const pedata = limit.value
    const reddata = reduction.value
    const codedata = couponcode.value

    codeval(codedata)
    disc1val(reddata)
    discval(pedata)
    descval(ddata)
    pnameval(pdata)

    if(error1.innerHTML !=="" || error2.innerHTML !=="" || error3.innerHTML !=="" || error4.innerHTML !== "" || error5.innerHTML !== "")
    {
        e.preventDefault()
    }
})