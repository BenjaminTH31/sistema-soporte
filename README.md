# Sistema de Gestión de Soporte Técnico

## Descripción del proyecto

Este proyecto consiste en una aplicación web para gestionar solicitudes de soporte técnico. Permite registrar tickets, consultar las solicitudes existentes, editar sus datos, cambiar su estado y eliminar tickets.

La información se almacena en una base de datos SQL Server, por lo que los registros se mantienen aunque se actualice la página o se reinicie la aplicación.

## Autor

- Nombre: Benjamín Manríquez Gajardo
- Asignatura: Backend y TDD con Node.js
- Institución: Instituto Profesional Virginio Gómez, sede Chillán

## Tecnologías utilizadas

- Angular para la interfaz web.
- TypeScript, HTML y CSS para el frontend.
- Node.js y Express para el backend y la API REST.
- SQL Server para almacenar la información.
- Git y GitHub para el control de versiones.

## Funcionalidades

- Listar los tickets registrados.
- Crear tickets nuevos.
- Editar la información de los tickets.
- Cambiar el estado de una solicitud.
- Eliminar tickets con confirmación.
- Validar campos obligatorios.
- Mostrar la prioridad y el estado de cada ticket.
- Guardar los cambios en SQL Server.
- Actualizar la lista después de realizar operaciones.

## Estructura del proyecto

sistema-soporte/
├── backend/
│   ├── db.js
│   ├── server.js
│   └── package.json
├── database/
│   └── crear_base_datos.sql
├── frontend/
│   ├── src/
│   ├── angular.json
│   └── package.json
├── .gitignore
└── README.md

## Requisitos

- Node.js y npm.
- Angular CLI.
- SQL Server y SQL Server Management Studio (SSMS).
- Un navegador web.
- Git, si se desea clonar el repositorio.

## Configuración de la base de datos

1. Abrir SQL Server Management Studio.
2. Conectarse a la instancia de SQL Server disponible.
3. Abrir el archivo `database/crear_base_datos.sql`.
4. Ejecutar el script para crear la base de datos `SoporteTecnico` y la tabla `Tickets`.

## Configuración del backend

1. Abrir una terminal en la carpeta `backend`.
2. Instalar las dependencias:

   npm install

3. Crear un archivo `.env` dentro de `backend` con la configuración correspondiente a la instancia local de SQL Server:

   DB_SERVER=TU_SERVIDOR\SQLEXPRESS
   DB_DATABASE=SoporteTecnico
   PORT=3000

4. Reemplazar `NOMBRE_SERVIDOR\SQLEXPRESS` por el nombre real de la instancia instalada y comprobar que la autenticación de Windows esté configurada correctamente.
5. Iniciar el backend:

   npm run dev

La API estará disponible en `http://localhost:3000`.

## Ejecución del frontend

1. Abrir otra terminal en la carpeta `frontend`.
2. Instalar las dependencias:

   npm install

3. Iniciar Angular:

   ng serve

4. Abrir `http://localhost:4200` en el navegador.

El backend y SQL Server deben estar funcionando para utilizar las operaciones de tickets.

## Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/tickets` | Lista los tickets |
| GET | `/api/tickets/:id` | Consulta un ticket por ID |
| POST | `/api/tickets` | Crea un ticket |
| PUT | `/api/tickets/:id` | Actualiza un ticket |
| DELETE | `/api/tickets/:id` | Elimina un ticket |

## Pruebas realizadas

Se realizaron pruebas manuales de las siguientes funciones:

- Inicio del backend y conexión con SQL Server.
- Consulta de tickets.
- Creación de tickets y verificación de su almacenamiento.
- Edición de tickets.
- Cambio de estado.
- Eliminación de tickets.
- Actualización de la lista en la interfaz.
- Persistencia de los datos al recargar la página.

## Uso de inteligencia artificial

Se utilizó ChatGPT como apoyo durante el desarrollo.
El código fue incorporado y ajustado durante el desarrollo del proyecto, y se realizaron pruebas manuales para comprobar el funcionamiento de las operaciones implementadas.

## Repositorio

https://github.com/BenjaminTH31/sistema-soporte