-----

# 🚀 Sistema Web de Reclutamiento y Nómina: Hiring Group

## 🎯 Descripción del Proyecto

Este sistema web automatiza los procesos centrales de **Hiring Group**, una empresa dedicada a la subcontratación de personal. El objetivo es proporcionar una plataforma centralizada para la gestión de clientes, la publicación de vacantes, el flujo de postulación y contratación de candidatos, y la crucial **corrida de la nómina mensual**.

La aplicación está diseñada para servir a cinco (5) tipos de usuarios distintos, cada uno con una interfaz y un conjunto de permisos específicos.

## ✨ Características y Requerimientos Cumplidos

El sistema cumple con todos los requerimientos planteados en el proyecto de la UNEG, organizados por tipo de usuario:

### 💼 Usuario de Hiring Group (Administración y Operaciones)

  * [cite\_start]**Gestión de Clientes (CRUD):** Creación del perfil de empresas clientes, incluyendo datos básicos, sector, persona de contacto [cite: 20] [cite\_start]y asignación de usuario/contraseña provisional para su acceso al sistema[cite: 21].
  * **Gestión de Nómina:**
      * [cite\_start]**Preparación de Reportes:** Emisión de reportes de nómina mensual por empresa, mes y año, mostrando datos básicos y salario a devengar[cite: 25, 26].
      * [cite\_start]**Corrida de Nómina:** Proceso mensual que asigna el salario al trabajador, aplicando descuentos obligatorios: 2% para Hiring Group [cite: 30][cite\_start], 0.5% para INCES [cite: 31] [cite\_start]y 1% para el IVSS[cite: 31].
  * [cite\_start]**Contratación:** Selección de un candidato postulado [cite: 22][cite\_start], registro de datos de contratación (tiempo, salario mensual, datos de emergencia, cuenta bancaria) [cite: 23] [cite\_start]e inactivación automática de la oferta[cite: 24].
  * [cite\_start]**Visualización de Ofertas:** Revisión de postulaciones [cite: 17] [cite\_start]y filtrado de ofertas por empresa, salario (mayor a menor) y área de conocimiento[cite: 17, 18].
  * [cite\_start]**Data Básica:** Manejo de catálogos y otra data requerida por el sistema, como los bancos[cite: 32].

### 🏢 Usuario de Empresa Cliente

  * [cite\_start]**Gestión de Ofertas (CRUD):** Creación, modificación y eliminación de ofertas de trabajo, especificando profesión, cargo, descripción del perfil y salario ofrecido[cite: 34, 35].
  * [cite\_start]**Control de Estatus:** Cambio del estatus de las ofertas de activa a inactiva[cite: 36]. [cite\_start]Solo las activas se muestran a los interesados[cite: 37].
  * [cite\_start]**Seguridad:** Opción para cambiar su contraseña de acceso[cite: 37].

### 👤 Usuario Postulante o Candidato

  * [cite\_start]**Registro y Login:** Registro con datos básicos, profesión, universidad, y login usando correo electrónico y contraseña[cite: 39, 40, 41].
  * [cite\_start]**Perfil y CV:** Carga y modificación de experiencias laborales previas (fecha inicio/fin, empresa, cargo) [cite: 40, 44] [cite\_start]y profesiones[cite: 44].
  * [cite\_start]**Búsqueda y Aplicación:** Filtrado de ofertas por área de conocimiento y estado del país[cite: 42], y aplicación a las mismas.
  * [cite\_start]**Consulta de Aplicaciones:** Historial de todas las ofertas a las que ha aplicado, ordenado por fecha de postulación[cite: 43].

### 🧑‍💼 Usuario Contratado

  * [cite\_start]**Recibos de Pago:** Acceso a su interfaz con la opción de visualizar y filtrar sus recibos de pago por mes y año[cite: 46, 47].
  * [cite\_start]**Solicitud de Constancia:** Opción de generar una constancia de trabajo bajo el modelo especificado[cite: 49, 50, 51, 52, 53, 54, 55, 56].
  * [cite\_start]**Visualización de Ofertas:** Puede ver las ofertas, pero tiene restringida la posibilidad de postularse a nuevas contrataciones[cite: 48].

## 💻 Stack Tecnológico (ASL)

| Componente | Tecnología | Versión | Rol |
| :--- | :--- | :--- | :--- |
| **Frontend/UI** | **Astro** | Latest | Construcción de interfaces de usuario rápidas y estáticas (SSG/SSR híbrido) para las vistas de los 5 usuarios. |
| **Backend/API** | **Litestar** (Python) | Latest | Manejo de la lógica de negocio, autenticación, y cálculos complejos (ej: la corrida de nómina). |
| **ORM** | **SQLAlchemy** (Python) | Latest | Mapeo Objeto-Relacional para la gestión de la base de datos desde el *backend*. |
| **DBM Sencillo** | **SQLite** | N/A | Base de datos relacional sin servidor, almacenada en un único archivo, ideal para la simplicidad y el desarrollo rápido. |
| **Lenguaje de Programación** | **Python** | 3.10+ | Lenguaje principal del *backend* (Litestar). |

## 🏗️ Estructura del Proyecto

El repositorio está organizado como un monorepositorio con dos directorios principales: `frontend/` y `backend/`.

```
├── hiring-group/
│   ├── backend/
│   │   ├── app/                      # Código fuente de Litestar (API y Lógica de Negocio)
│   │   │   ├── api/                  # Endpoints (CRUD) para usuarios, ofertas, etc.
│   │   │   ├── services/             # Lógica de negocio (Contratación, Nómina, etc.)
│   │   │   └── models.py             # Definiciones de tablas (SQLAlchemy ORM)
│   │   ├── database/
│   │   │   └── hiring_group.db       # Archivo de Base de Datos SQLite
│   │   └── requirements.txt          # Dependencias de Python (Litestar, SQLAlchemy)
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/           # Componentes UI (React/Vue/Svelte)
│       │   └── pages/                # Rutas y Vistas de Astro (Ej: /login, /empresa/ofertas)
│       ├── public/                   # Archivos estáticos
│       └── package.json              # Dependencias de Astro/UI
│
└── README.md
```

## 🛠️ Configuración y Ejecución (Setup)

Sigue estos pasos para poner en marcha la aplicación:

### 1\. Prerrequisitos

  * **Node.js** (LTS) y **npm** o **yarn**
  * **Python** (3.10+) y **pip**
  * **Git**

### 2\. Configuración del Backend (Litestar + SQLite)

1.  **Instalar Dependencias de Python:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
2.  **Inicializar la Base de Datos:**
      * SQLAlchemy creará el archivo `database/hiring_group.db` y las tablas al iniciar la aplicación, o al ejecutar un script de migración inicial.
3.  **Ejecutar el Servidor API:**
    ```bash
    litestar run
    # El servidor se iniciará generalmente en http://127.0.0.1:8000
    ```

### 3\. Configuración del Frontend (Astro)

1.  **Instalar Dependencias de Node:**
    ```bash
    cd ../frontend
    npm install
    # o yarn install
    ```
2.  **Configurar la Conexión API:**
      * Asegúrate de que la configuración de Astro (`.env` o similar) apunte a la URL correcta del *backend* (ej: `VITE_API_URL=http://127.0.0.1:8000`).
3.  **Ejecutar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    # El frontend se iniciará generalmente en http://127.0.0.1:4321
    ```

## 📚 Documentación y Reporte Académico

El proyecto incluye la documentación requerida para la defensa final:

1.  [cite\_start]Planteamiento del problema (incluyendo los aspectos agregados por el grupo)[cite: 58].
2.  [cite\_start]Carta estructurada del sistema[cite: 59].
3.  [cite\_start]Indicación de las herramientas de desarrollo usadas (DBMS, lenguaje, frameworks, etc.)[cite: 60].
4.  [cite\_start]Modelo E-R y Diagrama de Clases[cite: 60].
5.  [cite\_start]Modelo Relacional implementado en SQLite[cite: 61].
6.  [cite\_start]Diccionario de datos completo (nombre de tabla, descripción, claves, descripción y tipo de dato de cada campo)[cite: 62].
7.  [cite\_start]Pantallas de los formularios y descripción de cada uno[cite: 63].
8.  [cite\_start]Pantallas de la salida de las consultas junto con el *script* SQL correspondiente[cite: 63].

## 🧑‍💻 Equipo de Desarrollo

Este proyecto fue elaborado por un equipo de **[Mínimo cuatro (4) y Máximo cinco (5)]** estudiantes de Ingeniería en Informática (UNEG).

| Nombre | Rol Principal |
| :--- | :--- |
| **[Integrante 1]** | Lider de Proyecto / Arquitectura Backend |
| **[Integrante 2]** | Desarrollador Backend / Lógica de Nómina |
| **[Integrante 3]** | Desarrollador Frontend / UI & UX |
| **[Integrante 4]** | Gestión de Base de Datos / Documentación |
| **[Integrante 5 (Opcional)]** | [Rol adicional] |

**Profesor:** María Raquel Herrera E.
