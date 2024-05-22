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


document.addEventListener('DOMContentLoaded', function() {
    const catimageInput = document.getElementById('catimage');
    const imagePreview = document.getElementById('imagePreview');
    const closeButton = document.getElementById('closeButton');

    if (catimageInput) {
        catimageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            
            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    closeButton.style.display = 'block';
                };

                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
                closeButton.style.display = 'none';
            }
        });

        closeButton.addEventListener('click', function(event) {
            event.preventDefault();
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
            closeButton.style.display = 'none';
            catimageInput.value = '';
        });
    } else {
        console.error('File input element not found');
    }
});



catform.addEventListener('submit',(e)=>{

    const cdata = catname.value
    const i1data = catimage.files
    if(i1data.length){
        imgval(i1data)
    }
    notnull(cdata)

    if(error1.innerHTML !== "" || error2.innerHTML !== "")
    {
        e.preventDefault()
    }
})
