import Application from './application';
import Configuration from './configuration';

let app = new Application();

app.bind('config', (attributes: any = {}) => {
  return new Configuration(attributes);
});

export default app;
