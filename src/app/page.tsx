"use client";
import { RiLinksLine } from "react-icons/ri";
import { useState } from "react";
import { MdContentCopy } from "react-icons/md";

export default function Home() {
    const [link, setLink] = useState<string>("www.fakelink.com/resource-file-location-in-server.pdf");
    return (
        <div
            className={"w-screen h-screen flex flex-col items-center justify-center bg-primary text-secondary text-md sm:text-2xl font-kanit gap-4 p-4"}>
            <div className={"flex items-center justify-center gap-4 text-6xl"}>
                <RiLinksLine />
                QuickLink
            </div>
            <p className={"pb-8 text-center"}>Upload a file to generate a link that can be shared with others for easy
                access to the
                file</p>
            <div className={"w-fit flex gap-4 pb-8"}>
                <input className={"w-full rounded-lg shadow-2xl border border-secondary p-4 sm:p-6"}
                       type="file" />
                <button
                    className={"border border-secondary rounded-lg p-4 sm:p-6 shadow-2xl hover:bg-accent transition-colors duration-200 ease-in-out"}>Upload
                </button>
            </div>
            <div
                className={`transition-opacity duration-200 ease-in-out ${link ? "opacity-100" : "opacity-0"} border border-secondary rounded-lg flex justify-center items-center gap-4 shadow-2xl p-16`}
            >
                <p className={"hover:underline hover:text-accent decoration-accent transition-all duration-200 ease-in-out"}>{link}</p>
                <MdContentCopy className={"text-4xl hover:text-5xl hover:text-accent  duration-200 ease-in-out"} />
            </div>
        </div>);
}
