/// <reference types="node" />
export interface OpusHeadData {
    channelCount: number;
    preskip: number;
    sampleRate: number;
    outputGain: number;
}
export declare type PartialOpusHeadData = Pick<OpusHeadData, 'channelCount' | 'sampleRate'> & Partial<OpusHeadData>;
export declare class OpusHead implements OpusHeadData {
    readonly channelCount: number;
    readonly preskip: number;
    readonly sampleRate: number;
    readonly outputGain: number;
    constructor(data: PartialOpusHeadData);
    toBuffer(): Buffer;
}
