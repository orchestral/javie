export default class Collector {
    private name;
    private logging;
    private entries;
    private pair;
    private started;
    constructor(name: string, logging: boolean);
    id(): string;
    time(id: string, message: string): string | null;
    timeEnd(id: string, message: string): number | null;
    trace(): void;
    logs(): any;
    enable(): void;
    disable(): void;
}
