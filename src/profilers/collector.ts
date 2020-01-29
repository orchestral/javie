import Entry from './entry';
import { microtime } from './helpers';

export default class Collector {
  private name: string;
  private logging: boolean;
  private entries: any = [];
  private pair: any = {};
  private started: number;

  constructor(name: string, logging: boolean) {
    this.name = name;
    this.logging = logging;
    this.started = microtime();
  }

  id(): string {
    return this.name;
  }

  time(id: string, message: string) {
    if (!this.logging) {
      return null;
    }

    if (id == null) {
      id = this.entries.length;
    }

    let entry = new Entry(id, 'time');
    entry.message = message.toString();

    let key = this.pair[`time${id}`];

    if (typeof key != 'undefined') {
      this.entries[key] = entry;
    } else {
      this.entries.push(entry);
      this.pair[`time${id}`] = (this.entries.length - 1);
    }

    console.time(id);

    return id;
  }

  timeEnd(id: string, message: string) {
    let entry = null;

    if (!this.logging) {
      return null;
    }

    if (id == null) {
      id = this.entries.length;
    }

    let key = this.pair[`time${id}`];

    if (typeof key != 'undefined') {
      console.timeEnd(id);
      entry = this.entries[key];
    } else {
      entry = new Entry(id, 'time', this.started);

      if (typeof message != 'undefined') {
        entry.message = message;
      }

      this.entries.push(entry)
      key = (this.entries.length - 1)
    }

    let end = entry.end = microtime();
    let start = entry.start;
    let total = end - start;
    entry.total = total;
    this.entries[key] = entry;

    return total
  }

  trace() {
    if (this.logging) {
      console.trace();
    }
  }

  logs(): any {
    return this.entries;
  }

  enable(): void {
    this.logging = true;
  }

  disable(): void {
    this.logging = false;
  }
}