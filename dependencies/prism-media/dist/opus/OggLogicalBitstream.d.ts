/// <reference types="node" />
import { LogicalBitstreamOptions, OggLogicalBitstream as AbstractOggLogicalBitstream } from '../ogg/OggLogicalBitstream';
import { OpusHead, OpusTags } from './utils';
export interface OggOpusLogicalBitstreamOptions extends Partial<LogicalBitstreamOptions> {
    opusHead: OpusHead;
    opusTags: OpusTags;
}
export declare type PartialOggOpusLogicalBitstreamOptions = Pick<OggOpusLogicalBitstreamOptions, 'opusHead'> & Partial<OggOpusLogicalBitstreamOptions>;
/**
 * Transforms an object stream of Opus objects into a logical Ogg Opus stream that is compliant
 * with RFC7845 {@link https://tools.ietf.org/html/rfc7845}
 */
export declare class OggLogicalBitstream extends AbstractOggLogicalBitstream {
    readonly opusHead: OpusHead;
    readonly opusTags: OpusTags;
    constructor(options: PartialOggOpusLogicalBitstreamOptions);
    protected calculateGranulePosition(packets: Buffer[]): number;
}
