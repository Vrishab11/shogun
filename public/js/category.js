const catname = document.getElementById('catName')
const catimage = document.getElementById('catimage')
const catform = document.getElementById('catform')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')

function notnull(data)
{
    if(data.trim()==="")
    {
        error1.innerHTML = "Please Enter Category Name."
        error1.style.display = "block"
    }else if (data.trim().length === 0) {
        error1.innerHTML = "Category Name cannot be just whitespace.";
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

catname.addEventListener('keyup',()=>{
    const cdata = catname.value
    notnull(cdata)
})
catname.addEventListener('blur',()=>{
    const cdata = catname.value
    notnull(cdata)
})

catimage.addEventListener('change',()=>{
    const i1data = catimage.files
    imgval(i1data)
})

catform.addEventListener('submit',(e)=>{

    const cdata = catname.value
    const i1data = catimage.files

    imgval(i1data)
    notnull(cdata)

    if(error1.innerHTML !== "" || error2.innerHTML !== "" )
    {
        e.preventDefault()
    }
})


document.getElementById('catimage').addEventListener('change', function(event) {
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