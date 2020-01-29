export default class Entry {
    id: string;
    type: string;
    start: number | null;
    end: number | null;
    total: any;
    message: string;
    constructor(id: string, type: string, start?: number | null);
}
