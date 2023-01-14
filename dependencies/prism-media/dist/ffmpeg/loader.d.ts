interface FFmpegInfo {
    command: string;
    output: string;
    version: string;
}
export declare function findFFmpeg(forceRefresh?: boolean): FFmpegInfo;
export {};
