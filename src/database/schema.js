export class Dev {
  static schema = {
    name: 'Dev',
    properties: {
      _id: 'objectId',
      name: 'string',
      language: 'string',
    },
    primaryKey: '_id',
  };
}
