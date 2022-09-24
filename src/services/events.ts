// const EventEmitter = require('events');
import {EventEmitter} from 'events';

class CustmoEmitter extends EventEmitter {}
const emitter = new CustmoEmitter();

class EventUnit {
  private event: string;
  private fn: any;
  private emitter: CustmoEmitter;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(event: string, fn: any, emitter: CustmoEmitter) {
    this.event = event;
    this.fn = fn;
    this.emitter = emitter;
  }

  off() {
    this.emitter.off(this.event, this.fn);
  }

  emit(params: any = null) {
    this.emitter.emit(this.event, params);
  }
}

export default class EventBase {
  protected event: string;
  protected emitter: CustmoEmitter;

  constructor(event: string, customEmitter?: EventEmitter) {
    this.event = event;
    this.emitter = customEmitter ? customEmitter : emitter;
  }

  protected createEventUnit(fn: any): EventUnit {
    return new EventUnit(this.event, fn, emitter);
  }

  on(callback: (params?: any) => void): EventUnit {
    this.emitter.on(this.event, callback);
    return this.createEventUnit(callback);
  }

  emit(params: any = null) {
    this.emitter.emit(this.event, params);
  }
}

export {EventUnit};
