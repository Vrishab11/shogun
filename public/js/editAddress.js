const country = document.getElementById('country')
const state = document.getElementById('state')
const name = document.getElementById('name')
const mobile = document.getElementById('mobile')
const district = document.getElementById('district')
const pin = document.getElementById('pin')
const streetAddress = document.getElementById('streetAddress')
const landmark = document.getElementById('landmark')
const error1 = document.getElementById('nameerror')
const error3 = document.getElementById('districterror')
const error2 = document.getElementById('mobileerror')
const error4 = document.getElementById('pinerror')
const error5 = document.getElementById('countryerror')
const error6 = document.getElementById('stateerror')
const error7 = document.getElementById('streeterror')
const error8 = document.getElementById('landerror')
const addressform = document.getElementById('addressform')

const countrylist ={
    India:[
        'AndhraPradesh',
        'ArunachalPradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'HimachalPradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Maharashtra',
        'MadhyaPradesh',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'TamilNadu',
        'Tripura',
        'Telangana',
        'UttarPradesh',
        'Uttarakhand',
        'WestBengal',
        'Delhi'
    ]

}

window.onload = function(){

    for(let count in countrylist)
    {   
        country.options[country.options.length] = new Option(count,count)
    }
}

country.onchange = (e)=>{
    for(let states of countrylist[e.target.value])
    {   
        state.options[state.options.length] = new Option(states,states)
    }
    
}




function namevalidate(name)
{   
    const namepattern = /^[a-z A-Z]+$/
    if(name.trim()==="")
    {
        error1.innerHTML = "Please Enter Name."
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

function districtvalidate(name)
{   
    const namepattern = /^[a-zA-Z]+$/
    if(name.trim()==="")
    {
        error3.innerHTML = "Please Enter District."
        error3.style.display = "block"
    }
    else if(!namepattern.test(name))
    {
        error3.innerHTML = "District should only include Alphabets."
        error3.style.display = "block"
    }
    else{
        error3.innerHTML = ""
        error3.style.display = "none"
    }
}


function pinvalidate(name)
{   
    const pinpattern = /^\d+$/
    if(name.trim()==="")
    {
        error4.innerHTML = "Please Enter Pincode."
        error4.style.display = "block"
    }
    else if(!pinpattern.test(name))
    {
        error4.innerHTML = "Pincode should be digits."
        error4.style.display = "block"
    }
    else if(name.length !== 6)
    {
        error4.innerHTML = "Pincode should be 6 digits."
        error4.style.display = "block"
    }
    else{
        error4.innerHTML = ""
        error4.style.display = "none"
    }
}



function mobvalidate(mob)
{
    const mobpattern = /^\d+$/
    if(mob.trim()==="")
    {
        error2.innerHTML = "Please Enter Mobile Number."
        error2.style.display = "block"
    }
    else if(!mobpattern.test(mob))
    {
        error2.innerHTML = "Please Enter Digits."
        error2.style.display = "block"
    }
    else if(mob.length!== 10)
    {
        error2.innerHTML = "Please Enter Atleast 10 Digits."
        error2.style.display = "block"
    }
    else{
        error2.innerHTML = ""
        error2.style.display = "none"
    }
}

function countryValidate(data)
{   

    if(data === "")
    {
        error5.innerHTML = "Please select any Country."
        error5.style.display = "block"
    }
    else{
        error5.innerHTML = ""
        error5.style.display = "none"
    }

}


function stateValidate(data)
{
    if(data === "")
    {
        error6.innerHTML = "Please select any State."
        error6.style.display = "block"
    }
    else{
        error6.innerHTML = ""
        error6.style.display = "none"
    }
}


function streetvalidate(name)
{   
    const namepattern = /^[a-z A-Z,().]+$/
    if(name.trim()==="")
    {
        error7.innerHTML = "Please Enter StreetAddress."
        error7.style.display = "block"
    }
    else if(!namepattern.test(name))
    {
        error7.innerHTML = "StreetAddress should only include Alphabets."
        error7.style.display = "block"
    }
    else{
        error7.innerHTML = ""
        error7.style.display = "none"
    }
}


function landvalidate(name)
{   
    const namepattern = /^[a-z A-Z(),.\/]+$/
    if(name.trim()==="")
    {
        error8.innerHTML = "Please Enter Landmark Details."
        error8.style.display = "block"
    }
    else if(!namepattern.test(name))
    {
        error8.innerHTML = "Landmark should only include Alphabets."
        error8.style.display = "block"
    }
    else{
        error8.innerHTML = ""
        error8.style.display = "none"
    }
}

name.addEventListener('keyup',()=>{
    const fdata = name.value
    namevalidate(fdata)
})
name.addEventListener('blur',()=>{
    const fdata = name.value
    namevalidate(fdata)
})

pin.addEventListener('keyup',()=>{
    const fdata = pin.value
    pinvalidate(fdata)
})
pin.addEventListener('blur',()=>{
    const fdata = pin.value
    pinvalidate(fdata)
})


district.addEventListener('keyup',()=>{
    const fdata = district.value
    districtvalidate(fdata)
})
district.addEventListener('blur',()=>{
    const fdata = district.value
    districtvalidate(fdata)
})


country.addEventListener('change',()=>{
    const fdata = country.value
    countryValidate(fdata)
})
country.addEventListener('blur',()=>{
    const fdata = country.value
    countryValidate(fdata)
})


state.addEventListener('change',()=>{
    const fdata = state.value
    stateValidate(fdata)
})
state.addEventListener('blur',()=>{
    const fdata = state.value
    stateValidate(fdata)
})

streetAddress.addEventListener('keyup',()=>{
    const fdata = streetAddress.value
    streetvalidate(fdata)
})
streetAddress.addEventListener('blur',()=>{
    const fdata = streetAddress.value
    streetvalidate(fdata)
})

landmark.addEventListener('keyup',()=>{
    const fdata = landmark.value
    landvalidate(fdata)
})
landmark.addEventListener('blur',()=>{
    const fdata = landmark.value
    landvalidate(fdata)
})


mobile.addEventListener('keyup',()=>{
    const mdata = mobile.value
    mobvalidate(mdata)
})
mobile.addEventListener('blur',()=>{
    const mdata = mobile.value
    mobvalidate(mdata)
})


addressform.addEventListener('submit',(event)=>{

    const fdata = name.value
    const mdata = mobile.value
    const pdata = pin.value
    const ddata = district.value
    const cdata = country.value
    const sdata = state.value
    const stdata = streetAddress.value
    const ldata = landmark.value

    landvalidate(ldata)
    streetvalidate(stdata)
    stateValidate(sdata)
    countryValidate(cdata)
    districtvalidate(ddata)
    pinvalidate(pdata)
    mobvalidate(mdata)
    namevalidate(fdata)

    


    if(error1.innerHTML !== "" || error2.innerHTML !== "" || error3.innerHTML !== "" || error4.innerHTML !== "" || error5.innerHTML !== "" || error6.innerHTML !== "" || error7.innerHTML !== ""|| error8.innerHTML !== "")
    {
        event.preventDefault()
    }
})