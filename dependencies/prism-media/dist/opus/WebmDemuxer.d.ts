/// <reference types="node" />
import { WebmBaseDemuxer } from '../webm/WebmBaseDemuxer';
export declare class WebmDemuxer extends WebmBaseDemuxer {
    protected _checkHead(data: Buffer): Error | undefined;
}
