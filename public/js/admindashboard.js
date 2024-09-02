const weekbtn = document.getElementById("weekbtn");
const monthbtn = document.getElementById("monthbtn");
const yearbtn = document.getElementById("yearbtn");
const weekchart = document.getElementById("weekchart");
const monthchart = document.getElementById("monthchart");
const yearchart = document.getElementById("yearchart");

let weekValues = [];
let monthNames = [];
let monthValues = [];
let yearHeads = [];
let yearValues = [];
let catHead = [];
let catValues = [];

async function weekReport() {
  try {
    console.log("weekreport");
    const res = await fetch("/admin/dashboard/weekreport");
    const data = await res.json();
    if (data.weekData) {
      weekValues = data.weekData;
      chart1();
    } else {
      Swal.fire({
        title: "Week Data not available",
        imageUrl: "/public/images/paymentfailed.png",
        imageWidth: 200,
        imageHeight: 200,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function monthReport() {
  try {
    console.log("monthreport");
    const res = await fetch("/admin/dashboard/monthreport");
    const data = await res.json();
    if (data.monthdata) {
      console.log(data.monthdata);
      for (let i = 0; i < data.monthdata.length; i++) {
        monthNames.push(data.monthdata[i].month);
        monthValues.push(data.monthdata[i].amount);
      }
      chart2();
    } else {
      Swal.fire({
        title: "Month Data not available",
        imageUrl: "/public/images/paymentfailed.png",
        imageWidth: 200,
        imageHeight: 200,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function yearReport() {
  try {
    console.log("yearreport");
    const res = await fetch("/admin/dashboard/yearreport");
    const data = await res.json();
    if (data.yeardata) {
      for (let i = 0; i < data.yeardata.length; i++) {
        yearHeads.push(data.yeardata[i].year);
        yearValues.push(data.yeardata[i].amount);
      }
      chart3();
    } else {
      Swal.fire({
        title: "Year Data not available",
        imageUrl: "/public/images/paymentfailed.png",
        imageWidth: 200,
        imageHeight: 200,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function categoryReport() {
  try {
    const res = await fetch("/admin/dashboard/categoryreport");
    const data = await res.json();
    if (data.catData) {
      for (let i = 0; i < data.catData.length; i++) {
        catHead.push(data.catData[i]._id);
        catValues.push(data.catData[i].amount);
      }
      doughnut();
    } else {
      Swal.fire({
        title: "Category Data not available",
        imageUrl: "/public/images/paymentfailed.png",
        imageWidth: 200,
        imageHeight: 200,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

window.onload = async function () {
  weekReport();
  categoryReport();
};

weekbtn.addEventListener("click", () => {
  weekReport();
  if (monthchart) {
    monthchart.style.display = "none";
  }
  if (yearchart) {
    yearchart.style.display = "none";
  }
  weekchart.style.display = "block";
});

monthbtn.addEventListener("click", () => {
  monthReport();
  if (weekchart) {
    weekchart.style.display = "none";
  }
  if (yearchart) {
    yearchart.style.display = "none";
  }
  monthchart.style.display = "block";
});

yearbtn.addEventListener("click", () => {
  yearReport();
  if (monthchart) {
    monthchart.style.display = "none";
  }
  if (weekchart) {
    weekchart.style.display = "none";
  }
  yearchart.style.display = "block";
});

function chart1() {
  const ctx = document.getElementById("linechart");

  let Chart1 = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Earnings in Week",
          data: weekValues,
          borderWidth: 1,
          backgroundColor: "#088178",
          borderColor: "#088178",
          color: "#088178",
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

function chart2() {
  const ctx1 = document.getElementById("linechart1");

  let Chart2 = new Chart(ctx1, {
    type: "line",
    data: {
      labels: monthNames.reverse(),
      datasets: [
        {
          label: "Earnings in Month",
          data: monthValues.reverse(),
          borderWidth: 1,
          backgroundColor: "#088178",
          borderColor: "#088178",
          color: "#088178",
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

function chart3() {
  const ctx2 = document.getElementById("linechart2");

  let Chart3 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: yearHeads,
      datasets: [
        {
          label: "Earnings in Year",
          data: yearValues,
          borderWidth: 1,
          backgroundColor: "#088178",
          borderColor: "#088178",
          color: "#088178",
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

function doughnut() {
  const ctx4 = document.getElementById("doughnutchart");

  const Chart4 = new Chart(ctx4, {
    type: "doughnut",
    data: {
      labels: catHead,
      datasets: [
        {
          label: "Earnings",
          data: catValues,
          borderWidth: 1,
          backgroundColor: ["#088178", "#1e96fc", "#fcf300","#00FDDC",'#D90368','#541388','#E952DE','#048A81','#D62246','#17BEBB','#E28413','#247BA0','#FFBFB7'],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}





const prosaletable1 = document.querySelector('#prosaletable1 tbody')
const prosaletable2 = document.querySelector('#prosaletable2')
const prosalesub1 = document.querySelectorAll('.prosalesub1')

const totalProductsCount = document.getElementById("totalProductsCount");
const current = parseInt(document.getElementById("currentPage").value);

const pgmain = document.getElementById("pgmain");
let totalpages = Math.ceil(totalProductsCount.value / 8);


async function nextPage(page)
{
  const res = await fetch(`/admin/dashboard/propage?page=${page}`)
  const data = await res.json()
  if(data.proSold){
    const newdata = document.querySelectorAll(".newdata");
    if (newdata) {
      newdata.forEach((el) => el.remove());
    }
    prosalesub1.forEach(element =>  element.remove());
    prosaletable2.innerHTML = ""
    const newrow1 = document.createElement('tbody')
    newrow1.classList.add('newdata')
    for(let i = 0; i<data.proSold.length;i++)
    {
      const date = new Date(data.proSold[i].date);

        const monthno = date.getMonth();
        function getMonthName(data) {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          return monthNames[data];
        }
        let month = getMonthName(monthno);

      const newrow = document.createElement('tr')
      newrow.classList.add('newdata')
      newrow.innerHTML = `<td>${i + 1}</td>
      <td> ${date.getDate()}&nbsp; ${month} &nbsp;${date.getFullYear()}&nbsp;</td>
      <td>${data.proSold[i].userdetails[0].firstname}&nbsp; ${
    data.proSold[i].userdetails[0].lastname
  }</td>
      <td>${data.proSold[i].prodetails[0].productname}</td>
      <td>${data.proSold[i].products.qty}Pcs</td>
      <td>Rs. ${data.proSold[i].prodetails[0].price}</td>
      <td>Rs.${data.proSold[i].total_amount}</td>
      <td>${data.proSold[i].payment_method}</td>`
      prosaletable1.appendChild(newrow)

      newrow1.innerHTML += `<tr><th>Serial No.</th><td>${i+1}</td> </tr>
      <tr><th>Date Purchased</th>
      <td> ${date.getDate()}&nbsp; ${month} &nbsp;${date.getFullYear()}&nbsp;</td>
      </tr>
      <tr>
          <th>Customer Name</th>
          <td>${data.proSold[i].userdetails[0].firstname}&nbsp; ${data.proSold[i].userdetails[0].lastname}</td>
      </tr>
      <tr>
          <th>Product Name </th>
          <td>${data.proSold[i].prodetails[0].productname }</td>
      </tr>
      <tr>
          <th>Quantity</th>
          <td>${data.proSold[i].products.qty}Pcs</td>
      </tr>
      <tr>
          <th>Price</th>
          <td>Rs. ${data.proSold[i].prodetails[0].price}</td>
      </tr>
      <tr>
          <th>Order Amount</th>
          <td>Rs.${data.proSold[i].total_amount}</td>

      </tr>
      <tr>
          <th>Payment Method</th>
          <td>${data.proSold[i].payment_method}</td>
      </tr>
     <tr><td></td><td></td></tr>`
    }
prosaletable2.appendChild(newrow1)
    console.log(data.proSold)
  proPageLoop(totalpages,page)

  }
  else{
    const newdata = document.querySelectorAll(".newdata");
      if (newdata) {
        newdata.forEach((el) => el.remove());
      }
      prosalesub1.forEach((el) => el.remove());

      const newrow = document.createElement("tr");
      newrow.classList.add("newdata");
      newrow.innerHTML =
        "<td colspan = '8' class='text-center'>NO PRODUCTS AVAILABLE</td>";
      prosaletable1.appendChild(newrow);
  }
}


function proPageLoop(totalpages, currentPage) {
  let beforepage = currentPage - 1;
  let afterpage = currentPage + 1;

  let active;

  if (currentPage === totalpages && totalpages != 1) {
    pgmain.innerHTML = "";
    pgmain.innerHTML = `<button class="pagbtns" id="leftbtn" onclick="nextPage(${
      currentPage - 1
    })"><i class="fa-solid fa-chevron-left"></i></button>`;
    if (totalpages < 4) {
      for (let i = beforepage; i <= currentPage; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        pgmain.innerHTML += `<button class="pagbtns ${active}"  onclick="nextPage(${i})">${i}</button>`;
      }
    } else {
      for (let i = beforepage - 2; i <= currentPage; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        pgmain.innerHTML += `<button class="pagbtns ${active}"  onclick="nextPage(${i})">${i}</button>`;
      }
    }

    if (currentPage != totalpages) {
      pgmain.innerHTML += `<button id="rightbtn" class="pagbtns" onclick="nextPage(${
        currentPage + 1
      })"><i class="fa-solid fa-angle-right"></i></button>`;
    }
  } else if (currentPage === 1) {
    pgmain.innerHTML = "";

    if (totalpages > 2) {
      for (let i = beforepage; i <= afterpage + 2; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        if (i == 0) {
          continue;
        }
        pgmain.innerHTML += `<button class="pagbtns ${active}" onclick="nextPage(${i})">${i}</button>`;
      }
    } else {
      for (let i = beforepage; i < afterpage; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        if (i == 0) {
          continue;
        }
        pgmain.innerHTML += `<button class="pagbtns ${active}" onclick="nextPage(${i})">${i}</button>`;
      }
    }
    if (currentPage != totalpages) {
      pgmain.innerHTML += `<button id="rightbtn" class="pagbtns" onclick="nextPage(${
        currentPage + 1
      })"><i class="fa-solid fa-angle-right"></i></button>`;
    } else {
      pgmain.innerHTML += "";
    }
  } else if (currentPage > 1) {
    pgmain.innerHTML = `<button class="pagbtns" id="leftbtn" onclick="nextPage(${
      currentPage - 1
    })"><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = beforepage; i <= afterpage; i++) {
      if (currentPage === i) {
        active = "selectedbtn";
      } else {
        active = "";
      }
      pgmain.innerHTML += `<button class="pagbtns ${active}"  onclick="nextPage(${i})">${i}</button>`;
    }
    if (currentPage != totalpages) {
      pgmain.innerHTML += `<button id="rightbtn" class="pagbtns" onclick="nextPage(${
        currentPage + 1
      })"><i class="fa-solid fa-angle-right"></i></button>`;
    } else {
      pgmain.innerHTML += "";
    }
  }

  console.log(currentPage);
}

proPageLoop(totalpages, current);




const totalstock = document.getElementById('totalStock')
const totalstockpages = Math.ceil(totalstock.value / 8)
const pgstock = document.getElementById('pgstock')
const stocktable1 = document.querySelector('#stocktable1 tbody')
const stocktable2 = document.querySelector('#stocktable2')
const stocksub1 = document.querySelectorAll('.stocksub1')


async function nextStockPage(page)
{
  try{
  const res = await fetch(`/admin/dashboard/stockpage?page=${page}`)
  const data = await res.json()
  if(data.products)
  {
    const newvalue = document.querySelectorAll('.newvalue')
    if(newvalue)
    {
      newvalue.forEach(el=>el.remove())
    }
    console.log(data.products)
    stocksub1.forEach(el=>el.remove())
    for(let i = 0 ;i < data.products.length ; i++)
    {
      const date = new Date(data.products[i].date);

        const monthno = date.getMonth();
        function getMonthName(data) {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          return monthNames[data];
        }
        let month = getMonthName(monthno);
      const newrow = document.createElement('tr')
      newrow.classList.add('newvalue')
      newrow.innerHTML = `<td>${data.products[i].productname}</td>
      <td>${date.toString().split(' ')[2] }&nbsp;${date.toString().split(' ')[1] }&nbsp;${date.toString().split(' ')[3] }&nbsp;</td>
      <td>Rs.${data.products[i].price }</td>
    `
    if(data.products[i].stock !== 0)
    {
      newrow.innerHTML += ` <td>
      <span class="stockstat2">In Stock</span>
        </td>
        <td>${data.products[i].stock}</td>`
    }
    else{
      newrow.innerHTML += ` <td>
        <span class="stockstat1">Out of Stock</span>
        </td>
        <td>${data.products[i].stock}</td>`
    }
    stocktable1.appendChild(newrow)
    }
    

    stocktable2.innerHTML = ''
    const newtbody = document.createElement('tbody')
    newtbody.classList.add('newvalue')

    for(let i=0 ; i<data.products.length ; i++)
    {
      const date = new Date(data.products[i].date);

        const monthno = date.getMonth();
        function getMonthName(data) {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          return monthNames[data];
        }
        let month = getMonthName(monthno);
      newtbody.innerHTML += `<tr><th>Product Name</th><td>${data.products[i].productname}</td></tr>
      <tr><th>Date Added</th><td>${date.toString().split(' ')[2]}&nbsp;${month}&nbsp;${date.toString().split(' ')[3] }&nbsp;</td></tr>
      <tr><th>Price</th><td>Rs.${data.products[i].price}</td></tr>
      `
      if(data.products[i].stock !== 0)
      {
        newtbody.innerHTML += `<tr><th>Status</th><td>
        <span class="stockstat2">In Stock</span>
    </td></tr><tr><th>Stock</th><td>${ data.products[i].stock}</td></tr>
    <tr><td></td><td></td></tr>`
      }
      else{
        newtbody += `<tr><th>Status</th><td>
        <span class="stockstat1">Out of Stock</span>
    </td></tr><tr><th>Stock</th><td>${ data.products[i].stock}</td></tr>
      <tr><td></td><td></td></tr>`
      }
      
      
    }

    stocktable2.appendChild(newtbody)


    proStockLoop(totalstockpages,page)
  }
  else{
    const newvalue = document.querySelectorAll('.newvalue')
    if(newvalue)
    {
      newvalue.forEach(el=>el.remove())
    }
    const newrow = document.createElement('tr')
    newrow.classList.add('newvalue')
    newrow.innerHTML = "<td colspan = '8' class='text-center'>NO STOCKS</td>"
    stocktable1.appendChild(newrow)
    const newtbody = document.createElement('tbody')
    newtbody.classList.add('newvalue')
    newtbody.innerHTML = `<tr><td>No Stock</td></tr>`
    stocktable2.appendChild(newtbody)
  }
}
catch(err)
{
  window.location.href = '/admin/login'
}
}



function proStockLoop(totalstockpages, currentPage) {

  let beforepage = currentPage - 1;
  let afterpage = currentPage + 1;

  let active;

  if (currentPage === totalstockpages && totalstockpages != 1) {
    pgstock.innerHTML = "";
    pgstock.innerHTML = `<button class="pagbtns" id="leftbtn" onclick="nextStockPage(${
      currentPage - 1
    })"><i class="fa-solid fa-chevron-left"></i></button>`;
    if (totalstockpages < 4) {
      for (let i = beforepage; i <= currentPage; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        pgstock.innerHTML += `<button class="pagbtns ${active}"  onclick="nextStockPage(${i})">${i}</button>`;
      }
    } else {
      for (let i = beforepage - 2; i <= currentPage; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        pgstock.innerHTML += `<button class="pagbtns ${active}"  onclick="nextStockPage(${i})">${i}</button>`;
      }
    }

    if (currentPage != totalstockpages) {
      pgstock.innerHTML += `<button id="rightbtn" class="pagbtns" onclick="nextStockPage(${
        currentPage + 1
      })"><i class="fa-solid fa-angle-right"></i></button>`;
    }
  } else if (currentPage === 1) {
    pgstock.innerHTML = "";

    if (totalstockpages > 2) {
      for (let i = beforepage; i <= afterpage + 2; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        if (i == 0) {
          continue;
        }
        pgstock.innerHTML += `<button class="pagbtns ${active}" onclick="nextStockPage(${i})">${i}</button>`;
      }
    } else {
      for (let i = beforepage; i < afterpage; i++) {
        if (currentPage === i) {
          active = "selectedbtn";
        } else {
          active = "";
        }
        if (i == 0) {
          continue;
        }
        pgstock.innerHTML += `<button class="pagbtns ${active}" onclick="nextStockPage(${i})">${i}</button>`;
      }
    }
    if (currentPage != totalstockpages) {
      pgstock.innerHTML += `<button id="rightbtn" class="pagbtns" onclick="nextStockPage(${
        currentPage + 1
      })"><i class="fa-solid fa-angle-right"></i></button>`;
    } else {
      pgstock.innerHTML += "";
    }
  } else if (currentPage > 1) {
    pgstock.innerHTML = `<button class="pagbtns" id="leftbtn" onclick="nextStockPage(${
      currentPage - 1
    })"><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = beforepage; i <= afterpage; i++) {
      if (currentPage === i) {
        active = "selectedbtn";
      } else {
        active = "";
      }
      pgstock.innerHTML += `<button class="pagbtns ${active}"  onclick="nextStockPage(${i})">${i}</button>`;
    }
    if (currentPage != totalstockpages) {
      pgstock.innerHTML += `<button id="rightbtn" class="pagbtns" onclick="nextStockPage(${
        currentPage + 1
      })"><i class="fa-solid fa-angle-right"></i></button>`;
    } else {
      pgstock.innerHTML += "";
    }
  }

  console.log(currentPage);
}

proStockLoop(totalstockpages, 1);