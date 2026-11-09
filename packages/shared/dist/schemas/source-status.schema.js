import { z } from 'zod';
import { PLATFORMS } from '../constants/platforms.constants.js';
import { PlatformSchema, TimestampSchema } from './primitives.schema.js';
const CANONICAL_ORDER = PLATFORMS.join(',');
export const SourceStatusSchema = z.object({
    platform: PlatformSchema,
    status: z.enum(['ok', 'stale', 'error', 'disabled']),
    lastSuccessAt: TimestampSchema.nullable(),
    message: z.string().nullable(),
});
/** meta.sources: every platform exactly once, in PLATFORMS order. */
export const SourceStatusListSchema = z
    .array(SourceStatusSchema)
    .refine((list) => list.map((entry) => entry.platform).join(',') === CANONICAL_ORDER, {
    error: 'sources must list every platform once, in enum order',
});
