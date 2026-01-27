import { Web } from './web';

export interface Rss extends Omit<Web, 'id' | 'type' | 'typeId' | 'rss'> {
    type: string
}