# INVENTARIO FRONTEND — Plan de Desarrollo

## Tech Stack

| Tecnología      | Versión |
| --------------- | ------- |
| Angular         | 18      |
| TypeScript      | 5.x     |
| TailwindCSS     | 3.x     |
| Angular Material| 18      |
| NgRx (State)    | 18      |
| Chart.js / ng2-charts | — |
| Angular Router  | —       |
| Reactive Forms  | —       |
| Jest            | —       |

---

## Arquitectura General

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── services/
│   │   └── models/
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   └── directives/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── categories/
│   │   ├── suppliers/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── notifications/
│   ├── layout/
│   │   ├── sidebar/
│   │   ├── navbar/
│   │   └── main-layout/
│   ├── app.routes.ts
│   └── app.config.ts
├── assets/
│   ├── images/
│   └── icons/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles/
    └── themes/
```

### Patrón: Feature Module + Core + Shared
- **Core:** Singleton services, guards, interceptors, modelos
- **Shared:** Componentes reutilizables, pipes, directivas
- **Features:** Cada módulo de negocio (lazy-loaded)

---

## Rutas

| Ruta               | Módulo        | Guard    |
| ------------------ | ------------- | -------- |
| /auth/login        | AuthModule    | Público  |
| /dashboard         | Dashboard     | Auth     |
| /products          | Products      | Auth     |
| /inventory         | Inventory     | Auth     |
| /categories        | Categories    | Auth     |
| /suppliers         | Suppliers     | Auth     |
| /reports           | Reports       | Auth     |
| /settings          | Settings      | Auth     |
| /users             | Users         | Admin    |

---

## Layout Principal

```
┌─────────────────────────────────────┐
│  Navbar                             │
│  ┌────────┬────────────────────────┐│
│  │        │                        ││
│  │Sidebar │ <router-outlet>        ││
│  │        │   (feature component)  ││
│  │        │                        ││
│  └────────┴────────────────────────┘│
└─────────────────────────────────────┘
```

### Navbar
- Logo / App name
- Search bar (global)
- Notifications bell (badge count)
- User menu (avatar, name, role, logout)

### Sidebar
| Ítem        | Icono  | Rol          |
| ----------- | ------ | ------------ |
| Dashboard   | 📊     | Todos        |
| Products    | 📦     | Todos        |
| Inventory   | 🔄     | Todos        |
| Categories  | 🏷️     | Todos        |
| Suppliers   | 🚚     | Todos        |
| Reports     | 📈     | Todos        |
| Users       | 👥     | Admin        |
| Settings    | ⚙️     | Admin/Mgr    |

---

## Features — Detalle

### Auth
- Login form (email + password)
- JWT almacenado en localStorage
- Interceptor HTTP agrega Bearer token
- `AuthGuard` protege rutas
- `RoleGuard` restringe por rol
- Route `/auth/login` (standalone)

### Dashboard
- **Widgets (cards):**
  - Total productos
  - Productos con stock bajo
  - Valor total del inventario
  - Movimientos del mes
- **Gráficos:**
  - Barras: movimientos mensuales (entradas/salidas)
  - Dona: productos por categoría
  - Línea: valor del inventario en el tiempo
- **Tabla:** Actividad reciente (últimos 10 movimientos)

### Products
- Tabla responsive con:
  - Imagen del producto (thumbnail)
  - Nombre
  - SKU
  - Stock actual
  - Categoría
  - Precio
  - Estado (ACTIVE/INACTIVE/DISCONTINUED) con badge de color
- Búsqueda por nombre/SKU
- Filtros: categoría, estado, rango de stock
- Ordenamiento por columnas
- Paginación (10/25/50)
- Modal para agregar/editar (formulario reactivo con validación)
- Botón eliminar con confirmación

### Inventory Movements
- Lista de movimientos (tabla):
  - Fecha
  - Producto
  - Tipo con badge (INCOMING verde, OUTGOING rojo, ADJUSTMENT azul)
  - Cantidad
  - Usuario que registró
  - Descripción
- Botones: "Registrar Entrada", "Registrar Salida", "Ajustar"
- Formularios modales para cada tipo
- Filtro por fecha, tipo, producto

### Categories
- Tabla simple (nombre, descripción, fecha creación)
- Modal de creación/edición
- Eliminación con verificación (no eliminar si tiene productos)

### Suppliers
- Tabla (nombre, contacto, email, teléfono)
- Modal de creación/edición
- Vincular a productos

### Reports
- Dashboard de reportes con:
  - Chart de barras: productos más movidos
  - Chart de línea: tendencia de inventario
  - Tabla de alertas de stock bajo
  - Exportar datos (CSV)
- Filtros por rango de fechas

### Settings
- Perfil de usuario (editar nombre, email, avatar)
- Cambio de contraseña
- Preferencias (tema oscuro/claro)

### Notifications
- Dropdown en navbar con lista
- Marcas de leído/no leído
- Botón "Marcar todas como leídas"
- Tipos: LOW_STOCK, MOVEMENT, SYSTEM

---

## Estado Global (NgRx)

| Store                  | Responsabilidad                     |
| ---------------------- | ----------------------------------- |
| AuthState              | Usuario actual, token, loading      |
| ProductsState          | Lista, filtros, paginación, CRUD    |
| InventoryState         | Movimientos, registro               |
| CategoriesState        | Lista, CRUD                         |
| SuppliersState         | Lista, CRUD                         |
| DashboardState         | Widgets, charts, actividad reciente |
| NotificationsState     | Lista, conteo no leídos             |

---

## Servicios HTTP (Core)

| Servicio             | Base URL                |
| -------------------- | ----------------------- |
| AuthService          | /api/auth               |
| UsersService         | /api/users              |
| ProductsService      | /api/products           |
| CategoriesService    | /api/categories         |
| SuppliersService     | /api/suppliers          |
| InventoryService     | /api/inventory          |
| ReportsService       | /api/reports            |
| NotificationsService | /api/notifications      |

---

## Mock Data (para desarrollo sin backend)

- Carpeta `src/app/core/mock/`
- Interceptor Http que intercepta `/api/*` y retorna datos mock
- Mismos datos que el seed de backend:
  - 3 usuarios, 30+ productos, 10 categorías, 8 proveedores, 100+ movimientos

---

## UI / Diseño

- **Paleta:** Indigo/blue como primario, slate/gray como neutral
- **Cards:** Sombra suave, bordes redondeados (`rounded-xl`)
- **Tablas:** Con striped rows, hover state
- **Badges:** Colores semánticos (verde, rojo, azul, amarillo)
- **Modales:** Con overlay, animación de entrada
- **Tipografía:** Inter (system font)
- **Dark mode:** Clase `.dark` en `<html>`, Tailwind `dark:` variant
- **Breakpoints:** Mobile-first, sidebar colapsable

---

## Pruebas

| Tipo           | Herramienta |
| -------------- | ----------- |
| Unitarias      | Jest        |
| Componentes    | Testing Library |
| E2E            | Cypress     |

---

## Variables de Entorno

```env
API_URL=http://localhost:3000/api
APP_NAME=Inventario
DEFAULT_THEME=light
```

---

## Docker

### Dockerfile (multi-stage con nginx)

```dockerfile
# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Serve Stage ----
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/inventario-front /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        gzip on;
        gzip_types text/css application/javascript application/json image/svg+xml;
        gzip_min_length 256;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://inventario-api:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### .dockerignore

```gitignore
node_modules
dist
.git
.env
*.log
coverage
.vscode
```

### docker-compose.yml (frontend standalone)

```yaml
version: "3.9"
services:
  frontend:
    build: .
    container_name: inventario-front
    ports:
      - "80:80"
    depends_on:
      - api
    restart: unless-stopped
```

---

## Cronograma sugerido

| Fase | Tarea                          | Días |
| ---- | ------------------------------ | ---- |
| 1    | Setup + Layout + Routing       | 2    |
| 2    | Auth (login, guards, interceptor) | 2 |
| 3    | Dashboard + Charts             | 2    |
| 4    | Products (table, modal, CRUD)  | 3    |
| 5    | Categories + Suppliers         | 2    |
| 6    | Inventory Movements            | 2    |
| 7    | Reports                        | 2    |
| 8    | Notifications + Settings       | 1    |
| 9    | Dark mode + Responsive         | 1    |
| 10   | Mock data + Tests              | 2    |
|      | **Total**                      | **19**|
