/// <reference types="node" />
import { TransformOptions } from 'stream';
import { WebmBaseDemuxer } from './WebmBaseDemuxer';
export declare class WebmVorbisDemuxer extends WebmBaseDemuxer {
    protected _checkHead(data: Buffer): Error | undefined;
}
export declare function createWebmVorbisDemuxer(options?: TransformOptions): WebmVorbisDemuxer;
