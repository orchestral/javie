export default class Application {
    private config;
    private environment;
    private instances;
    constructor(environment?: string);
    detectEnvironment(environment: any): string;
    env(): string;
    get(key: string, defaults?: any): any;
    put(key: string, value: any): Application;
    on(name: string, callback: any): Application;
    emit(name: string, options?: any): Application;
    bind(name: string, instance: any): Application;
    singleton(name: string, instance: any): Application;
    make(name: string): any;
    when(environment: string, callback: any): any;
    run(callback: any): any;
}
//# sourceMappingURL=application.d.ts.map