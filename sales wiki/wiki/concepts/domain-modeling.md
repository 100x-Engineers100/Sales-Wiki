---
title: "Domain Modeling"
type: concept
tags: [database, architecture, sql, supabase, 100x-cohort7]
source_count: 1
---

## Definition
Domain modeling is the process of creating a structured conceptual blueprint of a system's data by identifying entities (nouns), their attributes (properties), and their relationships (verbs) — before touching any database or code.

## Why It Matters
Skipping domain modeling leads to inefficient, redundant, and hard-to-maintain databases. Like architectural blueprints for buildings, domain modeling prevents costly redesigns later and creates shared clarity across teams. The database should be the closest representation of truth for the real-world domain it serves.

## How It Works

### Three Building Blocks
1. **Entities** — the main "things" (nouns): `Book`, `Customer`, `Order`, `User`
2. **Attributes** — characteristics of entities: `title`, `name`, `email`, `created_at`
3. **Relationships** — how entities interact (verbs): `Student enrolls in Course`

### Three Relationship Types
| Type | Description | Example | Implementation |
|------|-------------|---------|---------------|
| One-to-One (1:1) | Each A has exactly one B | User ↔ Profile | Foreign key in either table |
| One-to-Many (1:N) | One A has many Bs | Author → Books | FK in the "many" table |
| Many-to-Many (M:N) | Many A relate to many B | Students ↔ Courses | Junction table (e.g., `Enrollments`) |

### Spreadsheet Simulation Method
Before writing SQL, simulate using Google Sheets:
- Each entity = one tab
- Columns = attributes
- Rows = sample records
- Identify natural Primary Key (unique ID per row)
- Define Foreign Keys that link tabs
- Test real operations (enroll student, list their courses) to validate model

### Primary Keys and Foreign Keys
- **Primary Key (PK)** — unique identifier for each row; e.g., `StudentID`, `BookID`
- **Foreign Key (FK)** — reference to PK in another table; creates the join

### Example: Library System
```
Books: BookID (PK), Title, AuthorName, ISBN
Members: MemberID (PK), Name, Address
Loans: LoanID (PK), BookID (FK), MemberID (FK), DateBorrowed, DateDue
```

### When to Make Something an Entity vs Attribute
- If only the name is needed → attribute in the parent table
- If more details are needed (bio, relationship to other things) → separate entity with FK

## Key Variants / Extensions
- **ERD (Entity-Relationship Diagram)** — visual representation; always draw before creating tables
- **Supabase RLS (Row-Level Security)** — policy layer on top of the data model; users only access their own rows
  - `anon key` — public, RLS enforced (use in client apps)
  - `service_role key` — bypasses RLS, server-only, **never expose to frontend**
- **Junction Tables** — required for M:N relationships; holds the cross-reference and any relationship attributes

## Examples
**AI CRM (100x cohort case study):**
```sql
CREATE TABLE customers (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    lead_score REAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**University system:**
- `Students(StudentID, Name, Email)` 
- `Courses(CourseID, Title, Credits)`
- `Enrollments(EnrollmentID, StudentID FK, CourseID FK, Grade)` — M:N junction table

## Connections
Related concepts: [[full-stack-llm-architecture]], [[fastapi-patterns]], [[context-economy]]
Introduced by: [[100x-cohort7-module2-llm]]

## Open Questions / Unknowns
- When should you use MongoDB (flexible schema) vs PostgreSQL (strict schema)? — Rough rule: if data structure is still evolving, use Mongo; when structure is known, use Postgres.
- How does domain modeling translate to vector database schema design?
