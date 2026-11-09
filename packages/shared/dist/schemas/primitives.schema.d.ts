import { z } from 'zod';
export declare const PlatformSchema: z.ZodEnum<{
    youtube: "youtube";
    instagram: "instagram";
    facebook: "facebook";
}>;
export declare const SlugSchema: z.ZodString;
export declare const TimestampSchema: z.ZodISODateTime;
/** Raw platform count; null when the platform does not report it. */
export declare const CountSchema: z.ZodNullable<z.ZodInt>;
export declare const PublicUrlSchema: z.ZodURL;
export declare const SiteImagePathSchema: z.ZodString;
export declare const ImageUrlSchema: z.ZodUnion<readonly [z.ZodURL, z.ZodString]>;
export declare const ImageSchema: z.ZodObject<{
    url: z.ZodUnion<readonly [z.ZodURL, z.ZodString]>;
    width: z.ZodInt;
    height: z.ZodInt;
    alt: z.ZodString;
}, z.core.$strip>;
/** Builds the schema of an opaque ID with a type prefix such as 'ep_'. */
export declare function prefixedIdSchema(prefix: `${string}_`): z.ZodString;
/** Aggregated platform. */
export type Platform = z.infer<typeof PlatformSchema>;
/** Lowercase kebab-case routing key. */
export type Slug = z.infer<typeof SlugSchema>;
/** ISO 8601 UTC timestamp ending in Z. */
export type Timestamp = z.infer<typeof TimestampSchema>;
/** Absolute https URL. */
export type PublicUrl = z.infer<typeof PublicUrlSchema>;
/** Root-relative /images/ path. */
export type SiteImagePath = z.infer<typeof SiteImagePathSchema>;
/** PublicUrl or SiteImagePath. */
export type ImageUrl = z.infer<typeof ImageUrlSchema>;
/** Image with intrinsic dimensions. */
export type Image = z.infer<typeof ImageSchema>;
