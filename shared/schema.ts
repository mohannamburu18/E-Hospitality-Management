import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

// Export auth models so they're included in the schema
export * from "./models/auth";

// === TABLE DEFINITIONS ===

// Doctors Table
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id), // Link to auth user
  specialty: text("specialty").notNull(),
  licenseNumber: text("license_number").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  bio: text("bio"),
  consultationFee: integer("consultation_fee").notNull(),
  availableDays: text("available_days").array().notNull(), // e.g., ["Monday", "Wednesday"]
  startTime: text("start_time").notNull(), // e.g., "09:00"
  endTime: text("end_time").notNull(), // e.g., "17:00"
  createdAt: timestamp("created_at").defaultNow(),
});

// Patients Table (Extends User with medical specific info)
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id), // Link to auth user
  dateOfBirth: text("date_of_birth").notNull(), // ISO Date string
  gender: text("gender").notNull(),
  bloodType: text("blood_type"),
  allergies: text("allergies"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments Table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id),
  date: text("date").notNull(), // ISO Date string
  time: text("time").notNull(), // "14:30"
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  reason: text("reason").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages Table (Doctor-Patient Communication)
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical Records Table
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id),
  diagnosis: text("diagnosis").notNull(),
  prescription: text("prescription").notNull(),
  testResults: text("test_results"), // Can be a URL to file or text
  treatmentPlan: text("treatment_plan"),
  visitDate: timestamp("visit_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [medicalRecords.doctorId],
    references: [doctors.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true, createdAt: true });
export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, createdAt: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true, status: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, isRead: true });
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true, createdAt: true, visitDate: true });


// === EXPLICIT API CONTRACT TYPES ===

export type Doctor = typeof doctors.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type MedicalRecord = typeof medicalRecords.$inferSelect;

export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type CreateDoctorRequest = InsertDoctor;
export type CreatePatientRequest = InsertPatient;
export type CreateAppointmentRequest = InsertAppointment;
export type CreateMessageRequest = InsertMessage;
export type CreateMedicalRecordRequest = InsertMedicalRecord;

export type UpdateAppointmentRequest = { status: string; notes?: string };
