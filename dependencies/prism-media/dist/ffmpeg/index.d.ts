/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
import DuplexChildProcess from 'duplex-child-process';
import { DuplexOptions } from 'stream';
import { findFFmpeg } from './loader';
export interface FFmpegOptions extends DuplexOptions, SpawnOptionsWithoutStdio {
    args: string[];
    forceRefresh?: boolean;
}
export declare class FFmpeg extends DuplexChildProcess {
    constructor(options: FFmpegOptions);
}
export { findFFmpeg };
