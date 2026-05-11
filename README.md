# Travel Plans API — NestJS

API REST modular para la gestión de planes de viaje con integración a RestCountries y caché local.

---

## Requisitos

- Node.js >= 18
- npm >= 9

> **SQLite** se usa por defecto — no se necesita instalar ninguna base de datos externa.

---

## Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd travel-plans-api

# 2. Instalar dependencias
npm install

# 3. (Opcional) Configurar variables de entorno
cp .env.example .env
# Editar .env si se desea cambiar la BD o el puerto

# 4. Iniciar en modo desarrollo
npm run start:dev

# La API estará disponible en: http://localhost:3000
```

---

## Arquitectura Interna

```
src/
├── app.module.ts                   ← Módulo raíz (TypeORM + Config)
├── main.ts                         ← Bootstrap + ValidationPipe global
│
├── countries/                      ← Módulo INTERNO (sin rutas HTTP)
│   ├── countries.module.ts
│   ├── countries.service.ts        ← Lógica de caché (cache-aside)
│   ├── entities/
│   │   └── country.entity.ts       ← BD local de países
│   └── providers/
│       └── rest-countries.provider.ts  ← Consumo de API externa
│
└── travel-plans/                   ← Módulo PÚBLICO
    ├── travel-plans.module.ts
    ├── travel-plans.controller.ts  ← Endpoints HTTP
    ├── travel-plans.service.ts     ← Lógica de negocio
    ├── entities/
    │   └── travel-plan.entity.ts
    └── dto/
        └── create-travel-plan.dto.ts   ← Validaciones
```

### Flujo de Caché de Países (Cache-Aside)

```
Cliente → POST /travel-plans
              ↓
     TravelPlansService.create()
              ↓
     CountriesService.resolveCountry("COL")
              ↓
     ┌─────────────────────────────────┐
     │  ¿Existe "COL" en la BD local?  │
     └─────────────────────────────────┘
          SÍ ↓              NO ↓
      CACHE HIT         CACHE MISS
      Retorna BD    RestCountriesProvider
                    → GET /alpha/col
                    → Guarda en BD
                    → Retorna Country
              ↓
     TravelPlan se persiste con FK al Country
              ↓
     Respuesta 201 con plan + datos del país
```

---

## Endpoints

| Método | Ruta               | Descripción                          |
|--------|--------------------|--------------------------------------|
| POST   | `/travel-plans`    | Crear un nuevo plan de viaje         |
| GET    | `/travel-plans`    | Listar todos los planes              |
| GET    | `/travel-plans/:id`| Detalle de un plan por UUID          |
| DELETE | `/travel-plans/:id`| Eliminar un plan por UUID            |

---

## Ejemplos de Peticiones (Postman)

### Crear un plan de viaje

**POST** `http://localhost:3000/travel-plans`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Vacaciones en Colombia",
  "startDate": "2025-07-01",
  "endDate": "2025-07-15",
  "countryCode": "COL"
}
```

**Respuesta 201:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Vacaciones en Colombia",
  "startDate": "2025-07-01",
  "endDate": "2025-07-15",
  "countryCode": "COL",
  "country": {
    "alpha3Code": "COL",
    "name": "Colombia",
    "region": "Americas",
    "capital": "Bogotá",
    "population": 50882891,
    "flagUrl": "https://flagcdn.com/w320/co.png",
    "cachedAt": "2025-06-10T12:00:00.000Z"
  },
  "createdAt": "2025-06-10T12:00:00.000Z",
  "updatedAt": "2025-06-10T12:00:00.000Z"
}
```

---

### Crear un plan para Francia

```json
{
  "title": "Tour por Europa",
  "startDate": "2025-08-10",
  "endDate": "2025-08-25",
  "countryCode": "FRA"
}
```

---

### Listar todos los planes

**GET** `http://localhost:3000/travel-plans`

---

### Obtener un plan por ID

**GET** `http://localhost:3000/travel-plans/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

### Eliminar un plan

**DELETE** `http://localhost:3000/travel-plans/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Respuesta 200:**
```json
{
  "message": "Plan de viaje \"Vacaciones en Colombia\" eliminado exitosamente."
}
```

---

### Errores de validación

**Body inválido:**
```json
{
  "title": "",
  "startDate": "no-es-fecha",
  "endDate": "2025-07-01",
  "countryCode": "XYZW"
}
```

**Respuesta 400:**
```json
{
  "statusCode": 400,
  "message": [
    "El título no puede estar vacío.",
    "startDate debe tener formato de fecha válida (YYYY-MM-DD).",
    "countryCode debe tener exactamente 3 caracteres (código Alpha-3)."
  ],
  "error": "Bad Request"
}
```

### País inválido (código no existe en RestCountries)

```json
{
  "title": "Viaje al país imaginario",
  "startDate": "2025-09-01",
  "endDate": "2025-09-10",
  "countryCode": "ZZZ"
}
```

**Respuesta 404:**
```json
{
  "statusCode": 404,
  "message": "País con código Alpha-3 \"ZZZ\" no existe en RestCountries.",
  "error": "Not Found"
}
```

---

## Limpiar la base de datos

```bash
# Eliminar el archivo SQLite para empezar desde cero
rm travel_plans.db

# La BD se recreará automáticamente al iniciar la app (synchronize: true)
npm run start:dev
```

---

## Dependencias principales

| Paquete | Propósito |
|---------|-----------|
| `@nestjs/typeorm` | ORM para gestión de entidades y BD |
| `@nestjs/axios` | Cliente HTTP para API externa |
| `@nestjs/config` | Variables de entorno |
| `class-validator` | Validación de DTOs |
| `class-transformer` | Transformación de tipos |
| `sqlite3` | Base de datos embebida (sin servidor) |
