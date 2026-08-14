-- 1. Crear la tabla
create table public.services (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  nombre text not null,
  descripcion text,
  precio numeric(10,2) not null check (precio >= 0),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

-- 2. Activar Row Level Security
alter table public.services enable row level security;

-- 3. Política: servicios activos son públicos; el dueño ve también los suyos inactivos
create policy "Servicios visibles según estado"
  on public.services for select
  using (activo = true or auth.uid() = professional_id);

-- 4. Política: solo puede crear servicios un usuario con rol 'profesional', y solo a su propio nombre
create policy "Profesionales crean sus propios servicios"
  on public.services for insert
  with check (
    auth.uid() = professional_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and rol = 'profesional'
    )
  );

-- 5. Política: solo el dueño edita sus servicios
create policy "Profesionales editan sus propios servicios"
  on public.services for update
  using (auth.uid() = professional_id);
