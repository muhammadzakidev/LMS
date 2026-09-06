import {pgTable , text , timestamp , integer} from "drizzle-orm/pg-core";
import { course } from "./course-schema.ts";
export const modules = pgTable("modules" ,{
    id: text("id").primaryKey(),
    courseId: text("course_id").notNull().references(() => course.id, {
        onDelete: "cascade",
    }),
    title: text("title").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(()=> new Date).notNull(),
});