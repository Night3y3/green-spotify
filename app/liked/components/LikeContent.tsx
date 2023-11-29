"use client";

import LikedButton from "@/components/LikedButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LikedContentProps {
    songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({
    songs
}) => {
    const onPlay = useOnPlay(songs);
    const router = useRouter();
    const { isLoading, user } = useUser();

    useEffect(() => {
        if (!user && !isLoading) {
            router.push("/");
        }

    }, [isLoading, user, router]);

    if (songs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-white text-4xl font-bold">
                    You haven&apos;t liked any songs yet
                </h1>
                <p className="text-white text-sm mt-2">
                    Like songs to see them here
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className=" flex flex-col gap-y-2 w-full p-6">
                {songs.map((song) => (
                    <div
                        key={song.id}
                        className="flex items-center justify-between gap-x-4 w-full text-white hover:bg-neutral-800 p-4 rounded-lg transition"
                    >
                        <div className="flex-1">
                            <MediaItem
                                onClick={(id: string) => onPlay(id)}
                                data={song}
                            />

                        </div>
                        <LikedButton songId={song.id} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LikedContent;