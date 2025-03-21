"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { handleDownloadFile } from "@/utils/utils";
import { RiLinksLine } from "react-icons/ri";

export default function Page() {
    const [isLinkValid, setIsLinkValid] = useState(true);
    const pathname = usePathname();

    const handleCheckLink = () => {
        const result = handleDownloadFile(pathname);
        if (!result) {
            setIsLinkValid(false);
        } else {
            setIsLinkValid(true);
        }
    };

    useEffect(() => {
        handleCheckLink();
    }, []);

    return (
        <div
            className={
                "w-screen h-screen flex flex-col items-center justify-center bg-primary text-secondary text-base sm:text-2xl font-kanit gap-4 p-4 transition-opacity duration-300 ease-in-out "
            }
        >
            <div className={"flex items-center justify-center gap-4 text-6xl"}>
                <RiLinksLine />
                QuickLink
            </div>
            <div
                className={`text-center ${isLinkValid ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                <p className={"pt-3 pb-6"}>Downloading...</p>
                <p className={"text-base"}>
                    If it doesn't start,{" "}
                    <button
                        className={"underline hover:text-tertiary "}
                        onClick={() => handleDownloadFile(pathname)}
                    >
                        click here
                    </button>{" "}
                    to download manually.
                </p>
            </div>
            <p
                className={`${!isLinkValid ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                Link expired.{" "}
                <a className={"underline hover:text-tertiary "} href={"/"}>
                    Click here
                </a>{" "}
                to re-upload and share the file.
            </p>
        </div>
    );
}
