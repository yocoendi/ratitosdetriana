// 1. Selección de elementos (Añadimos 'menu' que faltaba)
const menu = document.querySelector('.menu-hamburguesa'); // <--- Asegúrate que esta clase exista en tu HTML
const navegacion = document.querySelector('.navegacion');
const imagenes = document.querySelectorAll('img[data-src]'); // Solo las que tienen lazy loading
const contenedorPlatos = document.querySelector('.platos-container');

// Botones de categorías
const btnTapasFrias = document.querySelector('.tapasfrias');
const btnMarisco = document.querySelector('.marisco');
const btnGuisos = document.querySelector('.guisos');
const btnChacinas = document.querySelector('.chacinas');
const btnPostres = document.querySelector('.postres');

document.addEventListener('DOMContentLoaded', () => {
    eventos();
    inicializarLazyLoading();
    filtradoPlatos();
});

const eventos = () => {
    // Solo añade el evento si el botón de menú existe para evitar errores
    if (menu) {
        menu.addEventListener('click', () => {
            navegacion.classList.remove('ocultar');
            // Aquí llamarías a botonCerrar() si decides activarlo
        });
    }
}

// 2. Lazy Loading de imágenes (Optimizado)
const inicializarLazyLoading = () => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imagen = entry.target;
                imagen.src = imagen.dataset.src;
                observer.unobserve(imagen);
            }
        });
    });

    imagenes.forEach(imagen => observer.observe(imagen));
}

// 3. Filtrado de Platos (Simplificado)
const filtradoPlatos = () => {
    const platos = Array.from(document.querySelectorAll('.plato'));

    const filtrar = (categoria) => {
        limpiarHtml(contenedorPlatos);
        const filtrados = platos.filter(plato => plato.getAttribute('data-plato') === categoria);
        filtrados.forEach(p => contenedorPlatos.appendChild(p));
    }

    // Eventos de botones (con comprobación de existencia)
    if(btnTapasFrias) btnTapasFrias.addEventListener('click', () => filtrar('tapasfria'));
    if(btnMarisco) btnMarisco.addEventListener('click', () => filtrar('marisco'));
    if(btnGuisos) btnGuisos.addEventListener('click', () => filtrar('guisos'));
    if(btnChacinas) btnChacinas.addEventListener('click', () => filtrar('chacinas'));
    if(btnPostres) btnPostres.addEventListener('click', () => filtrar('postre'));
}

const limpiarHtml = (contenedor) => {
    if (contenedor) {
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
    }
}
