import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import * as SQLite from'expo-sqlite';

const db = SQLite.openDatabase('shoplistdb.db');

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [shoplists, setShoplists] = useState([]);


  

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoplist;', [], (_, { rows }) =>
        setShoplists(rows._array)
      );
    }, null, null);
  }


  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoplist (product, amount) values (?, ?);',
        [product, amount]);
      }, null, updateList)
    }

    const deleteItem = (id) => {
      db.transaction(
        tx => {
          tx.executeSql(`delete from shoplist where id = ?;`, [id]);
        }, null, updateList
      )    
    }


  

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoplist (id integer primary key not null, product text, amount text);');
      }, null, updateList);
    }, []);


    const listSeparator = () => {
      return (
        <View
          style={{
            height: 5,
            width: "80%",
            backgroundColor: "#fff",
            marginLeft: "10%"
          }}
        />
      );
    };

  return (
    
    <View style={styles.container}>
      <TextInput
      style= {{borderColor: 'gray', borderWidth: 1, width: 200}}
                  onChangeText={(product) => setProduct(product)}
                  placeholder={'Product'}
                  value={product}
                />
     <TextInput
      style= {{borderColor: 'gray', borderWidth: 1, width: 200}}
                  onChangeText={(amount) => setAmount(amount)}
                  placeholder={'Amount'}
                  value={amount}
                />

    <View style={styles.fixToText}>
      <Button
      title="SAVE"
      onPress={saveItem}
      ></Button>
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      
    </View>
    <View style={styles.flatStyle}>
    <FlatList   
    style={{marginLeft : "5%"}}
    keyExtractor={item => item.id.toString()}
    renderItem={({item}) =>
    <View style={styles.listcontainer}>
    <Text>{item.product},{item.amount} </Text>
    <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
    </View>}
  data={shoplists}
  ItemSeparatorComponent={listSeparator}
  /> 
  </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  fixToText: {
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 200,
    height: 30,
  },
  flatStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: 80,
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
