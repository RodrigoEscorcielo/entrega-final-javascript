// <-- Inicio - Entrega FINAL --> 
const apiUrl = "./js/arrayPosters.json";
let arrayCarrito = JSON.parse(localStorage.getItem("arrayCarrito")) || [];
const contendorProductos = document.getElementById("contendorProductos");
const menu = document.getElementById("menu");
const tituloPrincipalH2 = document.getElementById("tituloPrincipal");
tituloPrincipalH2.textContent = "Pósters";

class Posters {
    constructor(id, nombre, precio, tipo, imagen){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.tipo = tipo;
        this.imagen = imagen;
    }
};

function crearProductoElemento(producto, esCarrito = false) {
    const productoContenedor = document.createElement("div");
    productoContenedor.className = "producto";

    const productoImagen = document.createElement("img");
    productoImagen.src = producto.imagen;
    productoImagen.className = "productoImagen";

    const productoDetalles = document.createElement("div");
    productoDetalles.className = "productoDetalles";

    const productoTitulo = document.createElement("h1");
    productoTitulo.textContent = producto.nombre;
    productoTitulo.className = "productoTitulo";

    const productoPrecio = document.createElement("h2");
    productoPrecio.textContent = producto.precio;
    productoPrecio.className = "productoPrecio";

    const productoTipo = document.createElement("p");
    productoTipo.textContent = producto.tipo;
    productoTipo.className = "productoTipo";

    productoDetalles.appendChild(productoTitulo);
    productoDetalles.appendChild(productoTipo);
    productoDetalles.appendChild(productoPrecio);

    if (esCarrito) { 
        const productoEliminar = document.createElement("button");
        productoEliminar.textContent = "Eliminar";
        productoEliminar.className = "productoEliminar";
        productoEliminar.onclick = () => eliminarDelCarrito(producto.id);
        productoEliminar.addEventListener('click', () => {
            Toastify({
                text: "Producto eliminado del carrito",
                duration: 3000,
                style: {
                    background: '#f44336',
                    color: 'white', 
                    borderRadius: '10px', 
                    padding: '15px', 
                    fontSize: '16px'
                }
            }).showToast();
        });

        const productoRestar = document.createElement("button");
        productoRestar.textContent = "-";
        productoRestar.className = "productoEliminar";
        productoRestar.onclick = () => botonRestarCarrito(producto.id);
        
        const productoSumar = document.createElement("button");
        productoSumar.textContent = "+";
        productoSumar.className = "productoEliminar";
        productoSumar.onclick = () => botonSumarCarrito(producto.id);     

        productoDetalles.appendChild(productoSumar);
        productoDetalles.appendChild(productoRestar);
        productoDetalles.appendChild(productoEliminar);

        const productoCantidad = document.createElement("h5");
        productoCantidad.textContent = `cantidad: ${producto.cantidad}`;
        productoDetalles.appendChild(productoCantidad);

        const productoTotal = document.createElement("h5");
        productoTotal.textContent = `Total: ${producto.cantidad * producto.precio}`;;
        productoDetalles.appendChild(productoTotal);

    } else {
        const productoAgregar = document.createElement("button");
        productoAgregar.textContent = "Agregar";
        productoAgregar.className = "productoAgregar";
        productoAgregar.onclick = () => agregarAlCarrito(producto.id);
        productoAgregar.addEventListener('click', () => {
            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000,
                style: {
                    background: '#4CAF50',
                    color: 'white', 
                    borderRadius: '10px', 
                    padding: '15px', 
                    fontSize: '16px'
                }
            }).showToast();
        });
        productoDetalles.appendChild(productoAgregar);
    }

    productoContenedor.appendChild(productoImagen);
    productoContenedor.appendChild(productoDetalles);
    
    return productoContenedor;
}

fetch(apiUrl)
.then(response => response.json())
.then(data => {
    data.forEach(el => todosLosProductos(el));
})
.catch(error => {
    console.error('Error al obtener los productos! ¯\\_(ツ)_/¯', error);
});

function todosLosProductos(producto){
    const productoElemento = crearProductoElemento(producto);
    contendorProductos.appendChild(productoElemento);
}

const botonesProductosFiltrados = tipo => {
    contendorProductos.innerHTML = "";
    tituloPrincipalH2.textContent = "Pósters";
    let filtro;
    if (tipo === 2) {
        tituloPrincipalH2.textContent = "Películas";
        filtro = producto => producto.id <= 8;
    } else if (tipo === 3) {
        tituloPrincipalH2.textContent = "Música";
        filtro = producto => producto.id > 8 && producto.id <= 16;
    }

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const productosFiltrados = filtro ? data.filter(filtro) : data;
        productosFiltrados.forEach(el => todosLosProductos(el));
    })
    .catch(error => {
        console.error('Error al obtener los productos! ¯\\_(ツ)_/¯', error);
    });
}

function agregarAlCarrito(productoId) {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const productoElegido = data.find(el => el.id === productoId);
        if (arrayCarrito.some(producto => producto.id === productoId)) {
            const index = arrayCarrito.findIndex(producto => producto.id === productoId);
            arrayCarrito[index].cantidad++;
        } else {
            const nuevoPoster = new Posters(productoElegido.id, productoElegido.nombre, productoElegido.precio, productoElegido.tipo, productoElegido.imagen);
            nuevoPoster.cantidad = 1;
            arrayCarrito.push(nuevoPoster);
        }
        localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito));
        actualizarNumeroCarrito();
    })
    .catch(error => {
        console.error('Error al obtener los productos! ¯\\_(ツ)_/¯', error);
    });
}

function mostrarCarrito() {
    contendorProductos.innerHTML = "";
    tituloPrincipalH2.textContent = "Carrito";
    if (arrayCarrito.length > 0) {
        arrayCarrito.forEach(producto => {
            const productoElemento = crearProductoElemento(producto, true);
            contendorProductos.appendChild(productoElemento);
        });
    } else {
        contendorProductos.textContent = "Tu carrito está vacío :(";
    }
}

function vaciarCarrito() {
    arrayCarrito = [];
    localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito));
    mostrarCarrito();
    actualizarNumeroCarrito();
}

function actualizarNumeroCarrito() {
    let numeroActualizado = arrayCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    numero.textContent = numeroActualizado;
}

function eliminarDelCarrito(productoId) { 
    const objetoAEliminar = arrayCarrito.find(el => el.id === productoId);
    if (objetoAEliminar) {
        const indiceAEliminar = arrayCarrito.indexOf(objetoAEliminar);
        arrayCarrito.splice(indiceAEliminar, 1);
        localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito));
        mostrarCarrito();
        actualizarNumeroCarrito();
    } 
}

function botonRestarCarrito(productoId){
    const producto = arrayCarrito.find(el => el.id === productoId);
    if (producto && producto.cantidad > 0){
        producto.cantidad--;
        if (producto.cantidad == 0){
            eliminarDelCarrito(productoId);
        }
    }
    mostrarCarrito();
    actualizarNumeroCarrito();
    localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito));
}

function botonSumarCarrito(productoId){
    const producto = arrayCarrito.find(el => el.id === productoId);
    if (producto && producto.cantidad > 0){
        producto.cantidad++;
    }
    mostrarCarrito();
    actualizarNumeroCarrito();
    localStorage.setItem("arrayCarrito", JSON.stringify(arrayCarrito));
}

function total(){
    const total = arrayCarrito.reduce((sum, producto) => {
        return sum + (producto.cantidad * producto.precio);
    }, 0);
    return total;
}

function agregarEventoBotones(){
    const botonesDelMenu = document.querySelectorAll(".botonCategoria");
    botonesDelMenu.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonesDelMenu.forEach(boton => boton.classList.remove("active"));
            e.currentTarget.classList.add("active");
        });
    });
}

const boton1 = document.createElement("button");
boton1.innerHTML = `<i class="bi bi-arrow-90deg-right"></i><li>Todos los productos</li>`;
boton1.className = "botonMenu botonCategoria";
boton1.onclick = () => botonesProductosFiltrados(1);

const boton2 = document.createElement("button");
boton2.innerHTML = `<i class="bi bi-arrow-right-circle"></i><li>Pósters Películas</li>`;
boton2.className = "botonMenu botonCategoria";
boton2.onclick = () => botonesProductosFiltrados(2);

const boton3 = document.createElement("button");
boton3.innerHTML = `<i class="bi bi-arrow-right-circle"></i><li>Pósters Música</li>`;
boton3.className = "botonMenu botonCategoria";
boton3.onclick = () => botonesProductosFiltrados(3);

const boton4 = document.createElement("button");
boton4.innerHTML = `<i class="bi bi-box"></i><li>Carrito</li>`;
boton4.className = "botonMenu botonCategoria";
boton4.onclick = () => mostrarCarrito();
const numero = document.createElement("span"); 
numero.id = "numero"; 
boton4.appendChild(numero); 

const boton5 = document.createElement("button");
boton5.innerHTML = `<i class="bi bi-wallet2"></i><li>Comprar</li>`;
boton5.className = "botonMenu botonCategoria";

boton5.onclick = () => total();
boton5.addEventListener('click', () => {
    const totalValue = total();
    if (totalValue != 0){
        swal({
            title: "¿Quiere confirma su compra?",
            text: `Total a pagar: $${totalValue}`,
            icon: "info",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
            vaciarCarrito();
              swal("Que disfrute de sus nuevos Pósters!!", {
                icon: "success",
              });
            } else {
              swal("Visite nuevamente nuestra tienda!");
            }
          });
    } else {
        swal({
            text: `Tu carrito está vacío :(`,
        })
    }
});

menu.appendChild(boton1);
menu.appendChild(boton2);
menu.appendChild(boton3);
menu.appendChild(boton4);
menu.appendChild(boton5);

agregarEventoBotones();
actualizarNumeroCarrito();
// <-- Fin - Entrega FINAL --> 

