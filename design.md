# POC — Migración a Material Design 3 con MUI v6

## Objetivo

Migrar la interfaz de **Decarrerita** de su sistema de diseño actual (Tailwind CSS + estilos custom) a **Material Design 3** utilizando **MUI v6** como librería de componentes, manteniendo la paleta de colores y la identidad visual del proyecto.

## Stack Propuesto

| Capa | Actual | Nuevo |
|------|--------|-------|
| Componentes | Hand-rolled con Tailwind | `@mui/material` (v6) |
| Estilos | Tailwind utility classes | Emotion (`@emotion/react`) + Tailwind para layout/espaciado |
| Iconos | — | `@mui/icons-material` |
| Tema | `tailwind.config.js` con tokens custom | `createTheme()` de MUI mapeando tokens actuales |
| Modo oscuro | Clase `.dark` en `<html>` | `theme.palette.mode: 'dark'` |

## Mapeo de Tokens Actuales → Theme de MUI

### Colores (modo oscuro)

| Token Actual | MUI Theme Key | Valor |
|---|---|---|
| `primary` (#3dffa3) | `palette.primary.main` | `#3dffa3` |
| `on-primary` (#00391f) | `palette.primary.contrastText` | `#00391f` |
| `primary.container` (#007244) | `palette.primary.dark` | `#007244` |
| `surface` (#131313) | `palette.background.default` | `#131313` |
| `surface-container` (#1a1a1a) | `palette.background.paper` | `#1a1a1a` |
| `on-surface` (#e5e2e1) | `palette.text.primary` | `#e5e2e1` |
| `on-surface-variant` (#bacbbc) | `palette.text.secondary` | `#bacbbc` |
| `outline` (#2d2d2d) | `palette.divider` | `#2d2d2d` |
| `error` (#ff4d4d) | `palette.error.main` | `#ff4d4d` |
| `on-error` (#690005) | `palette.error.contrastText` | `#690005` |
| `error.container` (#93000a) | `palette.error.dark` | `#93000a` |

### Tipografía

| Token Actual | MUI Typography |
|---|---|
| `fontFamily.headline` (Sora) | `theme.typography.fontFamily` para títulos |
| `fontFamily.body` (Inter) | `theme.typography.fontFamily` secundaria |
| `text-headline-xl` (48px/56px) | `h1` — `fontSize: '3rem'`, `fontWeight: 700` |
| `text-headline-lg` (32px/40px) | `h2` — `fontSize: '2rem'` |
| `text-headline-md` (24px/32px) | `h3` — `fontSize: '1.5rem'` |
| `text-body-lg` (18px/28px) | `body1` |
| `text-body-md` (16px/24px) | `body2` |
| `text-label-md` (14px, uppercase) | `overline` + `textTransform: 'uppercase'` |

### Sombras

| Token Actual | MUI Shadow |
|---|---|
| `shadow-neon` | `boxShadow: '0 0 20px rgba(61, 255, 163, 0.2)'` |
| `shadow-neon-sm` | `boxShadow: '0 0 15px rgba(61, 255, 163, 0.15)'` |

### Bordes

| Token Actual | MUI |
|---|---|
| `rounded-sm` (4px) | `shape.borderRadius: 4` para `small` |
| `rounded-md` (8px) | `shape.borderRadius: 8` (default) |
| `rounded-lg` (16px) | `shape.borderRadius: 16` |
| `rounded-xl` (24px) | `shape.borderRadius: 24` |

## Migración de Componentes

### Layout (Navegación Lateral)

**Actual:** `Layout.tsx` — Sidebar con menú por rol usando clases Tailwind + saldo-box

**MUI:**
- `Drawer` (ancho 280px, `variant="permanent"`) con `List` + `ListItemButton`
- Secciones separadas por `Divider`
- Logo + nombre en `DrawerHeader`
- Saldo del cliente en `Card` dentro del Drawer
- Botón de logout con `Button` color `error`

### Componentes Compartidos

| Actual | MUI |
|--------|-----|
| `Card.tsx` (glass-card) | `Paper` con `sx: { backdropFilter: 'blur(12px)', border: '1px solid', borderColor: 'divider' }` |
| `Table.tsx` | `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`, `TableContainer` + `Paper` |
| `StarRating.tsx` | `Rating` con `icon`/`emptyIcon` personalizados (neon green) |
| `.btn-primary` | `<Button variant="contained" color="primary">` |
| `.btn-secondary` | `<Button variant="outlined" color="primary">` |
| `.btn-danger` | `<Button variant="contained" color="error">` |
| `.btn-ghost` | `<Button variant="text">` |
| `.btn-sm` | `<Button size="small">` |
| Inputs/Selects/Textarea | `<TextField>`, `<Select>`, `<MenuItem>`, `<TextareaAutosize>` |
| `.status-badge` | `<Chip>` con color condicional (primary/error/default) |
| `.saldo-box` | `<Card>` o `<Paper>` con padding |

### Páginas

Cada página se refactorizará para usar componentes MUI manteniendo la estructura de layout con `Container`, `Box`, `Grid` (o `Stack`).

**Auth (Login/Register):**
- `Container` centrado con `maxWidth="xs"`
- `Paper` con efecto glass (backdrop-filter heredado del theme)
- `TextField` para inputs
- `Button` fullWidth para submit
- Fondo con glows usando `Box` con `sx` + radial gradients

**Dashboard y páginas de cada rol:**
- `Container` con `maxWidth="lg"` o `xl`
- `Typography` para títulos (variant `h4`, `h5`, `h6`)
- `Card` / `CardContent` para tarjetas de información
- `Table` para listados
- `Button` para acciones
- `Dialog` para confirmaciones
- `Snackbar` + `Alert` para notificaciones (toast)

## Estructura de Archivos Nueva

```
frontend/src/
├── theme/
│   ├── theme.ts          # createTheme() con paleta, tipografía, sombras
│   └── components.ts      # (opcional) overrides de componentes globales
├── components/
│   ├── Layout.tsx          # Refactorizado con Drawer + List
│   ├── Card.tsx            # (eliminar, reemplazar por Paper)
│   ├── Table.tsx           # (eliminar, reemplazar por MUI Table)
│   ├── StarRating.tsx      # Refactorizado con MUI Rating
│   └── ui/                 # (futuro) componentes reutilizables con MUI
├── pages/                  # Refactorizadas con componentes MUI
├── context/AuthContext.tsx  # Sin cambios
├── services/api.ts         # Sin cambios
├── App.tsx                 # Envuelto en ThemeProvider + CssBaseline
├── main.tsx                # Sin cambios
└── styles.css              # Reducido (solo grid auth y scrollbar)
```

## Fases de Implementación

### Fase 1 — Setup de MUI
- `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`
- Crear `src/theme/theme.ts` con `createTheme()` mapeando todos los tokens
- Envolver `App` en `ThemeProvider` y agregar `CssBaseline`
- Verificar que el modo oscuro funcione correctamente

### Fase 2 — Layout (Drawer + AppBar)
- Refactorizar `Layout.tsx` para usar `Drawer`, `List`, `ListItemButton`, `Divider`
- Migrar el menú dinámico por rol
- Agregar iconos de `@mui/icons-material` para cada sección
- Migrar logout button y saldo-box

### Fase 3 — Componentes Compartidos
- Reemplazar `Card.tsx` por `Paper` con sx personalizado
- Reemplazar `Table.tsx` por `Table`, `TableHead`, `TableBody`, etc.
- Reemplazar `StarRating.tsx` por `Rating` con iconos personalizados
- Botones globales → `Button` MUI con variantes
- Inputs → `TextField` / `Select` / `MenuItem`

### Fase 4 — Páginas (Login, Register, Dashboard)
- Login y Register con `Container`, `Paper`, `TextField`, `Button`
- Dashboard con `Container`, `Typography`, `Card`
- Refactorizar página por página, comenzando por Auth, luego Admin, luego Chofer, luego Cliente

### Fase 5 — Limpieza
- Remover Bootstrap del `package.json`
- Reducir `styles.css` eliminando clases de componentes migradas
- Mantener solo estilos de auth page (grid/glows) y scrollbar
- Verificar que no queden clases Tailwind obsoletas

## Consideraciones

### Coexistencia Tailwind + MUI
- MUI usa Emotion (CSS-in-JS) para sus estilos
- Tailwind se mantiene para layout (`flex`, `grid`, `p-*`, `m-*`, `gap-*`)
- No usar Tailwind para estilos de componentes que MUI ya provee
- Preferir `sx` prop de MUI sobre clases Tailwind en componentes MUI

### Bundle Size
- MUI v6 tree-shakeable — importar solo lo que se usa
- `@mui/icons-material` pesa ~1.5MB, se recomienda usar imports específicos:
  ```ts
  import HomeIcon from '@mui/icons-material/Home'  // ✅
  import { Home } from '@mui/icons-material'         // ❌ (importa todo)
  ```

### Dark Mode
- El theme se configura con `palette.mode: 'dark'` por defecto
- `CssBaseline` aplica los colores de fondo y texto globalmente
- La clase `.dark` en `<html>` se puede eliminar (MUI maneja el modo desde el theme)

### Server Components
- MUI v6 usa `'use client'` — no hay restricciones porque el frontend es SPA con Vite

## Roadmap

```
poc/material-design ← (actual)
    │
    ├── Fase 1: Setup MUI + Theme
    ├── Fase 2: Layout (Drawer + navegación)
    ├── Fase 3: Componentes compartidos
    ├── Fase 4: Páginas (Auth → Admin → Chofer → Cliente)
    └── Fase 5: Limpieza + pruebas
         │
         └── merge → main
```
