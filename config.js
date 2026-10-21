/*
 * Configuración general del catálogo.
 * Edita este archivo para cambiar el número de WhatsApp, la moneda o los textos del negocio.
 * No hace falta tocar js/app.js.
 */
window.CONFIG = {
  negocio: "Productos San Salvador",
  ciudad: "Riobamba, Ecuador",

  // Número de WhatsApp que recibe los pedidos, en formato internacional y SOLO dígitos:
  // código de país (593 = Ecuador) + número sin el 0 inicial. Ej.: 0991941401 -> 593991941401
  // TODO: confirmar el número. Tomado del catálogo (0991941401); el otro número publicado es 0995984982.
  whatsapp: "593991941401",

  // Moneda y formato. Ecuador usa dólares estadounidenses.
  moneda: "USD",
  locale: "es-EC", // formato $1.234,50

  // "obligatorio" | "opcional": cómo se pide el nombre del cliente antes de enviar el pedido.
  nombreCliente: "obligatorio",

  // Texto que acompaña a los precios en el carrito y en el pie de página.
  // TODO: ajustar cuando los precios del catálogo sean los definitivos.
  avisoPrecios: "Precios referenciales en dólares (USD). Confirmamos disponibilidad y valor final por WhatsApp.",

  contacto: {
    telefonos: ["099 194 1401", "099 598 4982"],
    correo: "lacteossansalvador.ec@gmail.com",
    direccion: "Primera Constituyente 11-49 y Cuba, Riobamba",
  },
};
