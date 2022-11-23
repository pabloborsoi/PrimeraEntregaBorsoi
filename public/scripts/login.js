window.addEventListener("load", function () {
  //llamamos a las variables para validacion
  let formulario = document.querySelector("form");
  let campoEmail = document.querySelector("#correo");
  let campoClave = document.querySelector("#clave");
  let esUnCorreo = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  let ulErrores = document.querySelector("div.errores ul");

  formulario.addEventListener("submit", function (e) {
    let errores = [];
    while( ulErrores.hasChildNodes() ){
        ulErrores.removeChild(ulErrores.lastChild);
    }

    if (campoEmail.value == "") {
      errores.push("Por favor completar email");
    } 
    else if (!campoEmail.value.match(esUnCorreo)) {
      errores.push("No es un formato de email valido");
    }
    if (campoClave.value == "") {
      errores.push("Por favor completar la contraseña");
    }
    console.log(errores)

    if (errores.length > 0) {
      e.preventDefault();

      for (let i = 0; i < errores.length; i++) {
        ulErrores.innerHTML += "<li class=error>" + errores[i] + "</li>";
      }
    }
  });
});
