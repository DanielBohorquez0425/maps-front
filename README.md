# README del Proyecto Maps

Bienvenido al proyecto **Maps**. Este es un proyecto completo que incluye tanto el frontend como el backend para una aplicación de mapas interactivos.

---

## Desarrollador

- Daniel Bohórquez

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instaladas las siguientes tecnologías:

-   **Node.js**: Versión `22.10.0` o superior.
-   **npm**: Versión `10.2.4` o superior.
-   **MySQL**: Para la base de datos.

Los archivos `.env` necesarios para la configuración del proyecto se encuentran en el correo electrónico donde se compartieron los repositorios.

---

## Configuración de la Base de Datos

Para que el backend funcione correctamente, necesitas crear la base de datos y la tabla de usuarios. Puedes hacerlo ejecutando las siguientes consultas SQL en tu gestor de base de datos local (como TablePlus):

```sql
-- 1) Creación de la base de datos
CREATE DATABASE IF NOT EXISTS maps_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE maps_db;

-- 2) Creación de la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

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
-   **MySQL**

### Otras Herramientas

-   **Git** y **GitHub** para control de versiones.
-   **TablePlus** para gestión de bases de datos.
-   **Figma** para el diseño de la interfaz.