/**
 * Datos de ejemplo para el panel de noxell.dev.
 *
 * Se ejecuta con:  npm run db:seed
 * (también configurado como `prisma.seed` para `npx prisma db seed`)
 */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpieza previa (orden inverso a las dependencias)
  await prisma.prompt.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();

  // ------------------------------------------------------------------
  // Clientes
  // ------------------------------------------------------------------
  const luna = await prisma.client.create({
    data: {
      name: "Lucía Fernández",
      company: "Cafetería Luna",
      email: "hola@cafeterialuna.es",
      phone: "+34 612 345 678",
      notes:
        "Cadena de cafeterías de especialidad en Madrid. Quieren modernizar su presencia digital y la carta.",
    },
  });

  const rojas = await prisma.client.create({
    data: {
      name: "Martín Rojas",
      company: "Estudio Rojas Arquitectura",
      email: "martin@estudiorojas.es",
      phone: "+34 655 234 891",
      notes: "Estudio de arquitectura e interiorismo en Barcelona.",
    },
  });

  const eco = await prisma.client.create({
    data: {
      name: "Sofía Delgado",
      company: "EcoVerde",
      email: "sofia@ecoverde.es",
      phone: "+34 698 112 445",
      notes:
        "Tienda online de productos ecológicos y sostenibles. Muy activos en redes sociales.",
    },
  });

  const sonrisa = await prisma.client.create({
    data: {
      name: "Javier Moreno",
      company: "Clínica Dental Sonrisa",
      email: "info@clinicasonrisa.es",
      phone: "+34 677 908 123",
      notes: "Clínica dental en Valencia. Necesitan sistema de reservas online.",
    },
  });

  // ------------------------------------------------------------------
  // Proyectos
  // ------------------------------------------------------------------
  await prisma.project.createMany({
    data: [
      {
        title: "Web corporativa Cafetería Luna",
        description:
          "Diseño y desarrollo de la web corporativa con carta digital, localizador de tiendas y blog.",
        status: "COMPLETADO",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-11-15"),
        url: "https://cafeterialuna.es",
        tags: "diseño web, next.js, seo",
        clientId: luna.id,
      },
      {
        title: "Tienda online EcoVerde",
        description:
          "E-commerce completo con pasarela de pago, gestión de stock y programa de fidelización.",
        status: "EN_CURSO",
        startDate: new Date("2026-01-10"),
        endDate: null,
        url: null,
        tags: "e-commerce, stripe, diseño ux",
        clientId: eco.id,
      },
      {
        title: "Rediseño web Estudio Rojas",
        description:
          "Rediseño del portfolio con galerías interactivas y optimización de velocidad.",
        status: "COMPLETADO",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-08-20"),
        url: "https://estudiorojas.es",
        tags: "portfolio, animación, rendimiento",
        clientId: rojas.id,
      },
      {
        title: "Sistema de reservas Clínica Sonrisa",
        description:
          "Plataforma de reservas online con recordatorios por email y panel de administración.",
        status: "EN_CURSO",
        startDate: new Date("2026-02-01"),
        endDate: null,
        url: null,
        tags: "reservas, panel admin, email",
        clientId: sonrisa.id,
      },
      {
        title: "Landing page lanzamiento app",
        description:
          "Landing page para el lanzamiento de la app móvil de EcoVerde. En pausa hasta definir el branding.",
        status: "PAUSADO",
        startDate: new Date("2025-12-01"),
        endDate: null,
        url: null,
        tags: "landing, copywriting",
        clientId: eco.id,
      },
      {
        title: "Blog corporativo Cafetería Luna",
        description:
          "Blog con recetas y noticias, integrado con la web principal y newsletter.",
        status: "COMPLETADO",
        startDate: new Date("2026-01-05"),
        endDate: new Date("2026-02-28"),
        url: "https://cafeterialuna.es/blog",
        tags: "blog, newsletter, contenidos",
        clientId: luna.id,
      },
    ],
  });

  // ------------------------------------------------------------------
  // Prompts
  // ------------------------------------------------------------------
  await prisma.prompt.createMany({
    data: [
      {
        title: "Auditoría de accesibilidad WCAG",
        category: "Desarrollo",
        tags: "accesibilidad, wcag, revisión",
        content: `Actúa como un experto en accesibilidad web. Revisa el siguiente componente y señala todos los problemas de accesibilidad según WCAG 2.2 AA: falta de etiquetas, contraste insuficiente, navegación por teclado, roles ARIA incorrectos.

Para cada problema, explica por qué es un problema y propón el código corregido.

Código:

\`\`\`tsx
{{codigo}}
\`\`\``,
      },
      {
        title: "Paleta de colores para marca",
        category: "Diseño",
        tags: "color, identidad visual, branding",
        content: `Eres un diseñador senior especializado en identidad visual. Propón una paleta de colores completa para {{tipo_negocio}} con los siguientes valores de marca: {{valores}}.

Incluye:
- Color primario, secundario y de acento
- Neutros (claro y oscuro)
- Colores de estado (éxito, error, aviso) con sus códigos HEX
- Recomendaciones de contraste y uso`,
      },
      {
        title: "Copy para hero de landing page",
        category: "Marketing",
        tags: "copywriting, landing, conversión",
        content: `Escribe 5 variantes de titular y subtitular para el hero de una landing page de {{producto}}.

Tono: {{tono}}.

Cada variante debe incluir:
- Titular (máx. 10 palabras)
- Subtitular (máx. 25 palabras)
- Texto del botón de llamada a la acción

Enfócate en el beneficio principal para {{audiencia}}.`,
      },
      {
        title: "Checklist SEO on-page",
        category: "SEO",
        tags: "seo, auditoría, posicionamiento",
        content: `Genera una checklist de SEO on-page para la siguiente página.

Analiza: etiqueta title, meta description, jerarquía de encabezados (H1-H3), URLs, texto alternativo de imágenes, enlazado interno, datos estructurados y velocidad de carga.

URL o contenido:

{{url_o_contenido}}

Devuelve la checklist priorizada por impacto, con acciones concretas.`,
      },
      {
        title: "Componente React accesible",
        category: "Desarrollo",
        tags: "react, typescript, tailwind",
        content: `Crea un componente React + TypeScript para {{componente}} siguiendo estas reglas:
- TypeScript estricto
- Accesibilidad WCAG 2.2 AA (roles ARIA, foco visible, navegación por teclado)
- Estilos con Tailwind CSS
- Props documentadas con JSDoc
- Ejemplo de uso

No uses librerías externas.`,
      },
      {
        title: "Brief de proyecto para cliente",
        category: "Contenido",
        tags: "brief, cliente, documentación",
        content: `Redacta un brief de proyecto profesional a partir de estas notas desordenadas de la reunión con el cliente.

Estructúralo en: objetivos, alcance, entregables, plazos, presupuesto estimado y próximos pasos.

Tono profesional y claro, en español.

Notas:

{{notas}}`,
      },
      {
        title: "Ideas de test A/B para titulares",
        category: "Marketing",
        tags: "a/b testing, titulares, cro",
        content: `Propón 6 hipótesis de test A/B para mejorar la conversión del titular actual de nuestra página: "{{titular_actual}}".

Para cada hipótesis indica:
- Variante propuesta
- Qué elemento cambia
- Por qué podría funcionar mejor
- Métrica a medir

Contexto del negocio: {{contexto}}`,
      },
      {
        title: "Documentar endpoint de API",
        category: "Desarrollo",
        tags: "api, documentación, backend",
        content: `Genera documentación clara para este endpoint de API en formato Markdown:
- Descripción
- Método y ruta
- Parámetros (path, query, body) con tipos y ejemplos
- Respuestas posibles con códigos de estado
- Autenticación requerida
- Ejemplo de petición con curl

Endpoint:

{{endpoint}}`,
      },
    ],
  });

  const counts = {
    clients: await prisma.client.count(),
    projects: await prisma.project.count(),
    prompts: await prisma.prompt.count(),
  };
  console.log("Seed completado:", counts);
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
