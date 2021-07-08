/* ----------------- animações do menu versão pc -------------------- */ 

document.onwheel = roll; // funçoes para fixar o menu no topo da tela
var logoMenu = document.querySelector("#logo-menu");
logoMenu.style = "opacity: 0%;";
function roll(r){
    let menu = document.querySelector("#navbar");
    let items = document.querySelectorAll("[data-menu=item]");
    let min = window.pageYOffset;
    let logo = document.querySelector("#logo");
    if(min > 0){
        menu.setAttribute("style", "transition: 2s; width: 100%; top: 0; position: fixed;");
        if(window.innerWidth > 900){
            menu.setAttribute("class", "navbar navbar-expand-lg navbar-light bg-light");
            
        }
        logoMenu.setAttribute("style", "opacity: 100%;");
        logo.setAttribute("style", "opacity: 0%; transiton: 1s;");
        items.forEach(function changeColor(change){
            change.setAttribute("class", "navbar-brand text-dark");
            
        })
    } 
    if(min === 0){
        menu.removeAttribute("style", "top");
        logoMenu.setAttribute("style", "opacity: 0%;");
        menu.setAttribute("style", "position: relative;");
        menu.setAttribute("class", "navbar navbar-expand-lg navbar-light bg-danger");
        logo.setAttribute("style", "opacity: 100%; transition: 1s;");
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
hamburguer.style.backgroundColor = "white";
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
