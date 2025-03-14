"use client";
import { RiLinksLine } from "react-icons/ri";
import { FormEvent, useRef, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { MdOutlineFileDownload, MdClear } from "react-icons/md";

export default function Home() {
    const [link, setLink] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [canUpload, setCanUpload] = useState<boolean>(false);

    const uploadFile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputRef.current && inputRef.current.files) {
            const file = inputRef.current.files[0];

            if (!file) return;

            const formData = new FormData();
            formData.append(file.name, file);

            try {
                const result = await fetch("/api/generate-link", {
                    method: "POST",
                    body: formData,
                });
                if (!result.ok) {
                    console.log("Failed to generate link");
                    return;
                }
                const { link } = await result.json();
                console.log("Generated link", link);
                setLink(link);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleFileChange = () => {
        if (inputRef.current && inputRef.current.files && inputRef.current.files[0]) {
            setCanUpload(true);
            return;
        }
    };

    const handleCopyText = () => {
        try {
            navigator.clipboard.writeText(link);
        } catch (e) {
            console.log("Could not copy link", link);
        }
    };

    const handleRemoveFile = () => {
        if( inputRef.current && inputRef.current.files && inputRef.current.files[0]){
            inputRef.current.value = "";
            setCanUpload(false);
            setLink("")
        }
    }

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
                for easy access to the file
            </p>
            <form onSubmit={uploadFile}>
                <div className={"w-fit flex gap-4 pb-8"}>
                    <div
                        className={
                            "flex items-center w-full rounded-lg shadow-2xl border border-secondary text-base p-2 sm:p-6 gap-6"
                        }
                    >
                        <input
                            type="file"
                            ref={inputRef}
                            onChange={handleFileChange}
                            className={`transition-all duration-300 ease-in-out w-full`}
                        />
                        {canUpload && (
                            <button onClick={handleRemoveFile}>
                                <MdClear size={25} className={"w-fit h-fit hover:scale-150 hover:text-accent transition-transform duration-300 ease-in-out"}/>
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
                className={`w-full flex flex-col justify-center items-center transition-opacity duration-200 ease-in-out ${link ? "opacity-100" : "opacity-0"}`}
            >
                <p className={"pb-4 text-center"}>File is Ready!</p>
                <div
                    className={`p-2 rounded-lg flex justify-center items-center `}
                >
                    <div className={"w-20 flex justify-center items-center"}>
                        <MdOutlineFileDownload
                            size={40}
                            className={
                                "text-secondary hover:scale-150 hover:text-accent transition-transform duration-200 ease-in-out"
                            }
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
