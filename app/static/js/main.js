/* ----------------- animações do menu --------------------- */ 

document.onwheel = roll; // funçoes para fixar o menu no topo da tela
function roll(r){
    let menu = document.querySelector("#navbar");
    let top = menu.offsetTop;
    let min = window.pageYOffset;
    let logo = document.querySelector("#logo");
    let goTop = document.querySelector("[name=go-top]");
    goTop.addEventListener("click", (e)=>{
        window.scrollTo({top: 0, behavior: "smooth"});
    })
    if(min > 0){
        menu.setAttribute("style", "transition: 2s; top: 0; position: fixed; width: 100%;")
        menu.setAttribute("class", "navbar navbar-light bg-warning");
        logo.setAttribute("style", "display: none;");
    } 
    if(min === 0){
        menu.removeAttribute("style", "top");
        menu.setAttribute("style", "position: relative;");
        menu.setAttribute("class", "navbar navbar-light bg-danger");
        logo.setAttribute("style", "display: flex;");
    }

}

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