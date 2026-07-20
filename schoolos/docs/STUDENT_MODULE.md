# Student Information System (SIS) Module

## Overview

The SIS module is the core of SchoolOS, providing complete student lifecycle management from admission through graduation and alumni conversion.

## Database Tables

### Academic Structure
| Table | Description |
|-------|-------------|
| `academic_years` | School years with current/archived status |
| `academic_terms` | Terms within academic years (semester/trimester/quarter) |
| `campuses` | Physical or virtual campus locations |
| `buildings` | Buildings within campuses |
| `rooms` | Rooms within buildings |
| `departments` | Academic departments |
| `subject_groups` | Groupings of subjects |
| `subjects` | Individual subjects with code, type, credits |
| `classes` | Grades/standards linked to academic years |
| `sections` | Divisions within classes |
| `student_categories` | Category groupings (e.g., General, OBC, SC/ST) |
| `student_houses` | House system (e.g., Red, Blue, Green) |
| `admission_sources` | How students were admitted |

### Student Core
| Table | Description |
|-------|-------------|
| `students` | Complete student profile with demographics |
| `student_documents` | Uploaded documents with verification status |
| `student_medical` | Medical records and insurance |
| `student_addresses` | Permanent and communication addresses |
| `student_guardians` | Guardian/parent relationships |
| `parents` | Parent directory with contact details |
| `parent_students` | Many-to-many parent-child linking |
| `emergency_contacts` | Emergency contact information |
| `student_previous_schools` | Previous education history |
| `student_promotions` | Promotion/demotion history |
| `student_transfers` | Transfer records |
| `student_archives` | Archive/restore audit trail |

## API Endpoints

### Students
- `GET /api/students` - List with search, filter, pagination
- `POST /api/students` - Create student
- `GET /api/students/:id` - Student profile with all relations
- `PATCH /api/students/:id` - Update student
- `DELETE /api/students/:id` - Soft delete
- `GET /api/students/stats` - Aggregate statistics
- `POST /api/students/promote` - Bulk promotion
- `POST /api/students/transfer` - Student transfer
- `POST /api/students/archive` - Bulk archive
- `PATCH /api/students/archive` - Bulk restore

### Academic Structure
- `GET/POST /api/academic-years`
- `GET /api/academic-years/current`
- `GET/POST /api/campuses`
- `GET/POST /api/classes`
- `GET/POST /api/sections`
- `GET/POST /api/subjects`
- `GET/POST /api/parents`

## Validation

All endpoints use Zod schemas defined in `packages/validation/src/schemas/student.ts`.

## Permissions

| Permission | Slug |
|------------|------|
| Create Student | `students:create` |
| Read Student | `students:read` |
| Update Student | `students:update` |
| Delete Student | `students:delete` |
| Archive Student | `students:archive` |
| Restore Student | `students:restore` |
| Promote Student | `students:promote` |
| Transfer Student | `students:transfer` |
| Export Student | `students:export` |
| Import Student | `students:import` |

## Key Features

- **Admission Wizard**: Multi-step form for new student enrollment
- **Student Timeline**: Chronological view of all student events
- **Bulk Operations**: Promote, archive, restore, transfer in bulk
- **Document Management**: Upload with version history and verification
- **Parent Linking**: Support for multiple children per parent
- **Address Management**: Permanent and communication addresses
- **Medical Records**: Allergies, conditions, immunizations, insurance
- **Search**: By name, admission number, roll number, EMIS number
- **Filters**: By class, section, campus, gender, status, house, category
