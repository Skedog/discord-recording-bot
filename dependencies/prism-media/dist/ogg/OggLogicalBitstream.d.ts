/// <reference types="node" />
import { Transform, TransformCallback, TransformOptions } from 'stream';
/**
 * Used to control the size of generated created pages
 */
export declare type PageSizeControl = {
    maxPackets: number;
} | {
    maxSegments: number;
};
/**
 * Options used to configure an Ogg logical bitstream
 */
export interface LogicalBitstreamOptions extends TransformOptions {
    crc: boolean;
    pageSizeControl: PageSizeControl;
}
/**
 * Transforms an input stream of data into a logical Ogg bitstream that is compliant with the
 * Ogg framing specification {@link https://www.xiph.org/ogg/doc/framing.html}
 */
export declare abstract class OggLogicalBitstream extends Transform {
    protected packets: Buffer[];
    protected lacingValues: number[];
    protected readonly bitstream = 1;
    protected granulePosition: number;
    protected pageSequence: number;
    protected options: LogicalBitstreamOptions;
    protected pageSizeController: (packet: Buffer, lacingValues: number[]) => boolean;
    constructor(options?: Partial<LogicalBitstreamOptions>);
    /**
     * Writes pages containing header data once the stream is created.
     *
     * @param pages The list of pages that should be written
     */
    protected writeHeaderPages(pages: Buffer[][]): void;
    _flush(callback: TransformCallback): void;
    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void;
    /**
     * Calculates a valid CRC32 checksum for an Ogg page
     *
     * @param buffer The data
     * @returns The checksum
     */
    protected calculateCRC(buffer: Buffer): number;
    /**
     * Calculates the granule position of a page in the logical bitstream given the new packets of the page.
     *
     * @param packets The packets in the new page
     */
    protected abstract calculateGranulePosition(packets: Buffer[]): number;
    /**
     * Attempts to buffer a data packet. If there is already too much data buffered, the existing data is first
     * flushed by collecting it into a page and pushing it.
     *
     * @param packet The data packet to write
     */
    protected writePacket(packet: Buffer): void;
    /**
     * Collects the buffered data packets into an Ogg page.
     *
     * @param final Whether this is the final page to be written
     * @param logicalHeader Whether this page contains only a header for a logical stream, to avoid
     * incrementing the granule position.
     */
    protected writePage(final?: boolean, logicalHeader?: boolean): void;
}
