// "use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import useUploadModal from "@/hooks/useUploadModel";
import Model from "./Model";
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";

const UploadModel = () => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModel = useUploadModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            // Reset the form
            reset();
            uploadModel.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        //Upload to supabase
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error("Please upload both files");
                return;   // If return is not used then it will toast and start uploading even if files are missing
            }

            const uniqueID = uniqid();   // It will be use to safely upload songs

            //Upload Songs
            const {
                data: songData,
                error: songError,
            } = await supabaseClient
                .storage
                .from('songs')     // Supabase -> Storage -> songs(Bucket created earlier)
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });   // 3600 seconds = 1 hour

            if (songError) {
                setIsLoading(false);
                return toast.error("Failed song upload");
            }

            // Upload Image
            const {
                data: imageData,
                error: imageError,
            } = await supabaseClient
                .storage
                .from('images')     // Supabase -> Storage -> images(Bucket created earlier)
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });   // 3600 seconds = 1 hour

            if (imageError) {
                setIsLoading(false);
                return toast.error("Failed image upload");
            }

            // Insert into database
            const {
                error: supabaseError,
            } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path,
                });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success("Song uploaded successfully");
            reset();
            uploadModel.onClose();

        } catch (error) {
            toast.error("Some prob");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Model
            title="Add a song"
            description="Upload an mp3 file"
            isOpen={uploadModel.isOpen}
            onChange={onChange}

        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className=" flex flex-col gap-y-4"
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register("title", { required: true })}
                    placeholder="Title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register("author", { required: true })}
                    placeholder="Song Author"
                />
                <div>
                    <div className="pb-1">
                        Select a song File
                    </div>
                    <Input
                        id="song"
                        type="file"
                        disabled={isLoading}
                        accept=".mp3"
                        className="cursor-pointer"
                        {...register("song", { required: true })}

                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select an Image
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        className="cursor-pointer"
                        {...register("image", { required: true })}

                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Model>
    );
}

export default UploadModel;