export const getCountdownTime = (seconds: number) => {
    let minutes = 0;
    let newSeconds = seconds;
    while (newSeconds > 60) {
        newSeconds -= 60;
        minutes++;
    }
    return `${minutes != 0 ? `${minutes} minutes` : ""} ${newSeconds != 0 ? `${newSeconds} seconds` : ""}`;
};

export const handleDownloadFile = async (fileId: string) => {
    try {
        const result = await fetch(`/api/${fileId}`);
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
