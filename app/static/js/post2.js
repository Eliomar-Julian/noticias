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
let idPoste, datePoste, categoryPoste, titlePoste, postPost, imagePoste;
function editor(e){
    let cols = document.querySelectorAll("[data-header=cols]")[1];
    idPoste = document.querySelector("[name=id]");
    datePoste = document.querySelector("[name=date]");
    categoryPoste = document.querySelector("[name=category]");
    titlePoste = document.querySelector("[name=title]");
    postPoste = document.querySelector("[name=text]");
    imagePoste = document.querySelector("[name=link-image]");
    console.log(postPoste.value);

    idPoste.value = e.querySelector("[name=id]").value;
    datePoste.value = e.querySelector("[name=date]").value;
    categoryPoste.value = e.querySelector("[name=category]").value;
    titlePoste.value = e.querySelector("[name=title]").value;
    postPoste.value = e.querySelector("[name=post]").value;
    imagePoste.value = e.querySelector("[name=image]").value;
    cols.click()
}