export default class Profiler {
    constructor(name: string);
    static make(name?: string): any;
    static enable(): void;
    static disable(): void;
}
