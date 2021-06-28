// gerenciador de abas da area de postagem......................

let cols = document.querySelectorAll("[data-header=cols]");
let items = document.querySelectorAll("[data-item]")
cols.forEach((elem, index)=>{
    elem.addEventListener("click", (event)=>{
        elem.setAttribute("class", "btn btn-outline-info");
        items[index].setAttribute("style", "display: block");
        for(var i = 0; i < cols.length; i++){
            if(i !== index){
                cols[i].setAttribute("class", "btn btn-info");
                items[i].setAttribute("style", "display: none")
            }
        }
    })
})


//    ------------------- postagem ---------------------------

let pst = document.querySelector("#posting");
let tool1 = document.querySelector("[data-tool1]");
let tool1Div = document.querySelector("[data-tool1=div]");
let texto = document.querySelector("[name=text]");
let aberto = false;
let emptyText = new String();
pst.addEventListener("click", (e) => {
    for(var i=0;i<texto.value.length;i++){
        if(texto.value[i] !== "\n"){
            emptyText += texto.value[i];
        }
    }
    texto.value = emptyText.replace("\\n", "<br>");
    pst.setAttribute("type", "submit");
})
tool1.addEventListener("click", revela);

function revela(){
    tool1Div.setAttribute("style", "display: block;")
    let too1Face = document.querySelector("[name=too1-face]");
    let too1Link = document.querySelector("[name=too1-link]");
    let too1Btn = document.querySelector("#too1");
    let insert = "";
    too1Btn.addEventListener("click", ()=>{
        insert = `<a href="${too1Link.value}">${too1Face.value}</a>`;
        texto.value += insert;
        insert = "";
    })
}



