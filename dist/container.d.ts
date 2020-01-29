export default class Container {
    private name;
    private instance;
    private _shared;
    private _resolved;
    constructor(name: string, instance: any, shared?: boolean, resolved?: boolean);
    resolving(options?: any): any;
    resolved(): boolean;
    shared(): boolean;
}
