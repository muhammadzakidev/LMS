import {
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema.ts";
import { lessons } from "./lesson-schema.ts";

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: text("id").primaryKey(),

    studentId: text("student_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, {
        onDelete: "cascade",
      }),

    completedAt: timestamp("completed_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("student_lesson_unique").on(
      table.studentId,
      table.lessonId
    ),
  ]
);
