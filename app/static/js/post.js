// gerenciador de abas da area de postagem......................

let cols = document.querySelectorAll("[data-header=cols]");
let items = document.querySelectorAll("[data-item]")
cols.forEach((elem, index)=>{
    elem.addEventListener("click", (event)=>{
        elem.setAttribute("class", "btn btn-outline-light");
        items[index].setAttribute("style", "display: block");
        for(var i = 0; i < cols.length; i++){
            if(i !== index){
                cols[i].setAttribute("class", "btn btn-danger");
                items[i].setAttribute("style", "display: none")
            }
        }
    })
})


//    ------------------- postagem ---------------------------
//  filtrando entrada da materia
let pst = document.querySelector("#posting");
let tool1 = document.querySelector("[data-tool1]");
let tool1Div = document.querySelector("[data-tool1=div]");
let texto = document.querySelector("[name=text]");
let emptyText = new String();
let aberto = false;
pst.addEventListener("click", (e) => {
    emptyText = texto.value.replace(/\n/g, "<br>")
    texto.value = emptyText.replace(/\'/g, "&lsquo;");
    
    pst.setAttribute("type", "submit");
})






