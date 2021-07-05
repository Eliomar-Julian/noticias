/* ----------------- animações do menu versão pc -------------------- */ 

document.onwheel = roll; // funçoes para fixar o menu no topo da tela
function roll(r){
    let menu = document.querySelector("#navbar");
    let items = document.querySelectorAll("[data-menu=item]");
    let min = window.pageYOffset;
    let logo = document.querySelector("#logo");
    if(min > 0){
        menu.setAttribute("style", "transition: 2s; top: 0; position: fixed; width: 100%;")
        menu.setAttribute("class", "navbar navbar-expand-lg navbar-light bg-light");
        logo.setAttribute("style", "display: none;");
        items.forEach(function changeColor(change){
            change.setAttribute("class", "navbar-brand text-dark");
            change.setAttribute("style", "transition: 0.4s; border-bottom: 1px solid gray;")
            
        })
    } 
    if(min === 0){
        menu.removeAttribute("style", "top");
        menu.setAttribute("style", "position: relative;");
        menu.setAttribute("class", "navbar navbar-expand-lg navbar-light bg-danger");
        logo.setAttribute("style", "display: flex;");
        items.forEach(function reChangedColor(change){
            change.setAttribute("class", "navbar-brand text-light")
            change.removeAttribute("style");
        })
    }
}


///* ----------------- animações do menu versão touch -------------------- */ 

document.addEventListener("touchmove", detect);
function detect(e){
    if (window.pageYOffset > 0){
        roll();
    }
    else{
        roll();
    }
}

// menu responsivo para telas estritas

let hamburguer = document.querySelector(".navbar-toggler");
let expandir = document.querySelector(".collapse.navbar-collapse");
var show = false;
hamburguer.addEventListener("click", revelar);
function revelar(){
  if (show == false){
    expandir.classList.add("d-block");
    expandir.setAttribute("style", "transition: all 2s;")
    show = true;
  }
  else{
    expandir.classList.remove("d-block");
    show = false;
  }
  
};

/* -----------manipulando ajax de login ------------------- */
// troca de mensagens por baixo do pano entre cliente e servidor...
$("#btn-login").click(function(event) {
    event.preventDefault();
    let name = $("[name=user]").val();
    let pass = $("[name=password]").val();
    let perm = $("#connected").is(":checked");
    let messages = document.querySelectorAll("[data-message]");
    let url = window.location.origin + window.location.pathname;
    console.log(url);
    $.ajax({
        url: url.toString(),
        method:"POST",
        data: {user: name, password: pass, expired:perm},
        success: function(response) {
            if (response.message === "errorName"){
                messages[0].setAttribute("style", "visibility: visible");
                setTimeout(function(){
                    messages[0].setAttribute("style", "visibility: hidden")
                }, 5000)
            }else if (response.message === "errorPassword"){
                messages[1].setAttribute("style", "visibility: visible");
                setTimeout(function(){
                    messages[1].setAttribute("style", "visibility: hidden")
                }, 5000)
            } else if (response.message === "success") {
                window.location.replace("admin/" + response.session);
            }
        }
    })
})
