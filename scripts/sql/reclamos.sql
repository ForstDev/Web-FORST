-- Libro de reclamaciones virtual de FORST E.I.R.L.
-- Ejecutar una sola vez en Supabase: SQL Editor > New query > Run.
--
-- La tabla solo se escribe desde el servidor del sitio con la clave
-- secreta (SUPABASE_SERVICE_ROLE_KEY). RLS queda activado y sin
-- políticas, así nadie puede leerla ni escribirla con la clave pública.
-- Las hojas se conservan al menos 2 años desde su registro
-- (D.S. 011-2011-PCM, art. 12).

create table if not exists public.reclamos (
  id                        bigint generated always as identity primary key,
  creado_en                 timestamptz not null default now(),
  tipo                      text not null check (tipo in ('reclamo', 'queja')),
  nombres                   text not null,
  tipo_documento            text not null check (tipo_documento in ('DNI', 'CE', 'PASAPORTE', 'RUC')),
  numero_documento          text not null,
  domicilio                 text not null,
  telefono                  text not null,
  correo                    text not null,
  menor_de_edad             boolean not null default false,
  apoderado                 text,
  bien_tipo                 text not null check (bien_tipo in ('producto', 'servicio')),
  monto                     numeric(12, 2),
  bien_descripcion          text not null,
  detalle                   text not null,
  pedido                    text not null,
  acepta_tratamiento_datos  boolean not null,
  estado                    text not null default 'pendiente'
                              check (estado in ('pendiente', 'en_revision', 'respondido')),
  respuesta                 text,
  respondido_en             timestamptz
);

alter table public.reclamos enable row level security;

-- Para revisar los pendientes y su fecha límite aproximada (15 días
-- hábiles son unas 3 semanas; confirma feriados antes de responder):
-- select id, creado_en, tipo, nombres, correo, estado
-- from public.reclamos where estado <> 'respondido' order by creado_en;
