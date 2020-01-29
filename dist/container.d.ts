export default class Container {
    private name;
    private instance;
    private isShared;
    private isResolved;
    constructor(name: string, instance: any, shared?: boolean, resolved?: boolean);
    alias(): string;
    resolving(options?: any): any;
    resolved(): boolean;
    shared(): boolean;
}
