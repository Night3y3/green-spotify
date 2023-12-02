"use client";

import useDebounce from "@/hooks/useDebounce";
import Input from "./ui/Input";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import queryString from "query-string";

const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState<string>("");
    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        const quary = {
            title: debouncedValue
        };

        const url = queryString.stringifyUrl({
            url: "/search",
            query: quary
        });

        queryString

        router.push(url);
    }, [debouncedValue, router]);


    return (
        <Input
            placeholder="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

export default SearchInput;