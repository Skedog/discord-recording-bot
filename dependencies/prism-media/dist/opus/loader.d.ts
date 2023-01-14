import { OpusEncoder, OpusEncoderOptions } from './adapters/OpusEncoder';
declare const LOADERS: [string, (options: OpusEncoderOptions) => OpusEncoder][];
export declare function loadOpusLibrary(extraLoaders?: typeof LOADERS, forceRefresh?: boolean): (options: OpusEncoderOptions) => OpusEncoder;
export declare function createOpusEncoder(options: OpusEncoderOptions, extraLoaders?: typeof LOADERS, forceRefresh?: boolean): OpusEncoder;
export {};
