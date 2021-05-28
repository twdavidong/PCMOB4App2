import firebase from "../database/firebaseDB";

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

//import firebase from "../database/firebase";


const db = firebase.firestore().collection("todo");


export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = db.orderBy("created").onSnapshot((collection) => {
      const updatedNotes = collection.docs.map((doc) => { 
        const noteObject = {
          ...doc.data(),
          id: doc.id,
          };
          console.log(noteObject);
          return noteObject
        });
        setNotes(updatedNotes);
     });  

    return unsubscribe;
  }, []);

/*
  firebase.firestore().collection("testing").add({
    title:"Testing! Does this work???",
    body:"This is to check the Integration is working",
    potato: true,
    question:"Why is there a potato bool here",
  });
*/

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color="black"
            style={{
              color: "#ffd9b3",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  // Monitor route.params for changes and add items to the database
  useEffect(() => {
    if (route.params?.text) {
      const newNote = {
        title: route.params.text,
        done: false,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.add(newNote);
    }
  }, [route.params?.text]);

  function addNote() {
    navigation.navigate("Add Screen");
  }

  // This deletes an individual note
  function deleteNote(id) {
    console.log("Deleting " + id);
    db.doc(id).delete();
    // To delete that item, we filter out the item we don't want
    setNotes(notes.filter((item) => item.id !== id));
    }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <View
          style={{
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
      >
        <Text>{item.title}</Text>
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Ionicons name="trash" size={16} color="#944" />
        </TouchableOpacity>
      </View>
    );
  }
  const image = { uri: "../assets/image.jpg" };

  return (
    <View style={styles.container}>
  <ImageBackground source={require('../assets/image.jpg')} style={styles.image}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
      /></ImageBackground>
 </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  backgroundColor: "#33ff99",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
});
