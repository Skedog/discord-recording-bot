/// <reference types="node" />
export interface OpusEncoderOptions {
    rate: 8000 | 12000 | 16000 | 24000 | 48000;
    channels: 1 | 2;
    frameSize: number;
}
export declare abstract class OpusEncoder {
    protected readonly options: OpusEncoderOptions;
    constructor(options: OpusEncoderOptions);
    abstract encode(buffer: Buffer): Buffer;
    abstract decode(buffer: Buffer): Buffer;
    abstract applyEncoderCTL(ctl: number, value: number): void;
    abstract applyDecoderCTL(ctl: number, value: number): void;
    abstract delete(): void;
}
