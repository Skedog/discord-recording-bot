"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OggLogicalBitstream = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const stream_1 = require("stream");
/**
 * Serialises a HeaderTypeFlag
 */
function serialiseHeaderTypeFlag(flags) {
    return (flags.continuedPacket ? 0x01 : 0) + (flags.firstPage ? 0x02 : 0) + (flags.lastPage ? 0x04 : 0);
}
/**
 * Creates valid Ogg lacing values for a given Buffer.
 *
 * @param buffer The buffer to create lacing values for
 * @returns The lacing values
 */
function createLacingValues(buffer) {
    const lacingValues = [];
    let i = buffer.length;
    while (i >= 255) {
        lacingValues.push(255);
        i -= 255;
    }
    lacingValues.push(i);
    return lacingValues;
}
const OggS = Buffer.from('OggS');
// Lazy loaded from node-crc
let crc;
/**
 * Transforms an input stream of data into a logical Ogg bitstream that is compliant with the
 * Ogg framing specification {@link https://www.xiph.org/ogg/doc/framing.html}
 */
class OggLogicalBitstream extends stream_1.Transform {
    constructor(options) {
        super({ writableObjectMode: true, ...options });
        this.bitstream = 1;
        this.granulePosition = 0;
        this.pageSequence = 0;
        this.options = {
            crc: true,
            pageSizeControl: { maxSegments: 255 },
            ...options,
        };
        this.packets = [];
        this.lacingValues = [];
        if (this.options.crc) {
            crc = require('node-crc').crc;
        }
        else {
            this.calculateCRC = () => 0;
        }
        if (Reflect.has(this.options.pageSizeControl, 'maxSegments')) {
            const { maxSegments } = this.options.pageSizeControl;
            this.pageSizeController = (packet, lacingValues) => lacingValues.length + this.lacingValues.length > maxSegments;
        }
        else {
            const { maxPackets } = this.options.pageSizeControl;
            this.pageSizeController = () => this.packets.length + 1 > maxPackets;
        }
    }
    /**
     * Writes pages containing header data once the stream is created.
     *
     * @param pages The list of pages that should be written
     */
    writeHeaderPages(pages) {
        for (const page of pages) {
            for (const packet of page) {
                this.writePacket(packet); // this assumes that writePacket will NOT call writePage
            }
            this.writePage(false, true);
        }
    }
    _flush(callback) {
        this.writePage(true);
        callback();
    }
    _transform(chunk, encoding, callback) {
        this.writePacket(chunk);
        callback();
    }
    /**
     * Calculates a valid CRC32 checksum for an Ogg page
     *
     * @param buffer The data
     * @returns The checksum
     */
    calculateCRC(buffer) {
        const value = crc(32, false, 0x04c11db7, 0, 0, 0, 0, 0, buffer);
        if (typeof value === 'boolean') {
            throw new Error('Failed to compute CRC for buffer');
        }
        return value.readUInt32BE(0);
    }
    /**
     * Attempts to buffer a data packet. If there is already too much data buffered, the existing data is first
     * flushed by collecting it into a page and pushing it.
     *
     * @param packet The data packet to write
     */
    writePacket(packet) {
        const lacingValues = createLacingValues(packet);
        if (lacingValues.length > 255) {
            throw new Error('OggLogicalBitstream does not support continued pages');
        }
        if (this.pageSizeController(packet, lacingValues) || lacingValues.length + this.lacingValues.length > 255) {
            this.writePage();
        }
        this.packets.push(packet);
        this.lacingValues.push(...lacingValues);
    }
    /**
     * Collects the buffered data packets into an Ogg page.
     *
     * @param final Whether this is the final page to be written
     * @param logicalHeader Whether this page contains only a header for a logical stream, to avoid
     * incrementing the granule position.
     */
    writePage(final = false, logicalHeader = false) {
        const header = Buffer.allocUnsafe(27);
        if (!logicalHeader) {
            this.granulePosition = this.calculateGranulePosition(this.packets);
        }
        // capture_pattern
        OggS.copy(header, 0, 0);
        // stream_structure_version
        header.writeUInt8(0, 4);
        // header_type_flag
        header.writeUInt8(serialiseHeaderTypeFlag({
            continuedPacket: false,
            firstPage: this.pageSequence === 0,
            lastPage: final,
        }), 5);
        // absolute granule position
        header.writeUInt32LE(this.granulePosition, 6);
        header.writeUInt32LE(0, 10);
        // stream serial number
        header.writeUInt32LE(this.bitstream, 14);
        // page sequence no
        header.writeUInt32LE(this.pageSequence++, 18);
        // page checksum - initially 0
        header.writeUInt32LE(0, 22);
        // page_segments
        header.writeUInt8(this.lacingValues.length, 26);
        const page = Buffer.concat([header, Buffer.from(this.lacingValues), ...this.packets]);
        // page checksum - calculate CRC checksum
        page.writeUInt32LE(this.calculateCRC(page), 22);
        // reset the buffered packets and their associated lacingValues
        this.packets = [];
        this.lacingValues = [];
        this.push(page);
    }
}
exports.OggLogicalBitstream = OggLogicalBitstream;
//# sourceMappingURL=OggLogicalBitstream.js.map