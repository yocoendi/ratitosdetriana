const menu = document.querySelector('.hamburguesa');
const navegacion = document.querySelector('.navegacion');
const imagenes = document.querySelectorAll('img');
const btnTodos = document.querySelector('.todos');
const btntapasfrias = document.querySelector('.tapasfrias');
const btntmariscos = document.querySelector('.mariscos');
const btnguisos = document.querySelector('.guisos');
const btnchacinas = document.querySelector('.chacinas');
const btnPostres = document.querySelector('.postres');
const contenedorPlatos = document.querySelector('.platos-container');
document.addEventListener('DOMContentLoaded',()=>{
    eventos();
    platos();
});

const eventos = () =>{
    menu.addEventListener('click',abrirMenu);
}

const abrirMenu = () =>{
     navegacion.classList.remove('ocultar');
     botonCerrar();
}

const botonCerrar = () =>{
    const btnCerrar = document.createElement('p');
    const overlay  = document.createElement('div');
    overlay.classList.add('pantalla-completa');
    const body = document.querySelector('body');
    if(document.querySelectorAll('.pantalla-completa').length > 0) return;
    body.appendChild(overlay);
    btnCerrar.textContent = 'x';
    btnCerrar.classList.add('btn-cerrar');

/*     while(navegacion.children[5]){
     navegacion.removeChild(navegacion.children[5]);
     } */
    navegacion.appendChild(btnCerrar);   
    cerrarMenu(btnCerrar,overlay);
    
}

const observer = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const imagen = entry.target;
                imagen.src = imagen.dataset.src;
                observer.unobserve(imagen);
            }
        }); 
});


imagenes.forEach(imagen=>{
   
    observer.observe(imagen);
});

const cerrarMenu = (boton, overlay) =>{
    boton.addEventListener('click',()=>{
        navegacion.classList.add('ocultar');
        overlay.remove();
        boton.remove();
    });

    overlay.onclick = function(){
        overlay.remove();
        navegacion.classList.add('ocultar');  
        boton.remove();
    }
}

const platos = () =>{
    let platosArreglo = [];
    const platos = document.querySelectorAll('.plato');

    platos.forEach(plato=> platosArreglo = [...platosArreglo,plato]);

    const tapasfrias = platosArreglo.filter(tapasfria=> tapasfria.getAttribute('data-plato') === 'tapasfria');
    const mariscos = platosArreglo.filter(marisco=> marisco.getAttribute('data-plato') === 'marisco');
    const guisoss = platosArreglo.filter(guisos => guisos.getAttribute('data-plato') === 'guisos');
    const chacinass = platosArreglo.filter(chacinas => chacinas.getAttribute('data-plato') === 'chacinas');
    const postres = platosArreglo.filter(postre=> postre.getAttribute('data-plato') === 'postre');

    mostrarPlatos(tapasfrias, guisoss, chacinass, mariscos, postres, platosArreglo);

}

const mostrarPlatos = (tapasfrias, guisoss, chacinass,mariscos, postres, todos) =>{
    btntapasfrias.addEventListener('click', ()=>{
        limpiarHtml(contenedorPlatos);
        tapasfrias.forEach(tapasfria=> contenedorPlatos.appendChild(tapasfria));
    });
    btntmariscos.addEventListener('click', ()=>{
        limpiarHtml(contenedorPlatos);
        mariscos.forEach(marisco=> contenedorPlatos.appendChild(marisco));
    });

    btnguisos.addEventListener('click', ()=>{
        limpiarHtml(contenedorPlatos);
         guisoss.forEach(guisos=> contenedorPlatos.appendChild(guisos));
    });

    btnchacinas.addEventListener('click', ()=>{
        limpiarHtml(contenedorPlatos);
        chacinass.forEach(chacinas=> contenedorPlatos.appendChild(chacinas));
    });
    btnPostres.addEventListener('click', ()=>{
        limpiarHtml(contenedorPlatos);
        postres.forEach(postre=> contenedorPlatos.appendChild(postre));
    });
    btnTodos.addEventListener('click',()=>{
        limpiarHtml(contenedorPlatos);
        todos.forEach(todo=> contenedorPlatos.appendChild(todo));
    });
}

const limpiarHtml = (contenedor) =>{
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }
}