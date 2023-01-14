/// <reference types="node" />
export interface OpusTagsData {
    vendor: string;
    tags: Record<string, string>;
}
export declare type PartialOpusTagsData = Partial<OpusTagsData>;
export declare class OpusTags implements Required<OpusTagsData> {
    readonly vendor: string;
    readonly tags: Record<string, string>;
    constructor(data?: PartialOpusTagsData);
    toBuffer(): Buffer;
    static from(buffer: Buffer): OpusTags;
}
