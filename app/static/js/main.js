/* ----------------- animações do menu versão pc -------------------- */ 

document.onwheel = roll; // funçoes para fixar o menu no topo da tela
var logoMenu = document.querySelector("#logo-menu");
var menu = document.querySelector("#navbar");
logoMenu.style = "opacity: 0%;";
function roll(r){
    
    let items = document.querySelectorAll("[data-menu=item]");
    let min = window.pageYOffset;
    let logo = document.querySelector("#logo");
    if(min > 0){
        menu.setAttribute("style", "transition: 2s; width: 100%; top: 0; position: fixed;");
        //if(window.innerWidth > 900){
          //  menu.setAttribute("class", "navbar navbar-expand-lg navbar-light");
            
        //}
        logoMenu.setAttribute("style", "opacity: 100%;");
        logo.setAttribute("style", "opacity: 0%; transiton: 1s;");
        items.forEach(function changeColor(change){
            change.setAttribute("class", "navbar-brand");
            change.setAttribute("style", "padding: 0px; color: #ffffff;");
            
        })
    } 
    if(min === 0){
        menu.removeAttribute("style", "top");
        logoMenu.setAttribute("style", "opacity: 0%;");
        menu.setAttribute("style", "position: relative;");
        menu.setAttribute("class", "navbar navbar-expand-lg navbar-light");
        logo.setAttribute("style", "opacity: 100%; transition: 1s;");
        items.forEach(function reChangedColor(change){
            change.setAttribute("class", "navbar-brand text-light")
            //change.removeAttribute("style");
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
    
    expandir.setAttribute("style", "transition: all 2s ease; height: 100%;")
    expandir.classList.add("d-block");
    
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


//----------------------buscas //------------------------------------//

var btSearch = document.querySelector("#button-search");
var svgs = document.querySelectorAll("svg");
var input = document.querySelector("[type=search]");
var expand = false;
svgs[1].style.filter = "invert(100%)";
svgs[1].style.display = "none";
btSearch.addEventListener("click", busca);
function busca(){
    if(expand === false){
        input.setAttribute("style", "visibility: visible; width: 50%;");
        svgs[0].style.display ="none";
        svgs[1].style.display = "block";
        expand = true;
    }else if (expand === true){
        input.setAttribute("style", "visibility: hidden;");
        svgs[0].style.display ="block";
        svgs[1].style.display = "none";
        expand = false;
    }
}

// ------------------ ver mais --------------------------------------------//

var mais = document.querySelectorAll("[data-more=show-more]");
var btMais = document.querySelector("#show-more");
var expandMore = false;
svgs[3].style.display = "none";
btMais.addEventListener("click", aparece);
function aparece(){
    if(expandMore === false){
        for(var i = 0; i < mais.length; i++){
            mais[i].setAttribute("style", "display: inline-block;");
        }
        svgs[2].style.display = "none";
        svgs[3].style.display = "inline-block";
        expandMore = true;
    }else if(expandMore === true){
        for(var i = 0; i < mais.length; i++){
            mais[i].setAttribute("style", "display: none;");
        }
        svgs[2].style.display = "inline-block";
        svgs[3].style.display = "none";
        expandMore = false;
    }
}


// botão compartilhar

function share(title, sub, url){
    if (navigator.share !== undefined) {
		navigator.share({
			title: title,
			text: sub,
			url: 'https://' + url,
		})
		.then(() => console.log('Successful share'))
		.catch((error) => console.log('Error sharing', error));
	}
}
