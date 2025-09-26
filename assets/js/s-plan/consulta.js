
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyADKfjkB9LO1k1smRJ31sOb-7rrxOrQ7lc",
    authDomain: "sigunitropico.firebaseapp.com",
    projectId: "sigunitropico",
    storageBucket: "sigunitropico.appspot.com",
    messagingSenderId: "32992004482",
    appId: "1:32992004482:web:bd4d5e9a2b7a8b976e279b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// **Función para limitar texto**
function limitarTexto(texto, limite) {
    return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
}

// Obtener el botón de login/logout
const logButton = document.getElementById("logButton");
let logoutListenerAdded = false;

// Verificar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
    if (user) {
        logButton.textContent = "Cerrar sesión";
        logButton.classList.remove("btn-primary");
        logButton.classList.add("btn-danger");

        // Prevenir múltiples listeners
        if (!logoutListenerAdded) {
            logButton.addEventListener("click", () => {
                const logoutModal = new bootstrap.Modal(document.getElementById("logoutModal"));
                logoutModal.show();

                const confirmBtn = document.getElementById("confirmLogout");
                const clonedBtn = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(clonedBtn, confirmBtn);

                clonedBtn.addEventListener("click", () => {
                    signOut(auth).then(() => {
                        window.location.href = "https://sigunitropico.com/plan-it-one/pages/sign-in.html";
                    }).catch((error) => {
                        console.error("Error al cerrar sesión:", error);
                    });
                });
            });

            logoutListenerAdded = true;
        }

        // Buscar por correo sanitizado
        const correoSanitizado = user.email.replace(/\./g, "_");
        const userRef = ref(db, 'usuarios/' + correoSanitizado);

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const roles = userData.roles || [];

                console.log("Roles del usuario:", roles);

                if (roles.includes("admin-polariscore")) {
                    document.querySelectorAll(".admin-polariscore").forEach(el => el.style.display = "block");
                }

                if (roles.includes("admin-polariscore") || roles.includes("responsable-polariscore")) {
                    document.querySelectorAll(".admin-responsable-only").forEach(el => el.style.display = "block");
                }

            } else {
                console.warn("Usuario autenticado pero no registrado en la base de datos.");
            }
        }).catch((error) => {
            console.error("Error al obtener datos del usuario:", error);
        });

    } else {
        logButton.textContent = "Iniciar Sesión";
        logButton.classList.remove("btn-danger");
        logButton.classList.add("btn-primary");

        logButton.addEventListener("click", () => {
            window.location.href = "https://sigunitropico.com/plan-it-one/pages/sign-in.html";
        });
    }
});


const params = new URLSearchParams(window.location.search);
const tipo = params.get('tipo');
const busqueda = params.get('busqueda');
const filtro = params.get('filtro');

window.addEventListener('DOMContentLoaded', () => {
    if (tipo) {
        cargarPorTipo(tipo);
    } else if (busqueda) {
        buscarEnSPlan(busqueda, filtro || 'todos');
    }
});

function realizarBusqueda() {
    const termino = document.getElementById('buscador').value.trim();
    const filtro = document.getElementById('filtroBusqueda').value;

    if (termino === '') {
        cargarPorTipo(filtro);
    } else {
        window.location.href = `consulta.html?busqueda=${encodeURIComponent(termino)}&filtro=${filtro}`;
    }
}

window.realizarBusqueda = realizarBusqueda;

// 🔁 Escuchar cambio del select para cargar directamente si el input está vacío
document.getElementById('filtroBusqueda')?.addEventListener('change', () => {
    const buscador = document.getElementById('buscador');
    const filtro = document.getElementById('filtroBusqueda').value;
    const termino = buscador.value.trim();

    if (termino === '') {
        cargarPorTipo(filtro);
    }
});


async function cargarPorTipo(tipo) {
    document.getElementById('contenedorResultados').innerHTML = `
      <div class="alert alert-info text-white bg-primary">Cargando lista completa de <strong>${tipo}</strong>...</div>`;

    try {
        const resultados = [];

        // 🔍 Cargar todos los responsables UNA sola vez
        const snapshotResponsables = await get(ref(db, 'responsables'));
        const mapaResponsables = snapshotResponsables.exists() ? snapshotResponsables.val() : {};

        // ✅ Si el tipo es solo responsables, renderizar directamente
        if (tipo === 'responsables') {
            const palabrasClave = ['rector', 'jefe', 'secretario', 'lider'];

            const res = Object.entries(mapaResponsables)
                .filter(([_, r]) => {
                    const cargo = (r.cargo || '').toLowerCase();
                    return palabrasClave.some(palabra => cargo.includes(palabra));
                })
                .map(([id, r]) => ({
                    tipo: 'Responsable',
                    id,
                    titulo: r.nombre_completo || 'Sin nombre',
                    responsable: r.nombre_completo || '',
                    cargo: r.cargo || '',
                    area: r.area || '',
                    correo: r.correo || '',
                    correo_personal: r.correo_personal || ''
                }));

            renderizarResultados(res);
            return;
        }


        // 🌿 Leer datos de S-PLAN
        const snapshot = await get(ref(db, 'S-PLAN/ejes'));
        if (!snapshot.exists()) {
            document.getElementById('contenedorResultados').innerHTML = `
          <div class="alert alert-warning">No se encontró información en la base de datos.</div>`;
            return;
        }

        const data = snapshot.val();

        for (const idEje in data) {
            const eje = data[idEje];

            if (tipo === 'ejes' || tipo === 'todos') {
                resultados.push({
                    tipo: 'Eje',
                    titulo: eje.titulo_eje || eje.titulo || 'Eje sin título',
                    id: eje.id_eje || idEje,
                    url_img: eje.url_img || '../assets/img/s-plan/default.png',
                    avance: (eje.avance_eje || 0) * 100 // usa el campo correcto aquí
                });
            }

            for (const idPrograma in eje.programas || {}) {
                const programa = eje.programas[idPrograma];

                if (tipo === 'programas' || tipo === 'todos') {
                    resultados.push({
                        tipo: 'Programa',
                        titulo: programa.programa || programa.titulo || 'Programa sin título',
                        id: idPrograma,
                        avance: programa.avance_programa * 100,
                        idEje: idEje,  // ✅ Necesario para redireccionar correctamente
                    });
                }

                for (const idProyecto in programa.proyectos || {}) {
                    const proyecto = programa.proyectos[idProyecto];

                    if (tipo === 'proyectos' || tipo === 'todos') {
                        resultados.push({
                            tipo: 'Proyecto',
                            titulo: proyecto.nombre_proyecto || proyecto.titulo || 'Proyecto sin título',
                            id: idProyecto,
                            idPrograma: idPrograma,
                            idEje: idEje,
                            avance: (proyecto.avance_proyecto || 0) * 100
                        });
                    }

                    for (const idMeta in proyecto.metas || {}) {
                        const meta = proyecto.metas[idMeta];

                        if (tipo === 'metas' || tipo === 'todos') {
                            resultados.push({
                                tipo: 'Meta',
                                titulo: meta.titulo_meta || 'Meta sin título',
                                eje: eje.id_eje,
                                programa: programa.id_programa,
                                proyecto: proyecto.id_proyecto,
                                id: idMeta


                            });
                        }

                        for (const idAccion in meta.acciones || {}) {
                            const accion = meta.acciones[idAccion];

                            if (tipo === 'acciones' || tipo === 'todos') {
                                let responsables = [];
                                if (accion.responsable) {
                                    const ids = accion.responsable.split(',').map(id => id.trim());

                                    for (const id of ids) {
                                        const r = mapaResponsables[id];
                                        if (r) {
                                            responsables.push(r.area || id);
                                        } else {
                                            responsables.push(id); // fallback si no está en mapa
                                        }
                                    }
                                }

                                resultados.push({
                                    tipo: 'Acción',
                                    titulo: accion.titulo_accion || 'Acción sin título',
                                    id: idAccion,
                                    responsable: '',
                                    cargo: '',  // puedes agregar del primero si lo necesitas
                                    area: responsables.join(', '),
                                    correo: '',
                                    correo_personal: '',
                                    meta: idMeta
                                });
                            }
                        }
                    }
                }
            }
        }

        renderizarResultados(resultados);

    } catch (error) {
        console.error("❌ Error al cargar los datos:", error);
        document.getElementById('contenedorResultados').innerHTML = `
        <div class="alert alert-danger">Error al cargar la información.</div>`;
    }
}

async function buscarEnSPlan(termino, filtro) {
    document.getElementById('contenedorResultados').innerHTML = `
      <div class="alert alert-info text-white bg-primary">Buscando <strong>${termino}</strong> en <strong>${filtro}</strong>...</div>`;

    try {
        const palabra = normalizarTexto(termino);
        const resultados = [];

        // Paso 1: Buscar responsables
        const refResponsables = ref(db, 'responsables');
        const snapshotRes = await get(refResponsables);
        const idsResponsablesCoincidentes = [];
        const mapaResponsables = {};

        if (snapshotRes.exists()) {
            const data = snapshotRes.val();
            for (const id in data) {
                const r = data[id];
                const textoResponsable = normalizarTexto([
                    r.nombre_completo,
                    r.cargo,
                    r.area,
                    r.correo,
                    r.correo_personal
                ].join(' '));

                if (textoResponsable.includes(palabra) || id.toLowerCase().includes(palabra)) {
                    idsResponsablesCoincidentes.push(id);
                    mapaResponsables[id] = r;

                    if (filtro === 'responsables' || filtro === 'todos') {
                        resultados.push({
                            tipo: 'Responsable',
                            id,
                            titulo: r.nombre_completo || 'Sin nombre',
                            responsable: r.nombre_completo || '',
                            cargo: r.cargo || '',
                            area: r.area || '',
                            correo: r.correo || '',
                            correo_personal: r.correo_personal || ''
                        });
                    }
                }
            }
        }

        // Paso 2: Buscar entidades del S-PLAN
        const refEjes = ref(db, 'S-PLAN/ejes');
        const snapshot = await get(refEjes);

        if (snapshot.exists()) {
            const data = snapshot.val();

            for (const idEje in data) {
                const eje = data[idEje];

                if ((filtro === 'ejes' || filtro === 'todos') &&
                    (normalizarTexto(eje.titulo_eje || '').includes(palabra) || idEje.toLowerCase().includes(palabra))) {
                    resultados.push({
                        tipo: 'Eje',
                        titulo: eje.titulo_eje,
                        id: eje.id_eje || idEje,
                        url_img: eje.url_img || '../assets/img/s-plan/default.png',
                        avance: (eje.avance_eje || 0) * 100 // usa el campo correcto aquí
                    });
                }

                for (const idPrograma in eje.programas || {}) {
                    const programa = eje.programas[idPrograma];

                    if ((filtro === 'programas' || filtro === 'todos') &&
                        (normalizarTexto(programa.programa || '').includes(palabra) ||
                            idPrograma.toLowerCase().includes(palabra) ||
                            idsResponsablesCoincidentes.includes(programa.responsable))) {
                        const r = mapaResponsables[programa.responsable];
                        resultados.push({
                            tipo: 'Programa',
                            titulo: programa.programa,
                            id: idPrograma,
                            responsable: r?.nombre_completo || '',
                            cargo: r?.cargo || '',
                            area: r?.area || '',
                            correo: r?.correo || '',
                            correo_personal: r?.correo_personal || ''
                        });
                    }

                    for (const idProyecto in programa.proyectos || {}) {
                        const proyecto = programa.proyectos[idProyecto];

                        if ((filtro === 'proyectos' || filtro === 'todos') &&
                            (normalizarTexto(proyecto.nombre_proyecto || '').includes(palabra) ||
                                idProyecto.toLowerCase().includes(palabra) ||
                                idsResponsablesCoincidentes.includes(proyecto.responsable))) {
                            const r = mapaResponsables[proyecto.responsable];
                            resultados.push({
                                tipo: 'Proyecto',
                                titulo: proyecto.nombre_proyecto,
                                id: idProyecto,
                                responsable: r?.nombre_completo || '',
                                cargo: r?.cargo || '',
                                area: r?.area || '',
                                correo: r?.correo || '',
                                correo_personal: r?.correo_personal || '',
                                avance: (proyecto.avance_proyecto || 0) * 100
                            });
                        }

                        for (const idMeta in proyecto.metas || {}) {
                            const meta = proyecto.metas[idMeta];

                            if ((filtro === 'metas' || filtro === 'todos') &&
                                (normalizarTexto(meta.titulo_meta || '').includes(palabra) ||
                                    idMeta.toLowerCase().includes(palabra) ||
                                    idsResponsablesCoincidentes.includes(meta.responsable))) {
                                const r = mapaResponsables[meta.responsable];
                                resultados.push({
                                    tipo: 'Meta',
                                    titulo: meta.titulo_meta,
                                    id: idMeta,
                                    responsable: r?.nombre_completo || '',
                                    cargo: r?.cargo || '',
                                    area: r?.area || '',
                                    correo: r?.correo || '',
                                    correo_personal: r?.correo_personal || '',
                                    eje: eje.id_eje,
                                    programa: programa.id_programa,
                                    proyecto: proyecto.id_proyecto,
                                    id: idMeta
                                });
                            }

                            for (const idAccion in meta.acciones || {}) {
                                const accion = meta.acciones[idAccion];

                                const responsablesAccion = (accion.responsable || '').split(',').map(r => r.trim());

                                const coincideResponsable = responsablesAccion.some(id => idsResponsablesCoincidentes.includes(id));

                                if ((filtro === 'acciones' || filtro === 'todos') &&
                                    (normalizarTexto(accion.titulo_accion || '').includes(palabra) ||
                                        idAccion.toLowerCase().includes(palabra) ||
                                        coincideResponsable)) {

                                    // Mostrar todas las áreas sin duplicados
                                    const responsablesTexto = responsablesAccion
                                        .filter(id => mapaResponsables[id]?.area)
                                        .map(id => mapaResponsables[id].area)
                                        .filter((value, index, self) => self.indexOf(value) === index)
                                        .join(', ') || 'Sin área registrada';

                                    // Usar el primer responsable válido para llenar los otros campos
                                    let rData = null;
                                    for (const id of responsablesAccion) {
                                        if (mapaResponsables[id]) {
                                            rData = mapaResponsables[id];
                                            break;
                                        }
                                    }

                                    resultados.push({
                                        tipo: 'Acción',
                                        titulo: accion.titulo_accion,
                                        id: idMeta,
                                        responsable: rData?.nombre_completo || '',
                                        cargo: rData?.cargo || '',
                                        area: responsablesTexto,
                                        correo: rData?.correo || '',
                                        correo_personal: rData?.correo_personal || '',
                                        meta: idMeta
                                    });
                                }
                            }

                        }
                    }
                }
            }
        }

        renderizarResultados(resultados);

    } catch (error) {
        console.error("❌ Error durante la búsqueda:", error);
        document.getElementById('contenedorResultados').innerHTML = `
        <div class="alert alert-danger">Error al ejecutar la búsqueda.</div>`;
    }

}

function generarEnlaceMetaEncriptado(idMeta, idEje, idPrograma, idProyecto) {
    // 1. Construye la cadena de parámetros.
    const params = `id=${idMeta}&eje=${idEje}&programa=${idPrograma}&proyecto=${idProyecto}`;

    // 2. Codifica la cadena a Base64.
    const paramsCodificados = btoa(params);

    // 3. Devuelve la URL final.
    return `meta.html?data=${paramsCodificados}`;
}

function renderizarResultados(lista) {
    const contenedor = document.getElementById('contenedorResultados');
    const limite = parseInt(document.getElementById('limiteResultados')?.value || '25');
    const vista = vistaActual;

    if (lista.length === 0) {
        contenedor.innerHTML = '<div class="alert alert-warning">No se encontraron resultados.</div>';
        return;
    }

    window.listaResultadosCompleta = lista;

    const iconos = {
        Programa: 'fa-folder-open',
        Proyecto: 'fa-project-diagram',
        Meta: 'fa-bullseye',
        Acción: 'fa-tasks',
        Responsable: 'fa-user-tie',
        Eje: 'fa-sitemap'
    };

    const colores = {
        Programa: 'primary',
        Proyecto: 'info',
        Meta: 'success',
        Acción: 'warning',
        Responsable: 'dark',
        Eje: 'secondary'
    };

    // Agrupar por tipo
    const agrupados = lista.reduce((acc, item) => {
        if (!acc[item.tipo]) acc[item.tipo] = [];
        acc[item.tipo].push(item);
        return acc;
    }, {});

    let html = '';

    if (vista === 'cards') {
        html += '<div class="row">';

        Object.keys(agrupados).forEach(tipo => {
            const color = colores[tipo] || 'secondary';
            const icono = iconos[tipo] || 'fa-file-alt';

            html += `
                <div class="col-12 mb-3">
                    <h5 class="text-${color} tipo-clickeable" style="cursor: pointer;" onclick="redirigirPorTipo('${tipo}')">
                    <i class="fas ${icono} me-2"></i>${tipo}
                    </h5>
                </div>`;



            agrupados[tipo].slice(0, limite).forEach(item => {
                let enlace = '#';

                if (item.tipo === 'Eje') {
                    enlace = `eje.html?id=${item.id}`;
                }
                else if (item.tipo === 'Programa') {
                    enlace = `programa.html?id=${item.id}&eje=${item.idEje}`;
                }
                else if (item.tipo === 'Proyecto') {
                    enlace = `proyecto.html?id=${item.id}&programa=${item.idPrograma}&eje=${item.idEje}`;
                }
                else if (item.tipo === 'Meta') {
                    // ✅ Usa la función para encriptar el enlace de la Meta
                    enlace = generarEnlaceMetaEncriptado(item.id, item.eje, item.programa, item.proyecto);
                }
                else if (item.tipo === 'Acción') {
                    // ✅ Usa la función para encriptar el enlace de la Acción
                    // Nota que usamos item.meta como el ID de la meta.
                    enlace = generarEnlaceMetaEncriptado(item.meta, item.idEje, item.idPrograma, item.idProyecto);
                }
                else if (item.tipo === 'Responsable') {
                    enlace = `../pages/responsable.html?id=${item.id}`;
                }
                if (item.tipo === 'Eje') {
                    html += `
                      <div class="col-md-6 col-lg-3 mb-4">
                        <a href="${enlace}" class="card shadow-sm border-0 h-100 text-decoration-none" onclick="handleLinkClick(event)">
                          <img src="${item.url_img || '../assets/img/s-plan/default.png'}"
                               class="card-img-top" alt="${item.titulo}"
                               onerror="this.src='../assets/img/s-plan/default.png'">
                          <div class="card-body text-center">
                 
                            ${typeof item.avance === 'number' ? `
                                <div class="mt-2">
                                  <div class="progress" style="height: 8px;">
                                    <div class="progress-bar ${getColorClase(item.avance)}" role="progressbar" 
                                         style="width: ${item.avance}%;" aria-valuenow="${item.avance}"
                                         aria-valuemin="0" aria-valuemax="100"></div>
                                  </div>
                                  <div class="text-end"><small>${item.avance.toFixed(1)}%</small></div>
                                </div>` : ''}                              
                          </div>
                        </a>
                      </div>`;
                }

                else {
                    html += `
                    <div class="col-md-4 mb-3">
                      <div class="card shadow-sm border-0 h-100 ${['Programa', 'Proyecto', 'Meta', 'Responsable', 'Acción'].includes(item.tipo) ? 'cursor-pointer' : ''}"
                        ${['Programa', 'Proyecto', 'Meta', 'Responsable', 'Acción'].includes(item.tipo) ? `onclick="window.location.href='${enlace}'"` : ''}>
                        <div class="card-body">
                          <span class="badge bg-${color} mb-2"><i class="fas ${icono} me-1"></i> ${tipo}</span>
                          <h6 class="fw-bold text-dark" title="${item.titulo}">${limitarTexto(item.titulo, 70)}</h6>
                  
                          ${item.area ? `<p class="mb-2 text-muted"><i class="fas fa-building me-1"></i><small>${item.area}</small></p>` : ''}
                  
                          ${(item.tipo === 'Proyecto' || item.tipo === 'Programa') && typeof item.avance === 'number' ? `
                            <div class="mt-2">
                              <small class="text-muted">Avance del ${item.tipo.toLowerCase()}:</small>
                              <div class="progress" style="height: 8px;">
                                <div class="progress-bar ${getColorClase(item.avance)}" role="progressbar"
                                     style="width: ${item.avance}%;" aria-valuenow="${item.avance}"
                                     aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                              <div class="text-end"><small>${item.avance.toFixed(2)}%</small></div>
                              <p class="mb-1 text-start text-muted"><i class="fas fa-hashtag me-1"></i><small>${item.id}</small></p>
                            </div>` : `
                            <p class="mb-1 text-start text-muted"><i class="fas fa-hashtag me-1"></i><small>${item.id}</small></p>
                          `}
                        </div>
                      </div>
                    </div>
                  `;

                }
            });
        });

        html += '</div>';
    } else if (vista === 'list') {
        html += `
        <table class="table table-sm table-bordered bg-white">
          <thead class="table-light">
            <tr>
              <th>Tipo</th>
              <th>ID</th>
              <th>Título</th>
              <th>Responsable</th>
              <th>Cargo</th>
              <th>Área</th>
            </tr>
          </thead>
          <tbody>`;

        lista.slice(0, limite).forEach(item => {
            const tipo = item.tipo;
            const color = colores[tipo] || 'secondary';

            let trClick = '';
            if (tipo === 'Programa') {
                trClick = `onclick="window.location.href='programa.html?id=${item.id}&eje=${item.idEje}'" style="cursor: pointer;"`;
            }
            if (tipo === 'Proyecto') {
                trClick = `onclick="window.location.href='proyecto.html?id=${item.id}&programa=${item.idPrograma}&eje=${item.idEje}'" style="cursor: pointer;"`;
            }
            if (tipo === 'Meta') {
                trClick = `onclick="window.location.href='meta.html?id=${item.id}'" style="cursor: pointer;"`;
            }
            if (tipo === 'Acción') {
                trClick = `onclick="window.location.href='meta.html?id=${item.meta}'" style="cursor: pointer;"`;
            }
            if (tipo === 'Responsable') {
                trClick = `onclick="window.location.href='../pages/responsable.html?id=${item.id}'" style="cursor: pointer;"`;
            }

            html += `
          <tr ${trClick}>
            <td><span class="badge bg-${color}">${tipo}</span></td>
            <td>${item.id}</td>
            <td title="${item.titulo}">${limitarTexto(item.titulo, 40)}</td>
            <td title="${item.responsable}">${limitarTexto(item.responsable, 50) || '-'}</td>
            <td title="${item.cargo}">${limitarTexto(item.cargo || '-', 20)}</td>
            <td title="${item.area}">${limitarTexto(item.area || '-', 20)}</td>
          </tr>`;
        });

        html += '</tbody></table>';
    }

    contenedor.innerHTML = html;
}



document.getElementById('limiteResultados')?.addEventListener('change', () => {
    if (window.listaResultadosCompleta) {
        renderizarResultados(window.listaResultadosCompleta);
    }
});

let vistaActual = 'cards'; // Por defecto

function actualizarVistaBotones() {
    const btnCards = document.getElementById('btnVistaCards');
    const btnLista = document.getElementById('btnVistaLista');

    if (vistaActual === 'cards') {
        btnCards.classList.remove('bg-light');
        btnCards.classList.add('bg-secondary', 'text-white');
        btnLista.classList.remove('bg-secondary');
        btnLista.classList.add('bg-light', 'text-white');
    } else {
        btnLista.classList.remove('bg-light');
        btnLista.classList.add('bg-secondary', 'text-white');
        btnCards.classList.remove('bg-secondary');
        btnCards.classList.add('bg-light', 'text-white');
    }
}

document.getElementById('btnVistaCards').addEventListener('click', () => {
    vistaActual = 'cards';
    actualizarVistaBotones();
    renderizarResultados(window.listaResultadosCompleta || []);
});

document.getElementById('btnVistaLista').addEventListener('click', () => {
    vistaActual = 'list';
    actualizarVistaBotones();
    renderizarResultados(window.listaResultadosCompleta || []);
});

async function obtenerResponsable(id) {
    if (!id) return null;
    const resRef = ref(db, `responsables/${id}`);
    const snapshot = await get(resRef);
    return snapshot.exists() ? snapshot.val() : null;
}

async function buscarIdsDeResponsablesPorNombre(nombreBuscado) {
    const refResponsables = ref(db, 'responsables');
    const snapshot = await get(refResponsables);
    const coincidencias = [];

    if (snapshot.exists()) {
        const data = snapshot.val();
        for (const id in data) {
            const responsable = data[id];
            const texto = [
                responsable.nombre_completo,
                responsable.cargo,
                responsable.area
            ].join(' ').toLowerCase();

            if (texto.includes(nombreBuscado.toLowerCase())) {
                coincidencias.push({ id, data: responsable });
            }
        }
    }

    return coincidencias; // [{ id: "R-001", data: {...} }]
}

window.addEventListener('DOMContentLoaded', () => {
    // Recuperar valores de la URL
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get('tipo');
    const busqueda = params.get('busqueda');
    const filtro = params.get('filtro');

    // Establecer valores en el buscador y el filtro
    if (busqueda) {
        document.getElementById('buscador').value = decodeURIComponent(busqueda);
    }

    const selectFiltro = document.getElementById('filtroBusqueda');
    if (filtro && selectFiltro) {
        selectFiltro.value = filtro;
    }

    // Cargar por tipo, búsqueda, o default
    if (tipo) {
        cargarPorTipo(tipo);
    } else if (busqueda) {
        buscarEnSPlan(busqueda, filtro || 'todos');
    } else {
        // ✅ Valor por defecto al iniciar: mostrar todo
        cargarPorTipo('todos');
        if (selectFiltro) selectFiltro.value = 'todos';
    }
});


function normalizarTexto(texto) {
    return texto
        ?.toLowerCase()
        .normalize('NFD')             // Descompone letras y tildes
        .replace(/[\u0300-\u036f]/g, '') // Elimina los signos diacríticos
        .trim();
}


function limpiarBusqueda() {
    window.location.href = 'consulta.html';
}

window.limpiarBusqueda = limpiarBusqueda;


// Función para asignar colores a la barra de progreso
function getColorClase(porcentaje) {
    if (porcentaje <= 29) return "bg-gradient-danger";
    if (porcentaje <= 60) return "bg-gradient-warning";
    if (porcentaje <= 99.9) return "bg-gradient-info";
    return "bg-gradient-success";
}

function redirigirPorTipo(tipo) {
    const mapa = {
        Eje: 'ejes',
        Programa: 'programas',
        Proyecto: 'proyectos',
        Meta: 'metas',
        Acción: 'acciones',
        Responsable: 'responsables'
    };

    const tipoPlural = mapa[tipo] || tipo.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/ /g, '_');

    window.location.href = `consulta.html?tipo=${tipoPlural}`;
}
window.redirigirPorTipo = redirigirPorTipo;

document.getElementById('buscador')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        realizarBusqueda();
    }
});