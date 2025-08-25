# README del Proyecto Maps

Bienvenido al proyecto **Maps**.

---

## Desarrollador

- Daniel Bohórquez

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instaladas las siguientes tecnologías:

-   **Node.js**: Versión `22.10.0` o superior.
-   **npm**: Versión `10.2.4` o superior.

Los archivos `.env` necesarios para la configuración del proyecto se encuentran en el correo electrónico donde se compartieron los repositorios.

---

## Pasos para Ejecutar el Proyecto

Sigue estos pasos para poner en marcha la aplicación:

1.  **Clona los repositorios**:
    Clona tanto el repositorio `maps-front` como el `maps-backend`.
    
2.  **Instala las dependencias**:
    Ve a cada uno de los directorios (`maps-front` y `maps-backend`) e instala las dependencias con el siguiente comando:
    ```bash
    npm install
    ```
    
3.  **Ejecuta el proyecto**:
    -   En el directorio `maps-backend`, ejecuta:
        ```bash
        npm run dev
        ```
    -   En el directorio `maps-front`, ejecuta:
        ```bash
        npm run dev
        ```

El **frontend** se ejecutará en `http://localhost:4321` y el **backend** en `http://localhost:4000`.

El proyecto se encuentra alojado en vercer en el siguiente link: https://maps-front-flax.vercel.app/login y cuenta con la conexión al backend para que el proyecto sea probado de forma directa.

## Funcionalidades Principales

El proyecto incluye las siguientes funcionalidades:

-   **Login** y **Registro** de usuarios.
-   **Mapa Interactivo**.
-   **Búsqueda de lugares**.
-   **Detalles de un lugar** específico.
-   **Cierre de sesión** (Logout).

---

## Tecnologías Utilizadas

### Frontend

-   **Astro**
-   **React**
-   **Tailwind CSS**
-   **Framer Motion**
-   **Google Maps API**
-   **Google Places API**
-   **Axios**
-   **Ark UI**

### Backend

-   **Node.js**
-   **Express**
-   **PostgreSQL**

### Otras Herramientas

-   **Git** y **GitHub** para control de versiones.
-   **Figma** para el diseño de la interfaz.