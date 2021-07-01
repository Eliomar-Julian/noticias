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
tool1.addEventListener("click", revela);

function revela(){
    if (aberto){return;}
    let too1Face = document.querySelector("[name=too1-face]");
    let too1Link = document.querySelector("[name=too1-link]");
    let too1Btn = document.querySelector("#too1");
    let insert = "";
    tool1Div.setAttribute("style", "display: block");
    aberto = true;
    too1Btn.addEventListener("click", function muda(){
        insert = `<a href="${too1Link.value}">${too1Face.value}</a>`;
        texto.value += insert;
        insert = "";
        setTimeout(esconde, 10);        
    })
}
function esconde(){
    tool1Div.setAttribute("style", "display: none");
    aberto = false;
}






