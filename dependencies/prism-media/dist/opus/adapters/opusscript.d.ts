/// <reference types="node" />
import { OpusEncoder as AbstractOpusEncoder, OpusEncoderOptions } from './OpusEncoder';
export declare class OpusScriptEncoder extends AbstractOpusEncoder {
    private readonly encoder;
    constructor(options: OpusEncoderOptions);
    encode(buffer: Buffer): Buffer;
    decode(buffer: Buffer): Buffer;
    applyEncoderCTL(ctl: number, value: number): void;
    applyDecoderCTL(ctl: number, value: number): void;
    delete(): void;
}
