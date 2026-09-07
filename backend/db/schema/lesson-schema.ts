import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { modules } from "./module-schema.ts";

export const lessons = pgTable("lessons" ,{
    id: text("id").primaryKey(),
    moduleId: text("module_id")
    .notNull()
    .references(() => modules.id, {
      onDelete: "cascade",
    }),
    title: text("title").notNull(),
    description: text("description"),
    videoUrl: text("video_url"),
    position: integer("position")
    .notNull()
    .default(0),
     createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

});