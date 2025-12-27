export interface Show {
  title: string;
  category: string;
  director?: string;
  cast?: string;
  images: string[];
  description: string;
  author?: string;
  original_format?: string;
  original_idea?: string;
  note?: string;
}

// Imágenes disponibles de la galería
const defaultImages = [
  "/images/galeria/Foto-12.webp",
  "/images/galeria/Foto-161.webp",
  "/images/galeria/Foto-37.webp"
];

export const shows: Show[] = [
  // ---------------------------------------------------------
  // CATEGORÍA: OBRAS Y FORMATOS LARGOS IMPROVISADOS
  // ---------------------------------------------------------
  {
    title: "LO ESTUVE PENSANDO",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Lucas Sollazo (Argentina)",
    cast: "Fátima Aguivel y Vica Rodriguez",
    images: defaultImages,
    description: "Obra Improvisada: Neurosis, mar de pensamientos que rodean los cuerpos, los obligan, los moldean. Pensamientos directos, intrusivos, ajenos. Ruido. Vínculos que se hablan y no se escuchan."
  },
  {
    title: "LLÉVAME, TRAGEDIA IMPROVISADA",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Gonzalo Rodolico",
    cast: "Fátima Aguivel",
    images: defaultImages,
    description: "¿Qué hacer cuando la penumbra envuelve el alma una y otra vez? Un personaje navega entre instantes y recuerdos de un rincón de la memoria, enfrentándose a la sombra de su propia existencia."
  },
  {
    title: "RAÍCES",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Vica Rodriguez",
    cast: "Fátima Aguivel, Octavio Aguilar, Karla Rodríguez, Itala Peralta, Gabriela Hencke, Daniel Maravi",
    images: defaultImages,
    description: "Tres personas que atraviesan un conflicto de identidad coinciden en un mismo espacio. ¿Volver o irse de su terruño? ¿De dónde vienen? ¿Quiénes son?"
  },
  {
    title: "VIAJERAS",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Fátima Aguilar",
    cast: "Caro Farfán, Tatie Salas, Karla Rodríguez, Fátima Aguivel",
    images: defaultImages,
    description: "Obra de impro testimonial. Viajeras es una obra que nos invita a acompañar el viaje que atraviesan mujeres enfrentándose a creencias, estereotipos y roles sociales."
  },
  {
    title: "IMPRO FANTÁSTICA",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Daniel Maravi",
    cast: "Gaby Hencke, Karla Rodríguez, Marcos Aguilar, Oscar Valiente, Fatima Aguivel, Vica Rodríguez, Daniel Maravi",
    images: defaultImages,
    description: "Espectáculo de improvisación apto para toda la familia. Acompáñanos a Simi Sapa, un nuevo Dios-Montaña, quien a través de fantásticas historias ayudará a Susy a regresar a casa."
  },
  {
    title: "RADIO VINILO",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Fátima Aguivel",
    cast: "Vica Rodríguez, Estrellita Sotomayor, Octavio Aguilar, Karla Rodríguez, Itala Peralta, Caro Farfán, Tatie Salas, Daniel Maravi",
    images: defaultImages,
    description: "Un espectáculo de improvisación teatral y música. En Radio Vinilo viajamos por las melodías de la vida y los recuerdos detrás de la música. ¡Sintoniza tu historia!"
  },
  {
    title: "EL EFECTO SONDER",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Fátima Aguivel y Vica Rodriguez (Co-dirección)",
    original_idea: "Octavio Aguilar",
    cast: "Espacio Impro",
    images: defaultImages,
    description: "Sonder es la comprensión repentina de que cada persona que se encuentra en nuestro camino tiene una historia por contar. El efecto sonder hace que los personajes menos pensados se conviertan en protagonistas."
  },
  {
    title: "HILANDO HISTORIAS",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Fátima Aguivel",
    cast: "Estrellita Sotomayor, Rebeca Velazquez, Gaby Hencke, Cristian Monzón",
    note: "Muestra del taller Gravedad Escénica",
    images: defaultImages,
    description: "Cada vínculo deja un hilo suelto. Cada historia es parte de otra. No sabemos hacia dónde vamos, pero seguimos tirando del mismo nudo."
  },
  {
    title: "AL PASAR DEL TIEMPO",
    category: "OBRAS Y FORMATOS LARGOS IMPROVISADOS",
    director: "Fátima Aguivel",
    cast: "Mayra Condori, Prizcila Monzón, Rosita Quispe",
    note: "Muestra del Taller montaje",
    images: defaultImages,
    description: "Un formato de improvisación sobre las huellas que el tiempo deja en los vínculos que formamos. Entre recuerdos, silencios y posibilidades."
  },

  // ---------------------------------------------------------
  // CATEGORÍA: ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO
  // ---------------------------------------------------------
  {
    title: "IMPRONAKUY",
    category: "ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO",
    cast: "Espacio Impro",
    images: defaultImages,
    description: "Torneo de Catch de improvisación, varios equipos se enfrentan hasta encontrar un ganador."
  },
  {
    title: "DAME MATCH",
    category: "ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO",
    director: "Vica Rodriguez",
    images: defaultImages,
    description: "Espectáculo de match de improvisación al estilo deportivo: 2 equipos, 1 árbitro, 1 ganador (el público)."
  },
  {
    title: "MONTAGE",
    category: "ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO",
    director: "Fátima Aguivel y Vica Rodriguez (Co-dirección)",
    images: defaultImages,
    description: "¿Qué historias podemos ver en 45 minutos? Todas historias sin guion ni estructura previa, un espectáculo donde todo puede pasar."
  },
  {
    title: "ESPACIO JAM",
    category: "ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO",
    director: "Daniel Maravi y Oscar Valiente (Co-dirección)",
    cast: "Los Khumpas e invitadxs especiales",
    images: defaultImages,
    description: "Jam de Improvisación teatral dirigido por Los Khumpas. Personajes entrañables y cómicos generan encuentros entre improvisadores y diversos artistas escénicos."
  },
  {
    title: "ESPACIO WARMIS",
    category: "ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO",
    cast: "Elenco femenino de Espacio Impro e invitadas",
    images: defaultImages,
    description: "Jam para improvisadoras, junto a la Waylia y la Waylaca, un espectáculo de muchas risas e insolencia."
  },
  {
    title: "ES-PA SHOT",
    category: "ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO",
    director: "Vica Rodriguez",
    cast: "Espacio Impro",
    images: defaultImages,
    description: "Formato Bar de improvisación, para divertirse, morirse de risa y compartir unos shotcitos con amigos."
  },
  {
    title: "LA BANCA",
    category: "ESPECTÁCULOS DE IMPRO CONOCIDOS CON UN TOQUE DE ESPACIO",
    director: "Fátima Aguivel y Vica Rodriguez (Co-dirección)",
    images: defaultImages,
    description: "Formato Largo de impro. Una banca en un parque, 24 horas alrededor de ella, muchas historias."
  },

  // ---------------------------------------------------------
  // CATEGORÍA: FORMATOS AMIGOS (PRESTADOS A ESPACIO IMPRO)
  // ---------------------------------------------------------
  {
    title: "ÍNTIMO",
    category: "FORMATOS AMIGOS (PRESTADOS A ESPACIO IMPRO)",
    original_format: "Lipit (Liga Puertorriqueña de Improvisación Teatral)",
    cast: "Espacio Impro",
    images: defaultImages,
    description: "A través de palabras propuestas por el público, lxs improvisadorxs contarán sus intimidades más profundas."
  },
  {
    title: "LOS TESTIGOS DE JOHNSTONE - LITURGIA",
    category: "FORMATOS AMIGOS (PRESTADOS A ESPACIO IMPRO)",
    original_format: "El Piso Impro (Argentina)",
    cast: "Vica Rodríguez, Fátima Aguivel, Ernesto Rubio, Mauricio Rueda, Adalid R. Rodríguez",
    images: defaultImages,
    description: "Un grupo de autoayuda se junta para compartir sus problemas y resolverlos (o no) gracias a la improvisación."
  },
  {
    title: "AQUÍ VIVIERON",
    category: "FORMATOS AMIGOS (PRESTADOS A ESPACIO IMPRO)",
    original_format: "El Piso Impro (Argentina)",
    cast: "Vica Rodríguez, Fátima Aguivel, Daniela Cruz, Cristian Monzón, Estrellita Sotomayor, Rosita Quispe, Rebeca Velazquez, Angela Tenorio",
    images: defaultImages,
    description: "Cada casa es un archivo vivo de historias. Acompáñanos a descubrir los ecos que habitan detrás de las paredes. Una casa, varias historias."
  },
  {
    title: "CARTOGRAFIAS",
    category: "FORMATOS AMIGOS (PRESTADOS A ESPACIO IMPRO)",
    original_format: "Agos Viglietta (Argentina)",
    cast: "Espacio Impro",
    images: defaultImages,
    description: "Un espectáculo donde las intérpretes crean un pueblo o territorio y cuentan fragmentos de la vida de sus habitantes."
  },
  {
    title: "QUERIDO DIARIO",
    category: "FORMATOS AMIGOS (PRESTADOS A ESPACIO IMPRO)",
    original_format: "Nex Quesada (Costa Rica)",
    cast: "Espacio Impro",
    images: defaultImages,
    description: "Un espectáculo cálido y realista que expone en escena los momentos que atesoramos. Inspirado en la vieja creencia del hilo rojo."
  },

  // ---------------------------------------------------------
  // CATEGORÍA: OBRAS Y FORMATOS DE INVITADOS
  // ---------------------------------------------------------
  {
    title: "ELEO",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Carol Hernandez",
    images: defaultImages,
    description: "Obra de impro testimonial."
  },
  {
    title: "AMORBO",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Gonzalo Rodolico (Argentina)",
    images: defaultImages,
    description: "Obra improvisada."
  },
  {
    title: "MIME",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Jorge Costa (Argentina)",
    images: defaultImages,
    description: "Solo de impro muda."
  },
  {
    title: "MADRE",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Javier Monge (Costa Rica)",
    images: defaultImages,
    description: "Unipersonal de Impro Testimonial."
  },
  {
    title: "GEISHA",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Agos Viglietta (Argentina)",
    images: defaultImages,
    description: "Obra improvisada."
  },
  {
    title: "ETIQUETAS",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Luis Doro Solano y Jose Rojas (Costa Rica)",
    images: defaultImages,
    description: "Obra de impro testimonial."
  },
  {
    title: "CELULITUS CELULOIDE",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Hilda Tovar y Víctor Lara (México)",
    images: defaultImages,
    description: "Obra clown."
  },
  {
    title: "NO TENGO NADA QUE DECIR",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Joamoc y Will Leon",
    images: defaultImages,
    description: "Obra de clown y música."
  },
  {
    title: "EL ÚLTIMO CONCIERTO",
    category: "OBRAS Y FORMATOS DE INVITADOS",
    author: "Feffo Neyra y Pepe Cespedes",
    images: defaultImages,
    description: "Espectáculo de impro y música."
  }
];
