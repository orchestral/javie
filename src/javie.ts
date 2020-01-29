import Application from './application';
import Configuration from './configuration';

let Javie = new Application();

Javie.bind('config', (attributes: any = {}) => {
  return new Configuration(attributes);
});

export default Javie;
