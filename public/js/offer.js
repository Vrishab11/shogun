const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const error3 = document.getElementById('error3')
const offertitle = document.getElementById('offertitle')
const offerForm = document.getElementById('offerForm')
const discount = document.getElementById('discount')


function notnull(data)
{
    if(data.trim()==="")
    {
        error1.innerHTML = "Please Enter Offer Title"
        error1.style.display = "block"
    }else if (data.trim().length === 0) {
        error1.innerHTML = "Offer title cannot be just whitespace.";
        error1.style.display = "block";
    } 
    else{
        error1.innerHTML = ""
        error1.style.display = "none"
    }
}

function disVal(name)
{   
    if(name.trim()==="")
    {
        error2.innerHTML = "Please enter the discount."
        error2.style.display = "block"
    }
    else if(name <= 0)
    {
        error2.innerHTML = "Discount should not be zero or negative"
        error2.style.display = "block"
    }
    else{
        error2.innerHTML = ""
        error2.style.display = "none"
    }
}

offertitle.addEventListener('keyup',()=>{
    const offerdata = offertitle.value
    notnull(offerdata)
})
offertitle.addEventListener('blur',()=>{
    const offerdata = offertitle.value
    notnull(offerdata)
})


discount.addEventListener('keyup',()=>{
    const discval = discount.value
    disVal(discval)
})
discount.addEventListener('blur',()=>{
    const discval = discount.value
    disVal(discval)
})

offerForm.addEventListener('submit',(e)=>{
    const offertitle = offertitle.value
    const disc = discount.value

    notnull(offertitle)
    disVal(disc)

    if(error1.innerHTML !== "" || error2.innerHTML !== "")
    {
        e.preventDefault()
    }
})