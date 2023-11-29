"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikedButton from "./LikedButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";

import React, { useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    song,
    songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentSongIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSongIndex = player.ids[currentSongIndex - 1];

        if (!previousSongIndex) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSongIndex);
    }

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentSongIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSongIndex = player.ids[currentSongIndex + 1];

        if (!nextSongIndex) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSongIndex);
    }

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
    return (
        <div className=" grid grid-cols-2 md:grid-cols-3 h-full">
            <div className=" flex w-full justify-start">
                <div className=" flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikedButton songId={song.id} />
                </div>
            </div>
            <div className=" flex md:hidden col-auto w-full justify-end items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
                    <Icon size={30} className="text-black" />
                </div>
            </div>
            <div className=" hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
                <AiFillStepBackward
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                    onClick={onPlayPrevious}
                />
                <div
                    onClick={() => { }}
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer hover:bg-neutral-200 transition"
                >
                    <Icon size={30} className="text-black" />
                </div>
                <AiFillStepForward
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                    onClick={onPlayNext}
                />
            </div>

            <div className=" hidden md:flex w-full justify-end pr-2">
                <div className=" flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon
                        onClick={() => { }}
                        className="cursor-pointer"
                        size={34}
                    />
                    <Slider />
                </div>
            </div>
        </div>
    );
}

export default PlayerContent;