-- 1. Crear la tabla
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null default 'cliente' check (rol in ('cliente', 'profesional')),
  ciudad text default 'Barranquilla',
  telefono text,
  foto_url text,
  creado_en timestamptz not null default now()
);

-- 2. Activar Row Level Security
alter table public.profiles enable row level security;

-- 3. Política: cualquiera puede VER perfiles (necesario para que un cliente vea perfiles de profesionales)
create policy "Perfiles visibles para todos"
  on public.profiles for select
  using (true);

-- 4. Política: un usuario solo puede EDITAR su propio perfil
create policy "Usuarios editan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 5. Política: un usuario solo puede CREAR su propio perfil (no el de otro)
create policy "Usuarios crean su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 6. Función + trigger: crear el perfil automáticamente cuando alguien se registra
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', 'Usuario'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
