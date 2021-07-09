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
var texto = document.querySelector("[name=text]");
let emptyText = new String();
let aberto = false;
pst.addEventListener("click", (e) => {
    emptyText = texto.value.replace(/\n/g, "<br>")
    texto.value = emptyText.replace(/\'/g, "&lsquo;");
    
    pst.setAttribute("type", "submit");
})

// ------------------ botoes de atalhos ------------------------------
function insert(bt){
    var tmpString;
    switch (bt.title) {
        case "Negrito":
            tmpString = `<strong></strong>`;
            break;
        case "Itálico":
            tmpString = `<i></i>`;
            break;
        case "Link":
            tmpString = `<a href="#" class="text-primary">Link</>`;
            break;
        case "Imagem":
            tmpString = `<img src="" data-page alt="imagem" />`;
            break;
        case "Enfase":
            tmpString = `<br><h3 class="h3 text-dark">Enfase</h3><br>`;
            break;

        case "Lista":
            tmpString = `<ul><li>item</li><li>item</li><li>item</li></ul>`;
            break;
        case "Underline":
            tmpString = `<u class="text-danger">Sublinhado</u>`;
            break;

        case "Ads topo":
            tmpString = `<div data-page="ads-top"><img src="" class="img"></div>`;
            break;
    
        default:
            break;
    }
    texto.value += tmpString;
    texto.focus()
}





