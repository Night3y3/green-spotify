"use client";

import AuthModel from "@/components/AuthModel";
import SubscribeModel from "@/components/SubscribeModel";
import UploadModel from "@/components/UploadModel";
import { ProductWithPrice } from "@/types";

import { useEffect, useState } from "react";

interface ModelProviderProps {
    products: ProductWithPrice[];
}

const ModelProvider: React.FC<ModelProviderProps> = ({
    products
}) => {
    const [isMounted, setIsMounted] = useState(false);

    // A clever way to prevent the model from rendering on the server side and causing errors
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <UploadModel />
            <AuthModel />
            <SubscribeModel products={products} />
        </>
    );
}

export default ModelProvider;