CREATE TYPE "role" AS ENUM('Students', 'Instructor');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"role" "role" DEFAULT 'Students'::"role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
