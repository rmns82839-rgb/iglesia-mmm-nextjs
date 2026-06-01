import { pgTable, uuid, text, boolean, timestamp, date, varchar } from 'drizzle-orm/pg-core'

export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  nombre: varchar('nombre', { length: 255 }),
  rol: varchar('rol', { length: 50 }).default('miembro').notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})

export const ministerios = pgTable('ministerios', {
  id: uuid('id').defaultRandom().primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  descripcion: text('descripcion'),
  colorHex: varchar('color_hex', { length: 7 }).default('#1E40AF'),
  liderNombre: varchar('lider_nombre', { length: 255 }),
  icono: varchar('icono', { length: 50 }),
  activo: boolean('activo').default(true).notNull(),
})

export const miembros = pgTable('miembros', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }),
  ministerioId: uuid('ministerio_id').references(() => ministerios.id),
  nombreCompleto: varchar('nombre_completo', { length: 255 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  direccion: text('direccion'),
  fechaIngreso: date('fecha_ingreso'),
  activo: boolean('activo').default(true).notNull(),
  foto: text('foto'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})

export const eventos = pgTable('eventos', {
  id: uuid('id').defaultRandom().primaryKey(),
  ministerioId: uuid('ministerio_id').references(() => ministerios.id),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  fechaHora: timestamp('fecha_hora').notNull(),
  lugar: varchar('lugar', { length: 255 }),
  imagenUrl: text('imagen_url'),
  activo: boolean('activo').default(true).notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})

export const asistencias = pgTable('asistencias', {
  id: uuid('id').defaultRandom().primaryKey(),
  miembroId: uuid('miembro_id').references(() => miembros.id, { onDelete: 'cascade' }).notNull(),
  eventoId: uuid('evento_id').references(() => eventos.id, { onDelete: 'cascade' }).notNull(),
  tipo: varchar('tipo', { length: 50 }).default('presencial'),
  registradoEn: timestamp('registrado_en').defaultNow().notNull(),
})

export const peticiones = pgTable('peticiones', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'set null' }),
  nombreSolicitante: varchar('nombre_solicitante', { length: 255 }).notNull(),
  peticion: text('peticion').notNull(),
  estado: varchar('estado', { length: 50 }).default('pendiente').notNull(),
  esAnonima: boolean('es_anonima').default(false).notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})

export const respuestasPeticion = pgTable('respuestas_peticion', {
  id: uuid('id').defaultRandom().primaryKey(),
  peticionId: uuid('peticion_id').references(() => peticiones.id, { onDelete: 'cascade' }).notNull(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id).notNull(),
  respuesta: text('respuesta').notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})

export const comentariosForo = pgTable('comentarios_foro', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'set null' }),
  nombreUsuario: varchar('nombre_usuario', { length: 100 }).notNull(),
  contenido: text('contenido').notNull(),
  moderado: boolean('moderado').default(false).notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})

export const ujieres = pgTable('ujieres', {
  id: uuid('id').defaultRandom().primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 20 }).notNull(),
  activo: boolean('activo').default(true).notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})

export const programacionUjieres = pgTable('programacion_ujieres', {
  id: uuid('id').defaultRandom().primaryKey(),
  fecha: date('fecha').notNull(),
  diaSemana: varchar('dia_semana', { length: 20 }).notNull(),
  tipoServicio: varchar('tipo_servicio', { length: 100 }),
  ujierIds: text('ujier_ids').notNull(),
  notas: text('notas'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
})