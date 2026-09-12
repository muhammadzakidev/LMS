import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema.ts";
import { course } from "./course-schema.ts";

export const certificate = pgTable(
  "certificates",
  {
    id: text("id").primaryKey(),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, {
        onDelete: "cascade",
      }),
    certificateNumber: text("certificate_number")
      .notNull()
      .unique(),
    issuedAt: timestamp("issued_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ([
     uniqueIndex("student_course_certificate")
      .on(table.studentId, table.courseId),
  ]),
);