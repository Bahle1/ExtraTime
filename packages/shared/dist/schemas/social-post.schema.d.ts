import { z } from 'zod';
/** One image or video of a post; Meta CDN URLs may be null. */
export declare const SocialMediaSchema: z.ZodObject<{
    type: z.ZodEnum<{
        video: "video";
        image: "image";
    }>;
    url: z.ZodNullable<z.ZodURL>;
    thumbnailUrl: z.ZodNullable<z.ZodURL>;
    width: z.ZodNullable<z.ZodInt>;
    height: z.ZodNullable<z.ZodInt>;
}, z.core.$strip>;
export declare const SocialPostSchema: z.ZodObject<{
    id: z.ZodString;
    platform: z.ZodEnum<{
        youtube: "youtube";
        instagram: "instagram";
        facebook: "facebook";
    }>;
    kind: z.ZodEnum<{
        video: "video";
        image: "image";
        carousel: "carousel";
        text: "text";
        link: "link";
    }>;
    caption: z.ZodNullable<z.ZodString>;
    permalink: z.ZodURL;
    publishedAt: z.ZodISODateTime;
    media: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            video: "video";
            image: "image";
        }>;
        url: z.ZodNullable<z.ZodURL>;
        thumbnailUrl: z.ZodNullable<z.ZodURL>;
        width: z.ZodNullable<z.ZodInt>;
        height: z.ZodNullable<z.ZodInt>;
    }, z.core.$strip>>;
    author: z.ZodObject<{
        name: z.ZodString;
        handle: z.ZodNullable<z.ZodString>;
        avatarUrl: z.ZodNullable<z.ZodUnion<readonly [z.ZodURL, z.ZodString]>>;
    }, z.core.$strip>;
    metrics: z.ZodNullable<z.ZodObject<{
        likes: z.ZodNullable<z.ZodInt>;
        comments: z.ZodNullable<z.ZodInt>;
        shares: z.ZodNullable<z.ZodInt>;
        views: z.ZodNullable<z.ZodInt>;
    }, z.core.$strip>>;
    relatedEpisodeId: z.ZodNullable<z.ZodString>;
    relatedEpisodeSlug: z.ZodNullable<z.ZodString>;
    fetchedAt: z.ZodISODateTime;
}, z.core.$strip>;
/** Unified social feed item. */
export type SocialPost = z.infer<typeof SocialPostSchema>;
