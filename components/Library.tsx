"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from 'react-icons/ai';
import React from "react";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModel";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";

interface LibraryProps {
    songs: Song[];
}

const Library: React.FC<LibraryProps> = ({
    songs
}) => {
    const authModel = useAuthModal();
    const uploadModel = useUploadModal();
    const { user } = useUser();
    const onPlay = useOnPlay(songs);

    const onClick = () => {
        if (!user) {
            authModel.onOpen();
        }

        // TODO: Subcription check

        return uploadModel.onOpen();
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className=" inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400" size={26} />
                    <p className=" text-neutral-400 font-medium text-md">Your Library</p>
                </div>
                <AiOutlinePlus onClick={onClick} className="text-neutral-400 cursor-pointer hover:text-white transition" size={20} />

            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">
                {
                    songs.map((song) => (
                        <MediaItem
                            onClick={(id: string) => onPlay(id)}
                            key={song.id}
                            data={song}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Library;