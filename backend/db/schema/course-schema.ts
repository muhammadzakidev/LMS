import { pgTable, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema.ts";

export const courseSchemaStatus = pgEnum("course_status", [
  "draft",
  "published",
]);
export const course = pgTable(
  "courses",
  {
    id: text("id").primaryKey(),
    instructorId: text("instructor_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict",
      }),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description").notNull(),
    cover_image_url: text("cover_image_url").notNull(),
    status: courseSchemaStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("instructor_userId_index").on(table.instructorId)],
);

export const courseRelation = relations(course, ({ one }) => ({
  instructor: one(user, {
    fields: [course.instructorId],
    references: [user.id],
  }),
}));
