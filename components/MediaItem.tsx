"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";

import Image from "next/image";
import React from "react";

interface MediaItemProps {
    data: Song;
    onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
    data,
    onClick
}) => {
    const imageUrl = useLoadImage(data);   //It gets a url from the server and returns it to the client using the useLoadImage hook

    const handleClick = () => {
        if (onClick) {
            return onClick(data.id);
        }

        //TODO: Default turn on Player
    }
    return (
        <div
            onClick={handleClick}
            className="
                    flex
                    items-center
                    gap-x-3
                    cursor-pointer
                    hover:bg-neutral-800/50
                    w-full
                    rounded-md
                    p-2
                    transition
                    hover:scale-105
                "
        >
            <div className=" relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
                <Image
                    alt="Song Cover"
                    src={imageUrl || "/Images/liked.png"}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="
                    flex
                    flex-col
                    items-start
                    justify-center
                    flex-grow
                    gap-y-1
                    overflow-hidden
                    "
            >
                <p className=" text-white truncate">
                    {data.title}
                </p>
                <p className=" text-neutral-400 truncate">
                    {data.author}
                </p>

            </div>
        </div>
    );
}

export default MediaItem;