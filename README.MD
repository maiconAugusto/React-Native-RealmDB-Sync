### React Native RealmDB Sync

- Clone o repositório
- Acesse o projeto, na raiz do projeto  rode o comando yarn ou npm install.
- Se você não tem um conta no MONGO ATLAS crie uma.
- Leia a documentação do MongoDB para configurar seus SCHEMAS e habilitar o ReamSync
`<link>` : https://docs.mongodb.com/realm/sync/get-started#std-label-enable-sync



#### Javascript
-  Depois de ter configurado o MONGO ATLAS, copie seu appId  e procure em src/database/instance.js

```javascript
import Realm from 'realm';

export function getRealmApp() {
  const appId = '<Seu APPID>';  // Insira seu appId do RealmDB    < -------
  const appConfig = {
    id: appId,
    timeout: 10000,
  };
  return new Realm.App(appConfig);
}
```
#### Run
 Se tudo deu certo até aqui, é só rodar o comando npx react-native run-android para o ANDROID, ou react-native run-ios para o IOs.