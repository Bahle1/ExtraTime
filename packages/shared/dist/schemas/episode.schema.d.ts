import { z } from 'zod';
export declare const HostSummarySchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    avatarUrl: z.ZodNullable<z.ZodUnion<readonly [z.ZodURL, z.ZodString]>>;
}, z.core.$strip>;
export declare const EpisodeAudioSchema: z.ZodObject<{
    url: z.ZodURL;
    mimeType: z.ZodString;
    sizeBytes: z.ZodNullable<z.ZodInt>;
}, z.core.$strip>;
export declare const EpisodeMediaSchema: z.ZodObject<{
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
export declare const EpisodeSourceSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        youtube: "youtube";
        instagram: "instagram";
        facebook: "facebook";
    }>;
    externalId: z.ZodString;
    url: z.ZodURL;
    publishedAt: z.ZodISODateTime;
    metrics: z.ZodNullable<z.ZodObject<{
        views: z.ZodNullable<z.ZodInt>;
        likes: z.ZodNullable<z.ZodInt>;
        comments: z.ZodNullable<z.ZodInt>;
    }, z.core.$strip>>;
    fetchedAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const ChapterSchema: z.ZodObject<{
    startSeconds: z.ZodInt;
    title: z.ZodString;
}, z.core.$strip>;
export declare const GuestSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const EpisodeSummarySchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const EpisodeSchema: z.ZodObject<{
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
    description: z.ZodString;
    updatedAt: z.ZodISODateTime;
    guests: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    tags: z.ZodArray<z.ZodString>;
    chapters: z.ZodArray<z.ZodObject<{
        startSeconds: z.ZodInt;
        title: z.ZodString;
    }, z.core.$strip>>;
    sources: z.ZodArray<z.ZodObject<{
        platform: z.ZodEnum<{
            youtube: "youtube";
            instagram: "instagram";
            facebook: "facebook";
        }>;
        externalId: z.ZodString;
        url: z.ZodURL;
        publishedAt: z.ZodISODateTime;
        metrics: z.ZodNullable<z.ZodObject<{
            views: z.ZodNullable<z.ZodInt>;
            likes: z.ZodNullable<z.ZodInt>;
            comments: z.ZodNullable<z.ZodInt>;
        }, z.core.$strip>>;
        fetchedAt: z.ZodISODateTime;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Host reference inside episodes. */
export type HostSummary = z.infer<typeof HostSummarySchema>;
/** Audio file reserved for a future RSS source. */
export type EpisodeAudio = z.infer<typeof EpisodeAudioSchema>;
/** Playback options; preferred selects the engine. */
export type EpisodeMedia = z.infer<typeof EpisodeMediaSchema>;
/** One platform copy with raw, dated metrics. */
export type EpisodeSource = z.infer<typeof EpisodeSourceSchema>;
/** Chapter start. */
export type Chapter = z.infer<typeof ChapterSchema>;
/** Episode guest. */
export type Guest = z.infer<typeof GuestSchema>;
/** List projection for cards and rails. */
export type EpisodeSummary = z.infer<typeof EpisodeSummarySchema>;
/** Full episode. */
export type Episode = z.infer<typeof EpisodeSchema>;
