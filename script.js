const MAX_EQUIPO = 3;

// ----- FILTRO -----
const botonTodos = document.querySelector(".filters .chip");
const botonMarvel = document.querySelector(".chip-marvel");
const botonCapcom = document.querySelector(".chip-capcom");
const cartasGrid = document.querySelectorAll(".characters-grid .character-card");

function activarChip(boton) {
    botonTodos.classList.remove("chip-active");
    botonMarvel.classList.remove("chip-active");
    botonCapcom.classList.remove("chip-active");
    boton.classList.add("chip-active");
}

function mostrarTodos() {
    cartasGrid.forEach(function (carta) {
        carta.classList.remove("oculto");
    });
}

function mostrarSoloMarvel() {
    cartasGrid.forEach(function (carta) {
        if (carta.classList.contains("marvel")) {
            carta.classList.remove("oculto");
        } else {
            carta.classList.add("oculto");
        }
    });
}

function mostrarSoloCapcom() {
    cartasGrid.forEach(function (carta) {
        if (carta.classList.contains("capcom")) {
            carta.classList.remove("oculto");
        } else {
            carta.classList.add("oculto");
        }
    });
}

botonTodos.addEventListener("click", function () {
    activarChip(botonTodos);
    mostrarTodos();
});

botonMarvel.addEventListener("click", function () {
    activarChip(botonMarvel);
    mostrarSoloMarvel();
});

botonCapcom.addEventListener("click", function () {
    activarChip(botonCapcom);
    mostrarSoloCapcom();
});

// ----- SELECCIÓN 3 VS 3 -----
const zonaMarvel = document.getElementById("team-marvel");
const zonaCapcom = document.getElementById("team-capcom");
const contadorMarvel = document.getElementById("count-marvel");
const contadorCapcom = document.getElementById("count-capcom");
const textoVacioMarvel = document.querySelector('[data-empty="marvel"]');
const textoVacioCapcom = document.querySelector('[data-empty="capcom"]');
const barraEmpezar = document.getElementById("start-bar");
const botonEmpezar = document.getElementById("btn-empezar");

let nombresMarvel = [];
let nombresCapcom = [];

function obtenerNombre(carta) {
    const elementoNombre = carta.querySelector(".character-name");
    if (!elementoNombre) return "";
    return elementoNombre.textContent.trim();
}

function encontrarCarta(nombre, tipo) {
    for (let i = 0; i < cartasGrid.length; i++) {
        const carta = cartasGrid[i];
        if (!carta.classList.contains(tipo)) continue;
        if (obtenerNombre(carta) === nombre) return carta;
    }
    return null;
}

function quitarDeEquipo(tipo, nombre) {
    if (tipo === "marvel") {
        nombresMarvel = nombresMarvel.filter(function (n) {
            return n !== nombre;
        });
    } else {
        nombresCapcom = nombresCapcom.filter(function (n) {
            return n !== nombre;
        });
    }
    actualizarEquipos();
}

function actualizarEquipos() {
    zonaMarvel.innerHTML = "";
    zonaCapcom.innerHTML = "";

    cartasGrid.forEach(function (carta) {
        carta.classList.remove("is-picked");
    });

    nombresMarvel.forEach(function (nombre) {
        const original = encontrarCarta(nombre, "marvel");
        if (!original) return;

        original.classList.add("is-picked");

        const copia = original.cloneNode(true);
        copia.classList.remove("oculto");
        copia.addEventListener("click", function () {
            quitarDeEquipo("marvel", nombre);
        });
        zonaMarvel.appendChild(copia);
    });

    nombresCapcom.forEach(function (nombre) {
        const original = encontrarCarta(nombre, "capcom");
        if (!original) return;

        original.classList.add("is-picked");

        const copia = original.cloneNode(true);
        copia.classList.remove("oculto");
        copia.addEventListener("click", function () {
            quitarDeEquipo("capcom", nombre);
        });
        zonaCapcom.appendChild(copia);
    });

    contadorMarvel.textContent = String(nombresMarvel.length);
    contadorCapcom.textContent = String(nombresCapcom.length);

    textoVacioMarvel.style.display = nombresMarvel.length === 0 ? "block" : "none";
    textoVacioCapcom.style.display = nombresCapcom.length === 0 ? "block" : "none";

    const listo =
        nombresMarvel.length === MAX_EQUIPO && nombresCapcom.length === MAX_EQUIPO;

    botonEmpezar.disabled = !listo;
    barraEmpezar.classList.toggle("is-visible", listo);
    barraEmpezar.setAttribute("aria-hidden", listo ? "false" : "true");
}

document
    .querySelector(".characters-grid")
    .addEventListener("click", function (evento) {
        const carta = evento.target.closest(".character-card");
        if (!carta) return;

        const tipo = carta.classList.contains("marvel") ? "marvel" : "capcom";
        const nombre = obtenerNombre(carta);
        if (!nombre) return;

        const lista = tipo === "marvel" ? nombresMarvel : nombresCapcom;
        const yaEsta = lista.indexOf(nombre) !== -1;

        if (yaEsta) {
            quitarDeEquipo(tipo, nombre);
            return;
        }

        if (lista.length >= MAX_EQUIPO) return;

        lista.push(nombre);
        actualizarEquipos();
    });

botonEmpezar.addEventListener("click", function () {
    if (botonEmpezar.disabled) return;
    alert("¡Equipos listos! Aquí podrías empezar el juego.");
});

actualizarEquipos();