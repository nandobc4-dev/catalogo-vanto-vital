# Catálogo web · Productos San Salvador

Catálogo interactivo de los productos lácteos San Salvador (Riobamba). El cliente elige productos, presentación, sabor y cantidad, revisa su pedido y lo envía como texto a WhatsApp con un enlace `https://wa.me/<número>?text=<pedido>`.

No necesita servidor, base de datos, pasarela de pago ni instalar dependencias: son archivos estáticos (HTML, CSS y JavaScript).

## Estructura

```
catalogo-san-salvador/
├── index.html          Estructura de la página
├── config.js           Número de WhatsApp, moneda, textos del negocio  ← editar aquí
├── data/
│   └── catalogo.js     Categorías, productos, presentaciones, sabores y precios  ← editar aquí
├── css/
│   └── estilos.css     Diseño (colores de marca, responsive, modo oscuro)
├── js/
│   └── app.js          Lógica: filtros, búsqueda, carrito, localStorage, mensaje de WhatsApp
└── img/
    ├── logo-blanco.webp, mascota.webp, mascota-chef.webp
    ├── compartir.jpg   Imagen de la vista previa al compartir el enlace (1200×630)
    ├── favicon-48.png, apple-touch-icon.png, icono-192.png, icono-512.png
    └── productos/      Fotos extraídas del catálogo PDF (WebP)
        ├── <producto>.webp          foto de estudio (tarjeta)
        ├── <producto>-foto.webp     foto ambientada (detalle)
        └── <producto>-<presentación>.webp   foto de cada presentación
```

Los datos están en `.js` y no en `.json` por dos razones: admiten comentarios (los `TODO`) y la página funciona incluso abriendo `index.html` con doble clic, sin servidor.

## Probar en tu computadora

Opción 1: abre `index.html` con doble clic en el navegador.

Opción 2 (recomendada, igual que en producción): sirve la carpeta con un servidor local.

```bash
cd catalogo-san-salvador
python3 -m http.server 8080
# o bien: npx serve .
```

Luego abre http://localhost:8080. Para probar desde el celular en la misma red Wi-Fi, usa la IP de tu computadora: `http://192.168.x.x:8080`.

## Publicar (obtener un enlace para compartir)

Cualquiera de estas opciones es gratuita para un sitio estático como este:

- **Netlify Drop** (la más rápida): entra en https://app.netlify.com/drop y arrastra la carpeta `catalogo-san-salvador`. Te da un enlace del tipo `https://nombre.netlify.app`, que puedes renombrar en *Site settings*.
- **Vercel**: `npm i -g vercel` y luego `vercel` dentro de la carpeta (acepta los valores por defecto; no hay paso de compilación). También puedes importar un repositorio de GitHub desde vercel.com.
- **GitHub Pages**: sube la carpeta a un repositorio, ve a *Settings → Pages*, elige *Deploy from a branch*, rama `main` y carpeta `/ (root)`. El enlace será `https://usuario.github.io/repositorio/`.

Para actualizar precios o productos basta con editar los archivos y volver a subirlos (o hacer `git push` si usas GitHub/Vercel).

## Cambiar el número de WhatsApp

En `config.js`:

```js
whatsapp: "593991941401",
```

Usa el formato internacional **solo con dígitos**: código de país + número sin el 0 inicial y sin `+`, espacios ni guiones. Ejemplo para Ecuador: `099 194 1401` → `593991941401`.

En el mismo archivo puedes cambiar la moneda (`moneda`, `locale`), si el nombre del cliente es obligatorio u opcional (`nombreCliente`), el aviso de precios y los datos de contacto del pie de página.

## Editar productos y precios

Todo está en `data/catalogo.js`. Cada producto tiene este formato:

```js
{
  id: "queso-fresco",               // único, sin espacios
  nombre: "Queso Fresco",
  categoria: "quesos",              // id de una de las categorías
  resumen: "Texto corto de la tarjeta",
  descripcion: "Texto completo del detalle",
  imagen: "img/productos/queso-fresco.webp",
  foto: "img/productos/queso-fresco-foto.webp",
  etiquetaVariante: "Sabor",        // opcional
  variantes: ["Natural", "Orégano"],// opcional: opciones que elige el cliente
  presentaciones: [
    { id: "700g", nombre: "700 g", precio: 4.2, imagen: "img/productos/queso-fresco-700g.webp" },
    // una presentación puede tener sus propias variantes; [] = sin opciones
    // grupo: "Laminado" agrupa presentaciones bajo un subtítulo
    // precio: null muestra "Precio a consultar"
  ],
}
```

Si cambias el `id` de un producto o presentación, los carritos guardados que lo contengan descartan esa línea al recargar; nada se rompe.

## Datos que hay que confirmar (TODO)

Busca `TODO` en el proyecto. Pendientes:

1. **Precios**: el catálogo PDF no trae precios. Todos los precios de `data/catalogo.js` son de ejemplo.
2. **Número de WhatsApp**: se usó 0991941401 (el primero del catálogo); el otro número publicado es 0995984982.
3. **Especias del Queso Andino**: el catálogo menciona natural, orégano, ají, albahaca e higo; confirmar disponibilidad por presentación.
4. **Aviso de precios** en `config.js`.
5. **Vista previa al compartir**: después de publicar, cambia en `index.html` las etiquetas `og:url` y `og:image` por la dirección completa (`https://…/img/compartir.jpg`). WhatsApp no muestra la imagen con rutas relativas. Para comprobarlo, pega el enlace en https://developers.facebook.com/tools/debug/ (WhatsApp usa los mismos datos).
6. Si cambias el número de WhatsApp, cámbialo también en el aviso `<noscript>` de `index.html`.

Supuestos tomados del PDF:

- Moneda USD (empresa ecuatoriana) con formato `$1.234,50`.
- "Queso Crema 450 kg" se interpretó como 450 g.
- Mantequilla tiene dos presentaciones de 250 g: tarrina y barra.
- La página de Bellpaesse tiene el título "Queso Andino" por error; se usó Bellpaesse.
- Mozzarella entero y laminado se agruparon en un solo producto con dos grupos de presentaciones.

## Cómo funciona el pedido

- El carrito se guarda en `localStorage` del navegador del cliente (clave `sansalvador-pedido-v1`), junto con su nombre y notas. Los precios siempre se leen del catálogo actual, así que un cambio de precio se refleja aunque el cliente tenga un carrito guardado.
- Al tocar **Enviar por WhatsApp** se abre WhatsApp con el mensaje listo; el cliente lo envía desde su app. Después la página ofrece vaciar el carrito.
- Ejemplo de mensaje:

```
*Pedido · Productos San Salvador*
Cliente: María Guamán
Fecha: 21/10/2026

1. Yogurt Bebible 1000 g (Frutilla)
   2 x $2,40 = $4,80
2. Queso Mozzarella 80 g laminado
   3 x $0,95 = $2,85

Unidades: 5
*Total: $7,65 (USD)*

Notas: Entrega el viernes en la mañana
```
