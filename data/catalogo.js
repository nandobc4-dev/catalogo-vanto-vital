/*
 * Datos del catálogo de Productos San Salvador.
 * Fuente: "Catálogo de Productos Lácteos" (PDF, Riobamba).
 *
 * Cómo editar:
 *  - Cada producto tiene una o varias "presentaciones" (peso/tamaño), cada una con su precio.
 *  - "variantes" son las opciones que el cliente elige (sabor, especia...). Se definen en el
 *    producto y una presentación puede reemplazarlas con su propia lista ([] = sin opciones).
 *  - "precio" es un número en la moneda de config.js (USD). Usa null para mostrar "Precio a consultar".
 *  - "imagen" es la foto de estudio de la tarjeta; "foto" es la foto ambientada del detalle.
 *
 * TODO: el catálogo PDF NO incluye precios. Todos los precios de abajo son VALORES DE EJEMPLO
 * y están marcados con "TODO precio". Reemplázalos por la lista de precios real.
 */
window.CATALOGO = {
  categorias: [
    { id: "leches-fermentadas", nombre: "Leches fermentadas" },
    { id: "quesos", nombre: "Quesos" },
    { id: "quesos-semimaduros", nombre: "Quesos semimaduros" },
    { id: "varios", nombre: "Varios" },
  ],

  productos: [
    {
      id: "yogurt-bebible",
      nombre: "Yogurt Bebible",
      categoria: "leches-fermentadas",
      resumen: "Probiótico, cremoso y sin colorantes ni saborizantes artificiales.",
      descripcion:
        "Elaborado con leche pasteurizada semidescremada, fermentos lácticos y cepas probióticas. De consistencia cremosa y ligera acidez natural; ayuda a proteger el organismo y estimula el sistema inmunológico. Libre de semáforo rojo, sin colorantes y sin saborizantes artificiales.",
      imagen: "img/productos/yogurt-bebible.webp",
      foto: "img/productos/yogurt-bebible-foto.webp",
      etiquetaVariante: "Sabor",
      variantes: ["Coco", "Guanábana", "Natural", "Frutilla", "Durazno", "Mora"],
      presentaciones: [
        { id: "3800g", nombre: "3800 g", precio: 7.5, imagen: "img/productos/yogurt-bebible-3800g.webp" }, // TODO precio
        { id: "2000g", nombre: "2000 g", precio: 4.2, imagen: "img/productos/yogurt-bebible-2000g.webp" }, // TODO precio
        { id: "1000g", nombre: "1000 g", precio: 2.4, imagen: "img/productos/yogurt-bebible-1000g.webp" }, // TODO precio
        {
          id: "500g", nombre: "500 g", precio: 1.3, imagen: "img/productos/yogurt-bebible-500g.webp", // TODO precio
          variantes: ["Coco", "Guanábana", "Frutilla", "Durazno", "Mora"],
        },
        {
          id: "200g", nombre: "200 g", precio: 0.6, imagen: "img/productos/yogurt-bebible-200g.webp", // TODO precio
          variantes: ["Coco", "Guanábana", "Frutilla", "Durazno", "Mora"],
        },
        {
          id: "200g-cereal", nombre: "200 g con cereal", precio: 0.85, imagen: "img/productos/yogurt-bebible-200g-cereal.webp", // TODO precio
          variantes: ["Coco", "Guanábana", "Frutilla", "Durazno", "Mora"],
        },
      ],
    },
    {
      id: "kefir",
      nombre: "Kéfir",
      categoria: "leches-fermentadas",
      resumen: "Bebida fermentada con probióticos naturales. 0 % azúcar añadida.",
      descripcion:
        "Bebida fermentada con miles de millones de probióticos naturales, nacida de cultivos vivos que transforman la leche en una bebida suave y nutritiva. Mejora la digestión, equilibra la microbiota intestinal, aporta energía natural y favorece la absorción de vitaminas y minerales. Tu dosis diaria.",
      imagen: "img/productos/kefir.webp",
      foto: "img/productos/kefir-foto.webp",
      presentaciones: [
        { id: "1l", nombre: "1 litro", precio: 3.5 }, // TODO precio
      ],
    },
    {
      id: "yogurt-griego",
      nombre: "Yogurt Griego",
      categoria: "leches-fermentadas",
      resumen: "Alta viscosidad y alto contenido de proteína láctica.",
      descripcion:
        "Yogurt de mucho sabor y alta viscosidad, elaborado con leche descremada y alto contenido de proteína láctica. Recomendado para deportistas, niños y adultos mayores. El natural (sin dulce) es ideal para vinagretas, salsas, ensaladas y granola; también lo ofrecemos endulzado, con mermelada de frutas y con mix de frutos secos.",
      imagen: "img/productos/yogurt-griego.webp",
      foto: "img/productos/yogurt-griego-foto.webp",
      etiquetaVariante: "Sabor",
      variantes: ["Natural", "Endulzado"],
      presentaciones: [
        { id: "1kg", nombre: "1 kg", precio: 6.5, imagen: "img/productos/yogurt-griego-1kg.webp" }, // TODO precio
        { id: "450g", nombre: "450 g", precio: 3.2, imagen: "img/productos/yogurt-griego-450g.webp" }, // TODO precio
        { id: "200g", nombre: "200 g", precio: 1.6, imagen: "img/productos/yogurt-griego-200g.webp" }, // TODO precio
        {
          id: "200g-mermelada", nombre: "200 g con mermelada", precio: 1.9, imagen: "img/productos/yogurt-griego-200g-mermelada.webp", // TODO precio
          variantes: ["Frutos rojos", "Maracuyá"],
        },
        {
          id: "120g-frutos-secos", nombre: "120 g con frutos secos", detalle: "Dulce con nueces y almendras",
          precio: 1.75, imagen: "img/productos/yogurt-griego-120g-frutos-secos.webp", // TODO precio
          variantes: [],
        },
      ],
    },
    {
      id: "queso-fresco",
      nombre: "Queso Fresco",
      categoria: "quesos",
      resumen: "Sabor suave, levemente ácido y textura blanda. Medio en grasa y sal.",
      descripcion:
        "Elaborado por coagulación enzimática de leche de vaca semidescremada y pasteurizada. Sabor suave, levemente ácido y textura blanda. Ideal en desayunos, sánduches fríos, ensaladas, locro de papas, empanadas, choclo con queso, pan de yuca, humitas y postres como higos con queso.",
      imagen: "img/productos/queso-fresco.webp",
      foto: "img/productos/queso-fresco-foto.webp",
      presentaciones: [
        { id: "700g", nombre: "700 g", precio: 4.2, imagen: "img/productos/queso-fresco-700g.webp" }, // TODO precio
        { id: "500g", nombre: "500 g", precio: 3.1, imagen: "img/productos/queso-fresco-500g.webp" }, // TODO precio
      ],
    },
    {
      id: "queso-mozzarella",
      nombre: "Queso Mozzarella",
      categoria: "quesos",
      resumen: "Pasta hilada que se derrite con facilidad. En bloque o laminado.",
      descripcion:
        "Queso de pasta hilada elaborado con leche semidescremada pasteurizada, de corteza suave y sabor ligeramente ácido, rico en proteínas y calcio. Se derrite con facilidad y mejora su sabor al gratinar: ideal para pizzas, lasañas, rellenos y sánduches calientes. Pruébalo también con Manjar de Leche San Salvador.",
      imagen: "img/productos/queso-mozzarella.webp",
      foto: "img/productos/queso-mozzarella-foto.webp",
      presentaciones: [
        { id: "1kg", grupo: "Entero", nombre: "1 kg", precio: 8.5, imagen: "img/productos/queso-mozzarella-1kg.webp" }, // TODO precio
        { id: "500g", grupo: "Entero", nombre: "500 g", precio: 4.4, imagen: "img/productos/queso-mozzarella-500g.webp" }, // TODO precio
        { id: "450g", grupo: "Entero", nombre: "450 g", precio: 4.0, imagen: "img/productos/queso-mozzarella-450g.webp" }, // TODO precio
        { id: "250g", grupo: "Entero", nombre: "250 g", precio: 2.3, imagen: "img/productos/queso-mozzarella-250g.webp" }, // TODO precio
        { id: "laminado-1kg", grupo: "Laminado", nombre: "1 kg laminado", precio: 9.5, imagen: "img/productos/queso-mozzarella-laminado-1kg.webp" }, // TODO precio
        { id: "laminado-500g", grupo: "Laminado", nombre: "500 g laminado", precio: 4.9, imagen: "img/productos/queso-mozzarella-laminado-500g.webp" }, // TODO precio
        { id: "laminado-250g", grupo: "Laminado", nombre: "250 g laminado", precio: 2.6, imagen: "img/productos/queso-mozzarella-laminado-250g.webp" }, // TODO precio
        { id: "laminado-80g", grupo: "Laminado", nombre: "80 g laminado", precio: 0.95, imagen: "img/productos/queso-mozzarella-laminado-80g.webp" }, // TODO precio
      ],
    },
    {
      id: "burrata",
      nombre: "Burrata",
      categoria: "quesos",
      resumen: "Exterior delicado y corazón cremoso. Artesanía italiana desde Chimborazo.",
      descripcion:
        "Un corazón cremoso con alma italiana y esencia de nuestros Andes. Su exterior delicado guarda un interior suave y cremoso. Perfecta fresca con tomate, albahaca, aceite de oliva y pan artesanal, en una tabla de quesos o junto a una buena ensalada.",
      imagen: "img/productos/burrata.webp",
      foto: "img/productos/burrata-foto.webp",
      presentaciones: [
        { id: "300g", nombre: "300 g", precio: 6.5 }, // TODO precio
      ],
    },
    {
      id: "queso-crema",
      nombre: "Queso Crema",
      categoria: "quesos",
      resumen: "Cremoso, suave y versátil para cocina, pastelería y rellenos.",
      descripcion:
        "Elaborado con leche pasteurizada y seleccionada mediante un cuidadoso proceso de fermentación que garantiza una textura suave, cremosa y homogénea con un sabor lácteo delicado. Ingrediente versátil para salsas, rellenos y coberturas, pastelería, repostería, panificación e industria alimentaria.",
      imagen: "img/productos/queso-crema.webp",
      foto: "img/productos/queso-crema-foto.webp",
      presentaciones: [
        { id: "1kg", nombre: "1 kg", precio: 7.8, imagen: "img/productos/queso-crema-1kg.webp" }, // TODO precio
        // El PDF dice "450 kg"; se asume que es 450 g.
        { id: "450g", nombre: "450 g", precio: 3.7, imagen: "img/productos/queso-crema-450g.webp" }, // TODO precio
        { id: "250g", nombre: "250 g", precio: 2.2, imagen: "img/productos/queso-crema-250g.webp" }, // TODO precio
      ],
    },
    {
      id: "queso-andino",
      nombre: "Queso Andino",
      categoria: "quesos-semimaduros",
      resumen: "Semimaduro de sabor suave, natural o con especias.",
      descripcion:
        "Queso semimaduro elaborado con leche pasteurizada, cuajo y fermentos lácticos. De sabor suave, buena fuente de proteínas y calcio, medio en grasa y medio en sal. Se presenta natural o con especias. Ideal para tablas de quesos (picaditas), sánduches calientes y recetas gourmet.",
      imagen: "img/productos/queso-andino.webp",
      foto: "img/productos/queso-andino-foto.webp",
      etiquetaVariante: "Sabor",
      // TODO: confirmar qué especias están disponibles en cada presentación.
      variantes: ["Natural", "Orégano", "Ají", "Albahaca", "Higo"],
      presentaciones: [
        { id: "1kg", nombre: "1 kg", precio: 9.0, imagen: "img/productos/queso-andino-1kg.webp" }, // TODO precio
        { id: "500g", nombre: "500 g", precio: 4.7, imagen: "img/productos/queso-andino-500g.webp" }, // TODO precio
      ],
    },
    {
      id: "queso-bellpaesse",
      nombre: "Queso Bellpaesse",
      categoria: "quesos-semimaduros",
      resumen: "Corteza fina, pasta suave y sabor ligeramente ácido.",
      descripcion:
        "Queso semimaduro elaborado con leche pasteurizada, cuajo y fermentos lácticos. Buena fuente de proteínas y calcio, de corteza fina, pasta suave y sabor ligeramente ácido. Ideal como aperitivo, en picaditas, sánduches fríos o calientes, pizzas y cazuelas.",
      imagen: "img/productos/queso-bellpaesse.webp",
      foto: "img/productos/queso-bellpaesse-foto.webp",
      presentaciones: [
        { id: "800g", nombre: "800 g", precio: 8.2, imagen: "img/productos/queso-bellpaesse-800g.webp" }, // TODO precio
        { id: "400g", nombre: "400 g", precio: 4.3, imagen: "img/productos/queso-bellpaesse-400g.webp" }, // TODO precio
        { id: "200g", nombre: "200 g", precio: 2.3, imagen: "img/productos/queso-bellpaesse-200g.webp" }, // TODO precio
      ],
    },
    {
      id: "queso-cheddar",
      nombre: "Queso Cheddar Laminado",
      categoria: "quesos-semimaduros",
      resumen: "Sabor intenso y textura firme, en láminas listas para usar.",
      descripcion:
        "Elaborado con leche pasteurizada, cuajo y fermentos lácticos. El cheddar es apreciado por su sabor intenso y textura firme, que se intensifica con la maduración. Fuente importante de proteínas, calcio y vitaminas; ideal para sándwiches, hamburguesas y gratinados.",
      imagen: "img/productos/queso-cheddar.webp",
      foto: "img/productos/queso-cheddar-foto.webp",
      presentaciones: [
        { id: "500g", nombre: "500 g", precio: 5.2, imagen: "img/productos/queso-cheddar-500g.webp" }, // TODO precio
        { id: "250g", nombre: "250 g", precio: 2.8, imagen: "img/productos/queso-cheddar-250g.webp" }, // TODO precio
        { id: "80g", nombre: "80 g", precio: 1.0, imagen: "img/productos/queso-cheddar-80g.webp" }, // TODO precio
      ],
    },
    {
      id: "crema-de-leche",
      nombre: "Crema de Leche",
      categoria: "varios",
      resumen: "Suave y versátil para heladería, repostería y cocina gourmet.",
      descripcion:
        "Elaborada a partir de leche seleccionada, controlando cada etapa del proceso. Textura suave, cremosa y versátil, ideal para heladería, repostería, pastelería, cocina y preparaciones gourmet. Aporta textura, sabor y cremosidad a cada receta.",
      imagen: "img/productos/crema-de-leche.webp",
      foto: "img/productos/crema-de-leche-foto.webp",
      presentaciones: [
        { id: "25kg", grupo: "Uso industrial", nombre: "25 kg", precio: 110.0, imagen: "img/productos/crema-de-leche-25kg.webp" }, // TODO precio
        { id: "3800g", grupo: "Uso industrial", nombre: "3800 g", precio: 18.5, imagen: "img/productos/crema-de-leche-3800g.webp" }, // TODO precio
        { id: "1kg", grupo: "Funda", nombre: "1 kg", precio: 5.2, imagen: "img/productos/crema-de-leche-1kg.webp" }, // TODO precio
        { id: "500g", grupo: "Funda", nombre: "500 g", precio: 2.7, imagen: "img/productos/crema-de-leche-500g.webp" }, // TODO precio
        { id: "250g", grupo: "Funda", nombre: "250 g", precio: 1.45, imagen: "img/productos/crema-de-leche-250g.webp" }, // TODO precio
      ],
    },
    {
      id: "mantequilla",
      nombre: "Mantequilla",
      categoria: "varios",
      resumen: "El sabor de lo hecho en casa, para mesa, panadería y pastelería.",
      descripcion:
        "Nace de la transformación de crema de leche pasteurizada, buscando ese sabor que recuerda a lo hecho en casa con el respaldo de procesos modernos y controles de calidad. Materia prima versátil para panificación y bollería, laminado de masas, pastelería, repostería, cocina e industria alimentaria.",
      imagen: "img/productos/mantequilla.webp",
      foto: "img/productos/mantequilla-foto.webp",
      presentaciones: [
        { id: "3kg", nombre: "3 kg", precio: 21.0, imagen: "img/productos/mantequilla-3kg.webp" }, // TODO precio
        { id: "1kg", nombre: "1 kg", precio: 7.5, imagen: "img/productos/mantequilla-1kg.webp" }, // TODO precio
        { id: "450g", nombre: "450 g", precio: 3.6, imagen: "img/productos/mantequilla-450g.webp" }, // TODO precio
        // El catálogo muestra dos presentaciones de 250 g: en tarrina y en barra.
        { id: "250g-tarrina", nombre: "250 g tarrina", precio: 2.2, imagen: "img/productos/mantequilla-250g-tarrina.webp" }, // TODO precio
        { id: "250g-barra", nombre: "250 g barra", precio: 2.1, imagen: "img/productos/mantequilla-250g-barra.webp" }, // TODO precio
        { id: "100g", nombre: "100 g barra", precio: 0.95, imagen: "img/productos/mantequilla-100g.webp" }, // TODO precio
      ],
    },
    {
      id: "mantequilla-frutos",
      nombre: "Mantequilla & Frutos",
      categoria: "varios",
      resumen: "Mantequilla con mermelada de fruta en un solo envase.",
      descripcion:
        "Dos sabores que nacieron para estar juntos: la suavidad de nuestra mantequilla con el toque dulce y frutal de la mermelada. Práctica y deliciosa para el desayuno, con panes, tostadas y galletas.",
      imagen: "img/productos/mantequilla-frutos.webp",
      foto: "img/productos/mantequilla-frutos-foto.webp",
      presentaciones: [
        { id: "300g", nombre: "300 g", precio: 3.8 }, // TODO precio
      ],
    },
    {
      id: "manjar-de-leche",
      nombre: "Manjar de Leche",
      categoria: "varios",
      resumen: "Dulce, cremoso y versátil para postres, rellenos y heladería.",
      descripcion:
        "Elaborado con leche seleccionada mediante un proceso controlado que desarrolla su color, aroma, textura cremosa y sabor dulce característicos. Ingrediente versátil para heladería y postres, panificación y bollería, pastelería, repostería e industria alimentaria.",
      imagen: "img/productos/manjar-de-leche.webp",
      foto: "img/productos/manjar-de-leche-foto.webp",
      presentaciones: [
        { id: "1kg", nombre: "1 kg", precio: 5.8, imagen: "img/productos/manjar-de-leche-1kg.webp" }, // TODO precio
        { id: "450g", nombre: "450 g", precio: 2.8, imagen: "img/productos/manjar-de-leche-450g.webp" }, // TODO precio
        { id: "250g", nombre: "250 g", precio: 1.7, imagen: "img/productos/manjar-de-leche-250g.webp" }, // TODO precio
      ],
    },
  ],
};
