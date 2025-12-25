import { z } from 'zod';
import { 
  insertDoctorSchema, 
  insertPatientSchema, 
  insertAppointmentSchema, 
  insertMessageSchema, 
  insertMedicalRecordSchema,
  doctors,
  patients,
  appointments,
  messages,
  medicalRecords,
  users 
} from './schema';

export {
  insertDoctorSchema, 
  insertPatientSchema, 
  insertAppointmentSchema, 
  insertMessageSchema, 
  insertMedicalRecordSchema
};

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  doctors: {
    list: {
      method: 'GET' as const,
      path: '/api/doctors',
      responses: {
        200: z.array(z.custom<typeof doctors.$inferSelect & { user: typeof users.$inferSelect }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/doctors/:id',
      responses: {
        200: z.custom<typeof doctors.$inferSelect & { user: typeof users.$inferSelect }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/doctors',
      input: insertDoctorSchema,
      responses: {
        201: z.custom<typeof doctors.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  patients: {
    get: {
      method: 'GET' as const,
      path: '/api/patients/me',
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/patients',
      input: insertPatientSchema,
      responses: {
        201: z.custom<typeof patients.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments', // Filter by user role (doctor/patient) automatically
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect & { 
          doctor: typeof doctors.$inferSelect & { user: typeof users.$inferSelect },
          patient: typeof patients.$inferSelect & { user: typeof users.$inferSelect }
        }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/appointments',
      input: insertAppointmentSchema,
      responses: {
        201: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/appointments/:id/status',
      input: z.object({ status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']), notes: z.string().optional() }),
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  messages: {
    list: {
        method: 'GET' as const,
        path: '/api/messages/:userId', // Get conversation with a specific user
        responses: {
            200: z.array(z.custom<typeof messages.$inferSelect>()),
        }
    },
    create: {
        method: 'POST' as const,
        path: '/api/messages',
        input: insertMessageSchema,
        responses: {
            201: z.custom<typeof messages.$inferSelect>(),
            400: errorSchemas.validation,
            401: errorSchemas.unauthorized,
        }
    },
    getRecentConversations: {
        method: 'GET' as const,
        path: '/api/messages/conversations',
        responses: {
            200: z.array(z.custom<typeof users.$inferSelect & { lastMessage: string, lastMessageTime: string }>()), // Simplified for now
        }
    }
  },
  medicalRecords: {
      list: {
          method: 'GET' as const,
          path: '/api/medical-records', // Get records for current patient
           responses: {
            200: z.array(z.custom<typeof medicalRecords.$inferSelect & { doctor: typeof doctors.$inferSelect & { user: typeof users.$inferSelect } }>()),
        }
      },
      create: {
          method: 'POST' as const,
          path: '/api/medical-records',
          input: insertMedicalRecordSchema,
          responses: {
            201: z.custom<typeof medicalRecords.$inferSelect>(),
            400: errorSchemas.validation,
            401: errorSchemas.unauthorized,
          }
      }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
