"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikedButtonProps {
    songId: string;

};

const LikedButton: React.FC<LikedButtonProps> = ({
    songId
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const authModel = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        const fetehData = async () => {
            const { data, error } = await supabaseClient
                .from("liked_songs")
                .select("*")
                .eq("user_id", user.id)
                .eq("song_id", songId)
                .single();

            if (error) {
                console.log(error);
                return;
            }

            if (!error && data) {
                setIsLiked(true);
            }
        };

        fetehData();
    }, [songId, supabaseClient, user?.id]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if (!user?.id) {
            return authModel.onOpen();
        }

        if (isLiked) {
            const { error } = await supabaseClient
                .from("liked_songs")
                .delete()
                .eq("user_id", user.id)
                .eq("song_id", songId);

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Song removed from liked songs");
                setIsLiked(false);
            }
        } else {
            const { error } = await supabaseClient
                .from("liked_songs")
                .insert({
                    user_id: user.id,
                    song_id: songId,
                });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Song added to liked songs");
                setIsLiked(true);
            }
        }

        router.refresh();
    }

    return (
        <button
            className=" cursor-pointer hover:opacity-75 transition"
            onClick={handleLike}
        >
            <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
        </button>
    );
}

export default LikedButton;