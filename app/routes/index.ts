import v1 from './v1/index';

export default (app: any) => {
  app.use('/api/v1', v1);
};
