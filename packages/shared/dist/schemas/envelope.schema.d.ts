import { z } from 'zod';
/** Page-based list envelope. */
export declare function collectionEnvelope<T extends z.ZodType>(item: T): z.ZodObject<{
    data: z.ZodArray<T>;
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
        page: z.ZodInt;
        pageSize: z.ZodInt;
        totalItems: z.ZodInt;
        totalPages: z.ZodInt;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Keyset list envelope; nextCursor is null on the last page. */
export declare function cursorEnvelope<T extends z.ZodType>(item: T): z.ZodObject<{
    data: z.ZodArray<T>;
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
        limit: z.ZodInt;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Single-resource envelope. */
export declare function singleEnvelope<T extends z.ZodType>(data: T): z.ZodObject<{
    data: T;
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const EpisodeListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
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
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
        page: z.ZodInt;
        pageSize: z.ZodInt;
        totalItems: z.ZodInt;
        totalPages: z.ZodInt;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const EpisodeResponseSchema: z.ZodObject<{
    data: z.ZodObject<{
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
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const HostListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>;
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
        page: z.ZodInt;
        pageSize: z.ZodInt;
        totalItems: z.ZodInt;
        totalPages: z.ZodInt;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const HostResponseSchema: z.ZodObject<{
    data: z.ZodObject<{
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
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const SocialFeedResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>;
    meta: z.ZodObject<{
        generatedAt: z.ZodISODateTime;
        sources: z.ZodArray<z.ZodObject<{
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
        limit: z.ZodInt;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** GET /api/v1/episodes body. */
export type EpisodeListResponse = z.infer<typeof EpisodeListResponseSchema>;
/** GET /api/v1/episodes/:slug body. */
export type EpisodeResponse = z.infer<typeof EpisodeResponseSchema>;
/** GET /api/v1/hosts body. */
export type HostListResponse = z.infer<typeof HostListResponseSchema>;
/** GET /api/v1/hosts/:slug body. */
export type HostResponse = z.infer<typeof HostResponseSchema>;
/** GET /api/v1/social/feed body. */
export type SocialFeedResponse = z.infer<typeof SocialFeedResponseSchema>;
