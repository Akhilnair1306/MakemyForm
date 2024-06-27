

const { pgTable, serial, text, varchar, integer, boolean } = require("drizzle-orm/pg-core");

export const Jsonforms = pgTable('jsonforms', {
    id: serial('id').primaryKey(),
    jsonform: text('jsonform').notNull(),
    createdBy: varchar('CreatedBy').notNull(),
    createdDate: varchar('CreatedAt').notNull(),
    theme: varchar('theme'),
    background: varchar('background'),
    style: varchar('style'),
    enabledSignin: boolean('enabledSignin').default(false)
});

export const userResponses = pgTable('userResponses', {
    id: serial('id').primaryKey(),
    jsonResponse: text('JsonResponse').notNull(),
    createdBy: varchar('CreatedBy').default('anonymous'),
    createdDate: varchar('CreatedAt').notNull(),
    formRef: integer('formRef').references(() => Jsonforms.id)
});
