window.addEventListener('load', function(){
    let formulario = document.querySelector('form');
    formulario.addEventListener('submit',(e)=>{
        

        let tienenQueSerEstosFormatos = /(\.jpg|\.jpeg|\.png|\.gif|\.tiff)$/i;
        let campoEmail = document.querySelector ("#correo");
        let campoClave = document.querySelector ("#clave");
        let esUnCorreo = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        let campoNombre = document.querySelector ("#nombre");
        let campoCountry = document.querySelector ("#country");
        let campoFoto = document.querySelector ("#foto");
        let ulErrores = document.querySelector('div.errores ul')

        let errores = [];

        while( ulErrores.hasChildNodes() ){
            ulErrores.removeChild(ulErrores.lastChild);
        }

        if (campoNombre.value == ""){
            errores.push ("Por favor, escribe tu nombre completo")
        }
        else if (campoNombre.value.length < 2){
            errores.push  ("Tu nombre completo debe tener mas de una letra")
        }
        if (campoEmail.value == ""){
            errores.push ("Por favor, escribe tu correo")
        }
        else if (!campoEmail.value.match (esUnCorreo) ){
            errores.push  ("Por favor, escribe tu Email")
        }
        if(campoClave.value == ''){
            errores.push('Por favor, escribe tu contraseña');   
        }
        else if (campoClave.value.length < 8){
            errores.push('La contraseña debe tener al menos 8 caracteres');
        }
        if(campoCountry.value == ''){
            errores.push('Por favor, elige un pais');   
        }
        if (campoFoto.value==""){
            errores.push ('Por favor, subir tu foto')
        }
        else if (!campoFoto.value.match (tienenQueSerEstosFormatos)){
            errores.push ('Por favor, subir tu foto con formato de foto valido!')
        }
        console.log(errores)

        if(errores.length > 0){
            e.preventDefault();

            for (let i = 0; i < errores.length; i++) {
                ulErrores.innerHTML += '<li class=error>' + errores[i] + '</li>'
            }
        } else{
            formulario.submit();
        }
    });
});