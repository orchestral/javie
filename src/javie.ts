import Application from './application';
import Configuration from './configuration';
import Profiler from './profiler';

let Javie = new Application();

Javie.bind('config', (attributes: any = {}) => {
  return new Configuration(attributes);
});

Javie.bind('profiler', (name?: string) => {
  return name != null ? new Profiler(name) : Profiler;
});

export default Javie;
