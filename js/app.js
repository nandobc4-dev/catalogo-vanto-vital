/*
 * Lógica del catálogo. Los datos están en data/catalogo.js y la configuración en config.js;
 * normalmente no hace falta editar este archivo.
 */
(function () {
  "use strict";

  const CFG = window.CONFIG;
  const DATA = window.CATALOGO;
  const CLAVE_STORAGE = "sansalvador-pedido-v1";
  const MAX_CANT = 999;

  // ---------- Utilidades ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const formato = new Intl.NumberFormat(CFG.locale, { style: "currency", currency: CFG.moneda });
  const dinero = (centavos) => formato.format(centavos / 100);
  const aCentavos = (precio) => (typeof precio === "number" ? Math.round(precio * 100) : null);
  const normalizar = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  // Para buscar, "1kg" y "1 kg" (o "500g" y "500 g") cuentan como lo mismo.
  const normalizarBusqueda = (s) => normalizar(s).replace(/(\d)\s+(?=(kg|g|ml|l)\b)/g, "$1");
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const limitar = (n) => Math.max(1, Math.min(MAX_CANT, Math.floor(Number(n)) || 1));

  const ICONO = {
    mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    quitar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  // ---------- Catálogo ----------
  const productos = new Map(DATA.productos.map((p) => [p.id, p]));
  const categorias = new Map(DATA.categorias.map((c) => [c.id, c]));
  const presentacion = (prod, id) => prod.presentaciones.find((x) => x.id === id);
  const variantesDe = (prod, pres) => pres.variantes ?? prod.variantes ?? [];
  const imagenDe = (prod, pres) => (pres && pres.imagen) || prod.imagen;

  function precioDesde(prod) {
    const precios = prod.presentaciones.map((p) => aCentavos(p.precio)).filter((c) => c !== null);
    return precios.length ? Math.min(...precios) : null;
  }

  const indiceBusqueda = new Map(
    DATA.productos.map((p) => {
      const partes = [p.nombre, p.resumen, p.descripcion, categorias.get(p.categoria)?.nombre, ...(p.variantes || [])];
      p.presentaciones.forEach((pr) => partes.push(pr.nombre, pr.grupo, pr.detalle, ...(pr.variantes || [])));
      return [p.id, normalizarBusqueda(partes.filter(Boolean).join(" "))];
    })
  );

  // ---------- Estado del pedido (persistido en localStorage) ----------
  let pedido = cargarPedido();
  const filtro = { categoria: "todas", texto: "" };

  function cargarPedido() {
    let guardado = null;
    try {
      guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    } catch (e) {
      guardado = null;
    }
    const base = { lineas: [], nombre: "", notas: "" };
    if (!guardado || !Array.isArray(guardado.lineas)) return base;
    // Descarta líneas de productos o presentaciones que ya no existan en el catálogo.
    const lineas = guardado.lineas.filter((l) => {
      const prod = productos.get(l.producto);
      const pres = prod && presentacion(prod, l.presentacion);
      if (!pres) return false;
      const vars = variantesDe(prod, pres);
      return vars.length ? vars.includes(l.variante) : !l.variante;
    });
    lineas.forEach((l) => (l.cantidad = limitar(l.cantidad)));
    return { lineas, nombre: String(guardado.nombre || ""), notas: String(guardado.notas || "") };
  }

  function guardarPedido() {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedido));
    } catch (e) {
      /* almacenamiento no disponible: el pedido sigue funcionando en memoria */
    }
  }

  const claveLinea = (l) => `${l.producto}|${l.presentacion}|${l.variante || ""}`;

  function detalleLinea(l) {
    const prod = productos.get(l.producto);
    const pres = presentacion(prod, l.presentacion);
    const unitario = aCentavos(pres.precio);
    return { prod, pres, unitario, subtotal: unitario === null ? null : unitario * l.cantidad };
  }

  function resumenPedido() {
    let total = 0, unidades = 0, sinPrecio = 0;
    pedido.lineas.forEach((l) => {
      const d = detalleLinea(l);
      unidades += l.cantidad;
      if (d.subtotal === null) sinPrecio++;
      else total += d.subtotal;
    });
    return { total, unidades, sinPrecio };
  }

  function agregar(producto, presId, variante, cantidad) {
    const nueva = { producto, presentacion: presId, variante: variante || "", cantidad };
    const existente = pedido.lineas.find((l) => claveLinea(l) === claveLinea(nueva));
    if (existente) existente.cantidad = limitar(existente.cantidad + cantidad);
    else pedido.lineas.push(nueva);
    cambioPedido();
  }

  function cambiarCantidad(clave, cantidad) {
    const linea = pedido.lineas.find((l) => claveLinea(l) === clave);
    if (!linea) return;
    if (cantidad <= 0) pedido.lineas = pedido.lineas.filter((l) => l !== linea);
    else linea.cantidad = limitar(cantidad);
    cambioPedido();
  }

  function vaciar() {
    pedido.lineas = [];
    cambioPedido();
  }

  function cambioPedido() {
    guardarPedido();
    pintarResumen();
    pintarLineas();
    pintarMensaje();
    pintarInsigniasTarjetas();
  }

  // ---------- Mensaje de WhatsApp ----------
  function textoPedido() {
    const r = resumenPedido();
    const nombre = pedido.nombre.trim();
    const fecha = new Date().toLocaleDateString(CFG.locale, { day: "2-digit", month: "2-digit", year: "numeric" });
    const filas = [`*Pedido · ${CFG.negocio}*`];
    filas.push(`Cliente: ${nombre || "(sin nombre)"}`);
    filas.push(`Fecha: ${fecha}`, "");
    pedido.lineas.forEach((l, i) => {
      const d = detalleLinea(l);
      const variante = l.variante ? ` (${l.variante})` : "";
      filas.push(`${i + 1}. ${d.prod.nombre} ${d.pres.nombre}${variante}`);
      filas.push(
        d.unitario === null
          ? `   ${l.cantidad} x precio a confirmar`
          : `   ${l.cantidad} x ${dinero(d.unitario)} = ${dinero(d.subtotal)}`
      );
    });
    filas.push("");
    filas.push(`Unidades: ${r.unidades}`);
    filas.push(`*Total: ${dinero(r.total)} (${CFG.moneda})*`);
    if (r.sinPrecio) filas.push(`+ ${plural(r.sinPrecio, "producto", "productos")} con precio a confirmar`);
    const notas = pedido.notas.trim();
    if (notas) filas.push("", `Notas: ${notas}`);
    return filas.join("\n");
  }

  const enlaceWhatsApp = () => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(textoPedido())}`;

  // ---------- Render: catálogo ----------
  const elCatalogo = $("#catalogo");
  const elCategorias = $("#categorias");

  function pintarCategorias() {
    const cuenta = (id) => DATA.productos.filter((p) => p.categoria === id).length;
    const chips = [{ id: "todas", nombre: "Todos", n: DATA.productos.length }].concat(
      DATA.categorias.map((c) => ({ ...c, n: cuenta(c.id) }))
    );
    elCategorias.innerHTML = chips
      .map(
        (c) =>
          `<button type="button" class="chip" data-categoria="${esc(c.id)}" aria-pressed="${c.id === filtro.categoria}">${esc(c.nombre)}<small>${c.n}</small></button>`
      )
      .join("");
  }

  function tarjeta(p) {
    const desde = precioDesde(p);
    const nPres = p.presentaciones.length;
    const precioTxt = desde === null ? "Precio a consultar" : `${nPres > 1 ? "Desde" : "Precio"} <strong>${dinero(desde)}</strong>`;
    return `<article class="tarjeta" data-producto="${esc(p.id)}">
      <img class="tarjeta-img" src="${esc(p.imagen)}" alt="" loading="lazy" decoding="async" width="560" height="560">
      <span class="en-pedido" hidden></span>
      <div class="tarjeta-cuerpo">
        <h3><button type="button" class="tarjeta-enlace" data-abrir="${esc(p.id)}">${esc(p.nombre)}</button></h3>
        <p class="tarjeta-resumen">${esc(p.resumen)}</p>
        <div class="tarjeta-pie">
          <span class="desde">${precioTxt}</span>
          <span class="mas" aria-hidden="true">${ICONO.mas}</span>
        </div>
      </div>
    </article>`;
  }

  function pintarCatalogo() {
    const texto = normalizarBusqueda(filtro.texto.trim());
    const palabras = texto.split(/\s+/).filter(Boolean);
    const visibles = DATA.productos.filter(
      (p) =>
        (filtro.categoria === "todas" || p.categoria === filtro.categoria) &&
        palabras.every((w) => indiceBusqueda.get(p.id).includes(w))
    );

    // Anuncia el número de resultados a los lectores de pantalla (el catálogo en sí no se lee completo).
    $("#resultados").textContent = visibles.length
      ? plural(visibles.length, "producto encontrado", "productos encontrados")
      : "No hay productos que coincidan";

    if (!visibles.length) {
      elCatalogo.innerHTML = `<div class="vacio">
        <img src="img/mascota-chef.webp" alt="" width="293" height="264">
        <p><strong>No encontramos “${esc(filtro.texto.trim())}”${filtro.categoria !== "todas" ? ` en ${esc(categorias.get(filtro.categoria).nombre)}` : ""}.</strong></p>
        <p>Prueba con otra palabra o mira todo el catálogo.</p>
        <button type="button" class="btn btn-secundario" data-limpiar>Ver todo el catálogo</button>
      </div>`;
      return;
    }

    elCatalogo.innerHTML = DATA.categorias
      .map((c) => {
        const lista = visibles.filter((p) => p.categoria === c.id);
        if (!lista.length) return "";
        return `<section class="seccion" aria-labelledby="sec-${esc(c.id)}">
          <div class="seccion-cab"><h2 id="sec-${esc(c.id)}">${esc(c.nombre)}</h2><span>${plural(lista.length, "producto", "productos")}</span></div>
          <div class="rejilla">${lista.map(tarjeta).join("")}</div>
        </section>`;
      })
      .join("");
    pintarInsigniasTarjetas();
  }

  function pintarInsigniasTarjetas() {
    const porProducto = {};
    pedido.lineas.forEach((l) => (porProducto[l.producto] = (porProducto[l.producto] || 0) + l.cantidad));
    elCatalogo.querySelectorAll(".tarjeta").forEach((t) => {
      const n = porProducto[t.dataset.producto] || 0;
      const badge = $(".en-pedido", t);
      badge.hidden = !n;
      badge.textContent = n ? `${n} en tu pedido` : "";
    });
  }

  // ---------- Render: detalle de producto ----------
  const dlgProducto = $("#dlg-producto");
  const formProducto = $("#form-producto");
  let sel = null; // { prod, presId, variante, cantidad }

  function abrirProducto(id) {
    const prod = productos.get(id);
    if (!prod) return;
    sel = { prod, presId: prod.presentaciones[0].id, variante: "", cantidad: 1 };
    const cat = categorias.get(prod.categoria);

    let grupoActual = null;
    const opcionesPres = prod.presentaciones
      .map((pr) => {
        let cab = "";
        if (pr.grupo && pr.grupo !== grupoActual) {
          cab = `${grupoActual === null ? "" : "</div>"}<p class="subgrupo">${esc(pr.grupo)}</p><div class="opciones-pres">`;
          grupoActual = pr.grupo;
        }
        const c = aCentavos(pr.precio);
        const img = pr.imagen ? `<img src="${esc(pr.imagen)}" alt="" loading="lazy">` : "";
        return `${cab}<label class="op-pres">
          <input type="radio" name="pres" value="${esc(pr.id)}"${pr.id === sel.presId ? " checked" : ""}>
          ${img}
          <span><b>${esc(pr.nombre)}</b>${pr.detalle ? `<em>${esc(pr.detalle)}</em>` : ""}<i>${c === null ? "A consultar" : dinero(c)}</i></span>
        </label>`;
      })
      .join("");
    const presHtml = grupoActual === null ? `<div class="opciones-pres">${opcionesPres}</div>` : `${opcionesPres}</div>`;

    formProducto.innerHTML = `
      <div class="hoja-scroll det">
        <div class="det-foto">
          <img src="${esc(prod.foto || prod.imagen)}" alt="${esc(prod.nombre)}">
          <button class="btn-icono" type="button" data-cerrar aria-label="Cerrar">${ICONO.cerrar}</button>
        </div>
        <div class="det-cab">
          <p class="sobre">${esc(cat ? cat.nombre : "")}</p>
          <h2 id="prod-nombre">${esc(prod.nombre)}</h2>
          <p class="det-desc recortada" id="det-desc">${esc(prod.descripcion)}</p>
          <button type="button" class="btn-texto" id="det-mas" aria-controls="det-desc" aria-expanded="false">Leer más</button>
        </div>
        <fieldset class="grupo">
          <legend>Presentación <small>${plural(prod.presentaciones.length, "opción", "opciones")}</small></legend>
          ${presHtml}
        </fieldset>
        <fieldset class="grupo" id="grupo-var"></fieldset>
        <div class="fila-cant">
          <span id="cant-etiqueta">Cantidad</span>
          <div class="paso" role="group" aria-labelledby="cant-etiqueta">
            <button type="button" data-paso="-1" aria-label="Restar uno">${ICONO.menos}</button>
            <input type="number" id="det-cant" inputmode="numeric" min="1" max="${MAX_CANT}" value="1" aria-label="Cantidad">
            <button type="button" data-paso="1" aria-label="Sumar uno">${ICONO.mas}</button>
          </div>
        </div>
      </div>
      <div class="hoja-pie">
        <button type="button" class="btn btn-principal" id="det-agregar"></button>
      </div>`;

    pintarVariantes();
    pintarBotonAgregar();
    dlgProducto.showModal();
    $(".hoja-scroll", formProducto).scrollTop = 0;
    // Oculta "Leer más" si la descripción completa ya cabe.
    const desc = $("#det-desc");
    if (desc.scrollHeight <= desc.clientHeight + 2) $("#det-mas").hidden = true;
  }

  function pintarVariantes() {
    const pres = presentacion(sel.prod, sel.presId);
    const vars = variantesDe(sel.prod, pres);
    const grupo = $("#grupo-var");
    if (!vars.includes(sel.variante)) sel.variante = vars.length === 1 ? vars[0] : "";
    grupo.hidden = !vars.length;
    if (!vars.length) {
      grupo.innerHTML = "";
      return;
    }
    const etiqueta = sel.prod.etiquetaVariante || "Opción";
    grupo.innerHTML = `<legend>${esc(etiqueta)} <small class="pista" id="var-pista"${sel.variante ? " hidden" : ""}>Elige uno</small></legend>
      <div class="opciones-var">${vars
        .map(
          (v) => `<label class="op-var"><input type="radio" name="var" value="${esc(v)}"${v === sel.variante ? " checked" : ""}><span>${esc(v)}</span></label>`
        )
        .join("")}</div>`;
  }

  function pintarBotonAgregar() {
    const pres = presentacion(sel.prod, sel.presId);
    const vars = variantesDe(sel.prod, pres);
    const btn = $("#det-agregar");
    const falta = vars.length && !sel.variante;
    btn.disabled = !!falta;
    if (falta) {
      btn.textContent = `Elige ${(sel.prod.etiquetaVariante || "una opción").toLowerCase() === "sabor" ? "un sabor" : "una opción"}`;
      return;
    }
    const c = aCentavos(pres.precio);
    btn.textContent = c === null ? "Agregar al pedido" : `Agregar al pedido · ${dinero(c * sel.cantidad)}`;
  }

  function fijarCantidadDetalle(n) {
    sel.cantidad = limitar(n);
    $("#det-cant").value = sel.cantidad;
    $('[data-paso="-1"]', formProducto).disabled = sel.cantidad <= 1;
    pintarBotonAgregar();
  }

  // Enter en el campo de cantidad no debe cerrar el diálogo.
  formProducto.addEventListener("submit", (e) => e.preventDefault());
  formProducto.addEventListener("change", (e) => {
    if (e.target.name === "pres") {
      sel.presId = e.target.value;
      pintarVariantes();
      pintarBotonAgregar();
    } else if (e.target.name === "var") {
      sel.variante = e.target.value;
      $("#var-pista").hidden = true;
      pintarBotonAgregar();
    } else if (e.target.id === "det-cant") {
      fijarCantidadDetalle(e.target.value);
    }
  });
  formProducto.addEventListener("input", (e) => {
    if (e.target.id === "det-cant" && e.target.value !== "") {
      sel.cantidad = limitar(e.target.value);
      pintarBotonAgregar();
    }
  });
  formProducto.addEventListener("click", (e) => {
    const paso = e.target.closest("[data-paso]");
    if (paso) fijarCantidadDetalle(sel.cantidad + Number(paso.dataset.paso));
    if (e.target.closest("#det-mas")) {
      const desc = $("#det-desc");
      const abierta = desc.classList.toggle("recortada") === false;
      e.target.closest("#det-mas").setAttribute("aria-expanded", String(abierta));
      e.target.closest("#det-mas").textContent = abierta ? "Leer menos" : "Leer más";
    }
    if (e.target.closest("#det-agregar")) {
      const pres = presentacion(sel.prod, sel.presId);
      agregar(sel.prod.id, sel.presId, sel.variante, sel.cantidad);
      dlgProducto.close();
      const variante = sel.variante ? ` · ${sel.variante}` : "";
      avisar(`Agregado: ${sel.cantidad} × ${sel.prod.nombre} ${pres.nombre}${variante}`, "Ver pedido", abrirPedido);
    }
  });

  // ---------- Render: pedido ----------
  const dlgPedido = $("#dlg-pedido");
  const elLineas = $("#lineas");

  function pintarResumen() {
    const r = resumenPedido();
    const hay = pedido.lineas.length > 0;
    $("#carrito-total").textContent = dinero(r.total);
    const insignia = $("#carrito-cuenta");
    insignia.hidden = !hay;
    insignia.textContent = r.unidades;
    $("#btn-carrito").setAttribute("aria-label", hay ? `Ver pedido: ${plural(r.unidades, "unidad", "unidades")}, ${dinero(r.total)}` : "Ver pedido (vacío)");
    $("#flotante").hidden = !hay;
    $("#flotante-cuenta").textContent = r.unidades;
    $("#flotante-etiqueta").textContent = r.unidades === 1 ? "unidad" : "unidades";
    $("#flotante-total").textContent = dinero(r.total);
    $("#pedido-total").textContent = dinero(r.total);
    $("#pedido-titulo").textContent = enRevision() ? "Revisa y envía" : hay ? `Tu pedido · ${plural(r.unidades, "unidad", "unidades")}` : "Tu pedido";
    $("#pedido-pie").hidden = !hay;
    $("#pedido-vacio").hidden = hay;
    $("#btn-continuar").disabled = !hay;
    if (!hay && enRevision()) mostrarPaso("lista");
  }

  function pintarLineas() {
    elLineas.innerHTML = pedido.lineas
      .map((l) => {
        const d = detalleLinea(l);
        const clave = esc(claveLinea(l));
        const variante = l.variante ? ` · ${esc(l.variante)}` : "";
        const unit = d.unitario === null ? "Precio a confirmar" : `${dinero(d.unitario)} c/u`;
        return `<li class="linea" data-clave="${clave}">
          <img src="${esc(imagenDe(d.prod, d.pres))}" alt="" loading="lazy">
          <div class="linea-info"><b>${esc(d.prod.nombre)}</b><span>${esc(d.pres.nombre)}${variante}</span><span>${unit}</span></div>
          <div class="linea-sub">${d.subtotal === null ? "—" : dinero(d.subtotal)}</div>
          <div class="linea-ctrl">
            <div class="paso compacto" role="group" aria-label="Cantidad de ${esc(d.prod.nombre)} ${esc(d.pres.nombre)}">
              <button type="button" data-delta="-1" aria-label="Restar uno">${ICONO.menos}</button>
              <input type="number" inputmode="numeric" min="1" max="${MAX_CANT}" value="${l.cantidad}" data-cant aria-label="Cantidad">
              <button type="button" data-delta="1" aria-label="Sumar uno">${ICONO.mas}</button>
            </div>
            <button type="button" class="btn-texto" data-quitar>${ICONO.quitar}Quitar</button>
          </div>
        </li>`;
      })
      .join("");
  }

  function pintarMensaje() {
    $("#mensaje").textContent = textoPedido();
    $("#btn-whatsapp").href = enlaceWhatsApp();
  }

  const enRevision = () => !$("#paso-revision").hidden;

  function mostrarPaso(paso) {
    const revision = paso === "revision";
    $("#paso-lista").hidden = revision;
    $("#paso-revision").hidden = !revision;
    $("#acciones-lista").hidden = revision;
    $("#acciones-revision").hidden = !revision;
    $("#post-envio").hidden = true;
    pintarResumen();
    pintarMensaje();
    const destino = revision ? $("#paso-revision") : $("#paso-lista");
    destino.scrollTop = 0;
  }

  function abrirPedido() {
    mostrarPaso("lista");
    pintarLineas();
    if (!dlgPedido.open) dlgPedido.showModal();
  }

  elLineas.addEventListener("click", (e) => {
    const li = e.target.closest(".linea");
    if (!li) return;
    const linea = pedido.lineas.find((l) => claveLinea(l) === li.dataset.clave);
    if (!linea) return;
    const delta = e.target.closest("[data-delta]");
    if (delta) cambiarCantidad(li.dataset.clave, linea.cantidad + Number(delta.dataset.delta));
    if (e.target.closest("[data-quitar]")) cambiarCantidad(li.dataset.clave, 0);
    restaurarFoco(li.dataset.clave, e.target.closest("button"));
  });
  elLineas.addEventListener("change", (e) => {
    if (!e.target.matches("[data-cant]")) return;
    const clave = e.target.closest(".linea").dataset.clave;
    const valor = Number(e.target.value);
    cambiarCantidad(clave, e.target.value === "" || valor < 1 ? 1 : valor);
  });

  // Mantiene el foco en el mismo control después de volver a pintar la lista.
  function restaurarFoco(clave, boton) {
    if (!boton) return;
    const li = [...elLineas.children].find((x) => x.dataset.clave === clave);
    const selector = boton.dataset.delta ? `[data-delta="${boton.dataset.delta}"]` : null;
    const destino = li && selector ? $(selector, li) : $("#btn-continuar");
    if (destino && !destino.disabled) destino.focus();
  }

  // Vaciar con confirmación en la propia interfaz (dos toques).
  let temporizadorVaciar = null;
  $("#btn-vaciar").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    if (btn.classList.contains("alerta")) {
      clearTimeout(temporizadorVaciar);
      btn.classList.remove("alerta");
      btn.textContent = "Vaciar";
      vaciar();
      return;
    }
    btn.classList.add("alerta");
    btn.textContent = "¿Vaciar todo?";
    temporizadorVaciar = setTimeout(() => {
      btn.classList.remove("alerta");
      btn.textContent = "Vaciar";
    }, 3500);
  });

  $("#btn-continuar").addEventListener("click", () => mostrarPaso("revision"));
  $("#btn-volver").addEventListener("click", () => mostrarPaso("lista"));

  const inNombre = $("#cliente-nombre");
  const inNotas = $("#cliente-notas");
  const nombreObligatorio = CFG.nombreCliente === "obligatorio";
  $("#cliente-nombre-etiqueta").innerHTML = nombreObligatorio ? "Tu nombre" : "Tu nombre <em>(opcional)</em>";
  inNombre.required = nombreObligatorio;
  inNombre.value = pedido.nombre;
  inNotas.value = pedido.notas;

  inNombre.addEventListener("input", () => {
    pedido.nombre = inNombre.value;
    if (inNombre.value.trim()) marcarErrorNombre(false);
    guardarPedido();
    pintarMensaje();
  });
  inNotas.addEventListener("input", () => {
    pedido.notas = inNotas.value;
    guardarPedido();
    pintarMensaje();
  });

  function marcarErrorNombre(hayError) {
    inNombre.setAttribute("aria-invalid", String(hayError));
    $("#cliente-nombre-error").hidden = !hayError;
  }

  $("#btn-whatsapp").addEventListener("click", (e) => {
    if (nombreObligatorio && !pedido.nombre.trim()) {
      e.preventDefault();
      marcarErrorNombre(true);
      inNombre.focus();
      return;
    }
    // El enlace se abre en una pestaña nueva; no sabemos si el cliente llegó a enviarlo.
    e.currentTarget.href = enlaceWhatsApp();
    $("#post-envio").hidden = false;
  });

  $("#btn-vaciar-post").addEventListener("click", () => {
    vaciar();
    dlgPedido.close();
    avisar("Pedido vaciado. ¡Gracias por tu compra!");
  });

  $("#btn-copiar").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const texto = textoPedido();
    try {
      await navigator.clipboard.writeText(texto);
      btn.textContent = "Copiado";
    } catch (err) {
      const rango = document.createRange();
      rango.selectNodeContents($("#mensaje"));
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(rango);
      btn.textContent = "Texto seleccionado";
    }
    setTimeout(() => (btn.textContent = "Copiar texto"), 2000);
  });

  // ---------- Aviso emergente ----------
  const elToast = $("#toast");
  let temporizadorToast = null;
  function avisar(texto, accion, alHacerClic) {
    elToast.innerHTML = `<span>${esc(texto)}</span>${accion ? `<button type="button">${esc(accion)}</button>` : ""}`;
    elToast.hidden = false;
    if (accion) $("button", elToast).onclick = () => { elToast.hidden = true; alHacerClic(); };
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => (elToast.hidden = true), 4000);
  }

  // ---------- Eventos generales ----------
  elCategorias.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-categoria]");
    if (!chip) return;
    filtro.categoria = chip.dataset.categoria;
    elCategorias.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    pintarCatalogo();
  });

  $("#buscar").addEventListener("input", (e) => {
    filtro.texto = e.target.value;
    pintarCatalogo();
  });

  elCatalogo.addEventListener("click", (e) => {
    const abrir = e.target.closest("[data-abrir]");
    if (abrir) abrirProducto(abrir.dataset.abrir);
    if (e.target.closest("[data-limpiar]")) {
      filtro.texto = "";
      filtro.categoria = "todas";
      $("#buscar").value = "";
      pintarCategorias();
      pintarCatalogo();
    }
  });

  $("#btn-carrito").addEventListener("click", abrirPedido);
  $("#flotante").addEventListener("click", abrirPedido);

  // Cerrar diálogos con el botón X, "Ver catálogo" o tocando fuera.
  [dlgProducto, dlgPedido].forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-cerrar]")) dlg.close();
    });
  });

  // Si otra pestaña modifica el pedido, sincronizar.
  window.addEventListener("storage", (e) => {
    if (e.key !== CLAVE_STORAGE) return;
    pedido = cargarPedido();
    inNombre.value = pedido.nombre;
    inNotas.value = pedido.notas;
    cambioPedido();
  });

  // ---------- Textos de configuración ----------
  $("#total-moneda").textContent = CFG.moneda;
  $("#pedido-aviso").textContent = CFG.avisoPrecios || "";
  $("#pie-aviso").textContent = CFG.avisoPrecios || "";
  const c = CFG.contacto || {};
  $("#pie-contacto").textContent = [CFG.negocio, c.direccion, (c.telefonos || []).join(" · "), c.correo].filter(Boolean).join(" · ");

  // ---------- Inicio ----------
  pintarCategorias();
  pintarCatalogo();
  pintarResumen();
  pintarLineas();
  pintarMensaje();
})();
