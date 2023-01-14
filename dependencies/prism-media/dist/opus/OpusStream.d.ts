/// <reference types="node" />
import type { OpusEncoder, OpusEncoderOptions } from './adapters/OpusEncoder';
import { Transform, TransformOptions } from 'stream';
export declare enum OpusApplication {
    VoIP = 2048,
    Audio = 2049,
    RestrictedLowDelay = 2051
}
export declare enum OpusCTL {
    SetBitrate = 4002,
    SetFEC = 4012,
    SetPLP = 4014
}
export interface OpusStreamConfig extends OpusEncoderOptions {
    streamOptions?: TransformOptions;
}
export declare abstract class OpusStream extends Transform {
    protected readonly encoder: OpusEncoder;
    protected readonly pcmLength: number;
    constructor(config: OpusStreamConfig);
    protected encode(buffer: Buffer): Buffer;
    protected decode(buffer: Buffer): Buffer;
    _destroy(error: Error | null, callback: (error: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
    abstract applyCTL(ctl: number, value: number): void;
    setBitrate(bitrate: number): void;
    setFEC(enabled: boolean): void;
    setPLP(percentage: number): void;
    private cleanup;
}
