/* ------pegando categorias do menu dinamicamente------------*/
// apos pegar será usado na opção de cadastro de noticias
let lis = $("[data-menu=item]");
let cat = document.querySelector("#category");
let max = lis.length;
for (var i=0;i < max;i++){
    var opt = document.createElement("option");
    opt.value = lis[i].pathname.replace("/", "");
    opt.innerText = lis[i].pathname.replace("/", "").toUpperCase();
    cat.appendChild(opt);
}


/*------- Pegar click para edição da postagem --------------*/
// pega os cliques............
let id, category, title, post, image;
function editor(e){
    id = e.querySelector("[name=id]");
    console.log(id);
}