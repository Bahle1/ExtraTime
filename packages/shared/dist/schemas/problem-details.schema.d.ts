import { z } from 'zod';
export declare const FieldErrorSchema: z.ZodObject<{
    path: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export declare const ProblemDetailsSchema: z.ZodObject<{
    type: z.ZodString;
    title: z.ZodString;
    status: z.ZodInt;
    detail: z.ZodString;
    instance: z.ZodString;
    requestId: z.ZodNullable<z.ZodString>;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/** One invalid request field: source plus Zod path (query.pageSize) and a message. */
export type FieldError = z.infer<typeof FieldErrorSchema>;
/** RFC 9457 error body. */
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;
