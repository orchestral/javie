import { microtime } from './helpers';

export default class Entry {
  public id: string;
  public type: string;
  public start: number|null = null;
  public end: number|null = null;
  public total: any = null;
  public message: string = '';

  constructor(id: string, type: string, start: number|null = null) {
    if (start == null) {
      start = microtime();
    }
    
    this.id = id;
    this.type = type;
    this.start = start;
  }
}
