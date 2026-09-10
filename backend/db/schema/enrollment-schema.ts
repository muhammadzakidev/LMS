import {
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema.ts";
import { course } from "./course-schema.ts";
export const enrollments = pgTable(
    "enrollments",
    {
        id:text("id").primaryKey(),
        studentId: text("student_id").notNull().references(()=>user.id,{
         onDelete: "cascade",
        }),
        courseId: text("course_id").notNull().references(()=> course.id, {
            onDelete: "cascade",
        }),
        enrollAt: timestamp("enrolled_at").defaultNow().notNull(),
    },
    (table)=>({
        uniqueStudentCourse: unique().on(
            table.studentId,
            table.courseId,
        )
    })
);
