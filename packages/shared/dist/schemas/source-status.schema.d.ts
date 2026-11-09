import { z } from 'zod';
export declare const SourceStatusSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        youtube: "youtube";
        instagram: "instagram";
        facebook: "facebook";
    }>;
    status: z.ZodEnum<{
        error: "error";
        ok: "ok";
        stale: "stale";
        disabled: "disabled";
    }>;
    lastSuccessAt: z.ZodNullable<z.ZodISODateTime>;
    message: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** meta.sources: every platform exactly once, in PLATFORMS order. */
export declare const SourceStatusListSchema: z.ZodArray<z.ZodObject<{
    platform: z.ZodEnum<{
        youtube: "youtube";
        instagram: "instagram";
        facebook: "facebook";
    }>;
    status: z.ZodEnum<{
        error: "error";
        ok: "ok";
        stale: "stale";
        disabled: "disabled";
    }>;
    lastSuccessAt: z.ZodNullable<z.ZodISODateTime>;
    message: z.ZodNullable<z.ZodString>;
}, z.core.$strip>>;
/** Freshness of one platform in the serving snapshot. */
export type SourceStatus = z.infer<typeof SourceStatusSchema>;
