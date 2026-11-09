import { z } from 'zod';
/** Host follow link; handle carries no leading @. */
export declare const SocialLinkSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        youtube: "youtube";
        instagram: "instagram";
        facebook: "facebook";
    }>;
    url: z.ZodURL;
    handle: z.ZodString;
}, z.core.$strip>;
export declare const HostSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        "Lead host": "Lead host";
        "Co-host": "Co-host";
        Analyst: "Analyst";
        Producer: "Producer";
    }>;
    shortBio: z.ZodString;
    bio: z.ZodString;
    avatar: z.ZodNullable<z.ZodObject<{
        url: z.ZodUnion<readonly [z.ZodURL, z.ZodString]>;
        width: z.ZodInt;
        height: z.ZodInt;
        alt: z.ZodString;
    }, z.core.$strip>>;
    favoriteClub: z.ZodNullable<z.ZodString>;
    socialLinks: z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            youtube: "youtube";
            instagram: "instagram";
            facebook: "facebook";
        }>;
        url: z.ZodURL;
        handle: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const HostDetailSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        "Lead host": "Lead host";
        "Co-host": "Co-host";
        Analyst: "Analyst";
        Producer: "Producer";
    }>;
    shortBio: z.ZodString;
    bio: z.ZodString;
    avatar: z.ZodNullable<z.ZodObject<{
        url: z.ZodUnion<readonly [z.ZodURL, z.ZodString]>;
        width: z.ZodInt;
        height: z.ZodInt;
        alt: z.ZodString;
    }, z.core.$strip>>;
    favoriteClub: z.ZodNullable<z.ZodString>;
    socialLinks: z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            youtube: "youtube";
            instagram: "instagram";
            facebook: "facebook";
        }>;
        url: z.ZodURL;
        handle: z.ZodString;
    }, z.core.$strip>>;
    recentEpisodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        slug: z.ZodString;
        title: z.ZodString;
        season: z.ZodNullable<z.ZodInt>;
        episodeNumber: z.ZodNullable<z.ZodInt>;
        episodeType: z.ZodEnum<{
            full: "full";
            bonus: "bonus";
            trailer: "trailer";
        }>;
        summary: z.ZodString;
        publishedAt: z.ZodISODateTime;
        durationSeconds: z.ZodInt;
        artwork: z.ZodObject<{
            url: z.ZodUnion<readonly [z.ZodURL, z.ZodString]>;
            width: z.ZodInt;
            height: z.ZodInt;
            alt: z.ZodString;
        }, z.core.$strip>;
        hosts: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            slug: z.ZodString;
            name: z.ZodString;
            avatarUrl: z.ZodNullable<z.ZodUnion<readonly [z.ZodURL, z.ZodString]>>;
        }, z.core.$strip>>;
        media: z.ZodObject<{
            preferred: z.ZodEnum<{
                youtube: "youtube";
                audio: "audio";
            }>;
            audio: z.ZodNullable<z.ZodObject<{
                url: z.ZodURL;
                mimeType: z.ZodString;
                sizeBytes: z.ZodNullable<z.ZodInt>;
            }, z.core.$strip>>;
            video: z.ZodNullable<z.ZodObject<{
                provider: z.ZodLiteral<"youtube">;
                videoId: z.ZodString;
                embedUrl: z.ZodURL;
                watchUrl: z.ZodURL;
            }, z.core.$strip>>;
        }, z.core.$strip>;
        platforms: z.ZodArray<z.ZodEnum<{
            youtube: "youtube";
            instagram: "instagram";
            facebook: "facebook";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Editorial host profile; a null avatar renders initials. */
export type Host = z.infer<typeof HostSchema>;
/** Host plus recent episodes, newest first. */
export type HostDetail = z.infer<typeof HostDetailSchema>;
