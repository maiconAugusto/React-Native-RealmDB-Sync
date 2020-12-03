/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {ObjectId} from 'bson';
import {getRealmApp} from '../database/instance';
import Realm from 'realm';
import {Dev} from '../database/schema';

const app = getRealmApp();

const App = () => {
  const [newUser, setNewUser] = useState('');
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    Login();
  }, []);

  useEffect(() => {
    if (newUser !== '') {
      GetData();
    }
  }, [newUser, data]);

  async function GetData() {
    const config = {
      sync: {
        user: newUser,
        partitionValue: 'realm_id',
      },
    };
    const realm = await Realm.open(config);
    const response = realm.objects('Dev');
    setData(response);
  }

  async function Login() {
    const creds = Realm.Credentials.anonymous();
    const _newUser = await app.logIn(creds);
    setNewUser(_newUser);
  }

  async function Save() {
    if (name !== '' && language !== '') {
      const _data = {
        _id: new ObjectId(),
        name: name,
        language: language,
      };

      const config = {
        schema: [Dev],
        sync: {
          user: newUser,
          partitionValue: 'realm_id',
        },
      };
      const realm = await Realm.open(config);

      realm.write(() => {
        realm.create('Dev', _data);
      });
      setName('');
      setLanguage('');
    }
  }

  async function remove(id) {
    const config = {
      sync: {
        user: newUser,
        partitionValue: 'realm_id',
      },
    };
    const realm = await Realm.open(config);
    const filter = realm.objects('Dev').snapshot();
    filter.forEach((item) => {
      if (String(item._id) === String(id)) {
        realm.write(() => {
          realm.delete(item);
        });
      }
    });
  }

  function renderOverlay() {
    return (
      <Overlay
        transparent
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}>
        <View style={style.containerOverlay}>
          <TextInput
            value={name}
            onChangeText={(value) => setName(value)}
            placeholder="Nome"
            placeholderTextColor="#484848"
            underlineColorAndroid="#484848"
            style={style.input}
            maxLength={20}
          />
          <TextInput
            value={language}
            onChangeText={(value) => setLanguage(value)}
            placeholder="Linguagem"
            placeholderTextColor="#484848"
            underlineColorAndroid="#484848"
            style={style.input}
            maxLength={20}
          />
          <TouchableOpacity
            onPress={() => {
              Save();
              setVisible(false);
            }}
            style={style.button}>
            <Text style={style.textButton}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  return (
    <View style={style.container}>
      {renderOverlay()}
      <View style={{display: 'flex', flex: 1}}>
        <FlatList
          style={{marginTop: 30}}
          data={data}
          extraData={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View key={item._id} style={style.containerItem}>
                <View>
                  <Icon
                    color="#484848"
                    size={30}
                    containerStyle={{marginLeft: 10}}
                    name="person"
                  />
                </View>
                <View style={style.column}>
                  <Text style={style.textItem}>Nome: {item.name}</Text>
                  <Text style={style.textItem}>Linguagem: {item.language}</Text>
                </View>
                <View>
                  <Icon
                    onPress={() => remove(item._id)}
                    color="#FF5E61"
                    size={30}
                    containerStyle={{marginRight: 10}}
                    name="delete"
                  />
                </View>
              </View>
            );
          }}
        />
        <Icon
          containerStyle={{position: 'absolute', bottom: 30, right: 10}}
          size={36}
          raised
          reverse
          name="person-add"
          color="#00B894"
          onPress={() => setVisible(true)}
        />
      </View>
    </View>
  );
};
export default App;
const style = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#978FF2',
  },
  containerItem: {
    flexDirection: 'row',
    height: 76,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textItem: {
    marginLeft: 10,
    marginBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#484848',
  },
  button: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B894',
    marginTop: 40,
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 0.5,
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  column: {
    flexDirection: 'column',
    marginLeft: 10,
    width: '70%',
  },
  input: {
    height: 50,
    width: '100%',
    marginTop: 20,
  },
  containerOverlay: {
    height: '70%',
    width: 350,
    justifyContent: 'center',
    display: 'flex',
  },
});
