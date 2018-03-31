// tslint:disable-next-line:no-any
export const ensureError = (err: any): Error => {
  if (err instanceof Error) {
    return err;
  }
  if (typeof err === 'string') {
    return new Error(err);
  }

  return new Error('Unknown error');
};
