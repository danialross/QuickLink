export const getCountdownTime = (seconds: number) => {
    let minutes = 0;
    let newSeconds = seconds;
    while (newSeconds > 60) {
        newSeconds -= 60;
        minutes++;
    }
    return `${minutes != 0 ? `${minutes} minutes` : ""} ${newSeconds != 0 ? `${newSeconds} seconds` : ""}`;
};
