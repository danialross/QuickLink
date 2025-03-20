"use client";
import { RiLinksLine } from "react-icons/ri";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { MdOutlineFileDownload, MdClear } from "react-icons/md";
import { getCountdownTime } from "@/utils/utils";

export default function Home() {
    const [fileData, setFileData] = useState<{
        name: string;
        id: string;
    } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [canUpload, setCanUpload] = useState<boolean>(false);
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    //number of seconds left for link to be valid
    const [fileValidityTimer, setFileValidityTimer] = useState<number | null>(
        null,
    );

    const handleUploadFile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputRef.current && inputRef.current.files) {
            const file = inputRef.current.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            try {
                const result = await fetch("/api/generate-link", {
                    method: "POST",
                    body: formData,
                });
                if (!result.ok) {
                    throw new Error("Failed to generate file's Id");
                }
                const { fileId } = await result.json();
                //60 seconds * 60 minutes
                setFileValidityTimer(60 * 60);
                setFileData({ name: file.name, id: fileId });
            } catch (error) {
                console.error(error);
            }
            handleRemoveFile();
        }
    };

    const handleChangeFile = () => {
        const file: File | null = inputRef?.current?.files?.[0] || null;
        if (!file) {
            return;
        }
        if (file.size > 16 * 1024 * 1024) {
            setIsFileTooBig(true);
            handleRemoveFile();
            return;
        }

        setIsFileTooBig(false);
        setCanUpload(true);
    };

    const handleCopyText = () => {
        try {
            navigator.clipboard.writeText(
                `${process.env.DOMAIN}/api/${fileData?.id}`,
            );
        } catch (e) {
            console.log("Could not copy URL : ", (e as Error).message);
        }
    };

    const handleRemoveFile = () => {
        if (
            inputRef.current &&
            inputRef.current.files &&
            inputRef.current.files[0]
        ) {
            inputRef.current.value = "";
            setCanUpload(false);
        }
    };

    const handleDownloadFile = async () => {
        try {
            const result = await fetch(`/api/${fileData?.id}`);
            if (!result.ok) {
                throw new Error("Failed to download file");
            }
            const resultData = await result.json();
            const byteCharacters = atob(resultData.file);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: resultData.type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = resultData.name;
            document.body.appendChild(a);
            a.click();
        } catch (e) {
            console.error((e as Error).message);
        }
    };

    useEffect(() => {
        if (isFileTooBig) {
            setTimeout(() => setIsFileTooBig(false), 5000);
        }
    }, [isFileTooBig]);

    useEffect(() => {
        if (!fileValidityTimer || fileValidityTimer <= 0) {
            setFileValidityTimer(null);
            setFileData(null);
            return;
        }

        const timeoutId = setTimeout(() => {
            setFileValidityTimer(fileValidityTimer - 1);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [fileValidityTimer]);

    return (
        <div
            className={
                "w-screen h-screen flex flex-col items-center justify-center bg-primary text-secondary text-base sm:text-2xl font-kanit gap-4 p-4"
            }
        >
            <div className={"flex items-center justify-center gap-4 text-6xl"}>
                <RiLinksLine />
                QuickLink
            </div>
            <p className={"pb-8 text-center"}>
                Upload a file to generate a link that can be shared with others
                for easy access
            </p>
            <form onSubmit={handleUploadFile}>
                <div className={"w-fit flex gap-4 pb-8"}>
                    <div
                        className={
                            "relative flex items-center w-full rounded-lg shadow-2xl border border-secondary text-base p-2 sm:p-6 gap-6"
                        }
                    >
                        {isFileTooBig && (
                            <div
                                className={
                                    "absolute -top-7 left-1/2 -translate-x-1/2 text-sm text-tertiary text-nowrap"
                                }
                            >
                                File is too big, must be 16MB or less
                            </div>
                        )}
                        <input
                            type="file"
                            ref={inputRef}
                            onChange={handleChangeFile}
                            className={`transition-all duration-300 ease-in-out w-full`}
                        />
                        {canUpload && (
                            <button onClick={handleRemoveFile}>
                                <MdClear
                                    size={25}
                                    className={
                                        "w-fit h-fit hover:scale-150 hover:text-accent transition-transform duration-300 ease-in-out"
                                    }
                                />
                            </button>
                        )}
                    </div>
                    <button
                        className={`${canUpload ? "bg-primary opacity-100" : "bg-accent opacity-50"} text-base border border-secondary rounded-lg p-4 sm:p-6 shadow-2xl hover:bg-accent transition-colors duration-200 ease-in-out`}
                        type="submit"
                        disabled={!canUpload}
                    >
                        Upload
                    </button>
                </div>
            </form>

            <div
                className={`w-full flex flex-col justify-center items-center transition-opacity duration-200 ease-in-out ${fileData ? "opacity-100" : "opacity-0"}`}
            >
                {fileData && (
                    <div className={"text-center pb-4"}>
                        <p>{fileData.name} is ready!</p>
                        {fileValidityTimer && (
                            <p className={"text-sm text-tertiary"}>
                                This link is only valid for{" "}
                                {getCountdownTime(fileValidityTimer)}
                            </p>
                        )}
                    </div>
                )}
                <div
                    className={`p-2 rounded-lg flex justify-center items-center `}
                >
                    <div className={"w-20 flex justify-center items-center"}>
                        <MdOutlineFileDownload
                            size={40}
                            className={
                                "text-secondary hover:scale-150 hover:text-accent transition-transform duration-200 ease-in-out"
                            }
                            onClick={handleDownloadFile}
                        />
                    </div>
                    <div className={"w-20  flex justify-center items-center"}>
                        <MdContentCopy
                            size={35}
                            className={
                                "text-secondary hover:scale-150 hover:text-accent transition-transform duration-200 ease-in-out"
                            }
                            onClick={handleCopyText}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
