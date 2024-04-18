
const bname = document.getElementById('bname')
const bimage = document.getElementById('bimage')
const bform = document.getElementById('bform')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')

function notnull(data)
{
    if(data.trim()==="")
    {
        error1.innerHTML = "Please Enter Brand Name."
        error1.style.display = "block"
    }else if (data.trim().length === 0) {
        error1.innerHTML = "Brand Name cannot be just whitespace.";
        error1.style.display = "block";
    } 
    else{
        error1.innerHTML = ""
        error1.style.display = "none"
    }
}

function imgval(data)
{
    if(data.length === 0)
    {
        error2.innerHTML = "Please Select an Image."
        error2.style.display = "block"
    }
    else if(!data[0].type.startsWith('image/'))
    {
        error2.innerHTML = "Please Select Image files Only."
        error2.style.display = "block"
    }
    else{
        error2.innerHTML = ""
        error2.style.display = "none"
    }
}

bname.addEventListener('keyup',()=>{
    const cdata = bname.value
    notnull(cdata)
})
bname.addEventListener('blur',()=>{
    const cdata = bname.value
    notnull(cdata)
})

bimage.addEventListener('change',()=>{
    const i1data = bimage.files
    imgval(i1data)
})

bform.addEventListener('submit',(e)=>{

    const cdata = bname.value
    const i1data = bimage.files

    imgval(i1data)
    notnull(cdata)

    if(error1.innerHTML !== "" || error2.innerHTML !== "" )
    {
        e.preventDefault()
    }
})


document.getElementById('bimage').addEventListener('change', function(event) {
    console.log('Yoooo');
    const file = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});