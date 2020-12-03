import Realm from 'realm';

export function getRealmApp() {
  const appId = 'app-ercpq'; // Insira seu appId do RealmDB;
  const appConfig = {
    id: appId,
    timeout: 10000,
  };
  return new Realm.App(appConfig);
}
