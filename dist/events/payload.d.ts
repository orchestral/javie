export default class Payload {
    private name;
    private callback;
    constructor(id: string, callback: any);
    id(): string;
    resolver(): any;
}
