export interface Record {
    id?: number,
    content: string,
    images: string | string[],
    createTime?: string | Dayjs;
}