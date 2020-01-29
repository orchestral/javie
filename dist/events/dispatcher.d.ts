import Payload from './payload';
export default class Dispatcher {
    clone(id: string): any;
    listen(id: string, callback: any): Payload;
    emit(id: string, options?: any): any;
    first(id: string, options: any): any;
    until(id: string, options: any): any;
    flush(id: string): void;
    forget(payload: Payload): void;
    dispatch(queued: any, options?: any, halt?: boolean): any;
}
