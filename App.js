/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { NativeModules, StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';

var GJModule = NativeModules.GJM;
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      GENERATE: 'none',
      fcm: '',
      title: '',
      body: '',
      devToken: '',
      GENButton: 'Generate Notification',
    }
    this.Notification = this.Notification.bind(this);
    this.openNotification = this.openNotification.bind(this);
    this.updateFCM = this.updateFCM.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateBody = this.updateBody.bind(this);
    this.updateDevToken = this.updateDevToken.bind(this);
  }

  openNotification = () => {
    console.disableYellowBox = true;
    if (GJModule.notificationToken != ""){
      AsyncStorage.setItem("Token", GJModule.notificationToken)
      this.setState({ token: GJModule.notificationToken });
    }
    AsyncStorage.getItem("Token").then((value) => {
      this.setState({ token: value });
    })
    if (this.state.GENERATE === "none")
      this.setState({ GENERATE: "flex", GENButton: 'Hide Notification Generation' });
    else
      this.setState({ GENERATE: "none", GENButton: 'Generate Notification' });
    this.setState({ fcm: "", title: "", body: "", devtoken: "" });
  }

  updateFCM(input) {
    this.setState({ fcm: input });
  };

  updateTitle(input) {
    this.setState({ title: input });
  };

  updateBody(input) {
    this.setState({ body: input });
  };

  updateDevToken(input) {
    this.setState({ devToken: input });
  };

  Notification = async() => {
    if (this.state.fcm === "") {
      alert("PLEASE ENTER FCM SERVER KEY.")
    }
    else if (this.state.title === "") {
      alert("PLEASE ENTER NOTIFICATION TITLE.")
    }
    else if (this.state.body === "") {
      alert("PLEASE ENTER NOTIFICATION BODY.")
    }
    else if (this.state.devToken === "") {
      alert("PLEASE ENTER DEVICE TOKEN.")
    }
    else {
      try {
        let bodyFetch = {
          to: this.state.devToken,
          notification: {
            title: this.state.title,
            body: this.state.body
          },
          priority: "high"
        };

        let response = await fetch("https://fcm.googleapis.com/fcm/send", { 
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": "key=" + this.state.fcm
          },
          body: JSON.stringify(bodyFetch) });
        console.log(response);
        try{
          response = await response.json();
          if(!response.success){
            Alert.alert('Failed to send notification, check error log')
          }
        } catch (err){
          Alert.alert('Failed to send notification, check error log')
        }
      } catch (err) {
        Alert.alert(err && err.message)
      }
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native GJ FCM</Text>
        <Text style={styles.instructions}>To send the notification, click on the button below</Text>
        <Text style={styles.instructions}>Your application token is</Text>
        <TextInput
                  style={{ textAlign: 'center', color: 'skyblue', marginBottom: 5, marginLeft: 5, marginRight: 5}}
                  value={this.state.token}
                  multiline={true}
                  editable={true}
                /> 
        
        <TouchableOpacity onPress={() => { this.openNotification() }}>
          <Text> {this.state.GENButton} </Text>
        </TouchableOpacity>
        <View style={{ display: this.state.GENERATE }}>
          <View style={{ padding: 15, flexDirection: 'row' }}>
            <View>
              <Text style={{ padding: 15, fontWeight: 'bold', fontSize: 13, color: '#000' }}> FCM Token</Text>
              <Text style={{ padding: 15, paddingTop: 22.5, fontWeight: 'bold', fontSize: 13, color: '#000' }}> Notification Title</Text>
              <Text style={{ padding: 15, paddingTop: 22.5, fontWeight: 'bold', fontSize: 13, color: '#000' }}> Notification Body</Text>
              <Text style={{ padding: 15, paddingTop: 22.5, fontWeight: 'bold', fontSize: 13, color: '#000' }}> User Device Notification Token</Text>
            </View>
            <View>
              <View style={{ paddingLeft: 27, paddingTop: 7.5 }}>
                <TextInput
                  style={{ paddingLeft: 15, width: 150, height: 40, borderColor: 'gray', borderWidth: 1 }}
                  value={this.state.fcm}
                  onChangeText={(text) => this.updateFCM(text)}
                />
              </View>
              <View style={{ paddingLeft: 27, paddingTop: 15 }}>
                <TextInput
                  style={{ paddingLeft: 15, width: 150, height: 40, borderColor: 'gray', borderWidth: 1 }}
                  value={this.state.title}
                  onChangeText={(text) => this.updateTitle(text)}
                />
              </View>
              <View style={{ paddingLeft: 27, paddingTop: 15 }}>
                <TextInput
                  style={{ paddingLeft: 15, width: 150, height: 40, borderColor: 'gray', borderWidth: 1 }}
                  value={this.state.body}
                  onChangeText={(text) => this.updateBody(text)}
                />
              </View>
              <View style={{ paddingLeft: 27, paddingTop: 15 }}>
                <TextInput
                  style={{ paddingLeft: 15, width: 150, height: 40, borderColor: 'gray', borderWidth: 1 }}
                  value={this.state.devToken}
                  onChangeText={(text) => this.updateDevToken(text)}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={this.Notification}>
            <Text style={{ paddingTop: 15, textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: 'skyblue' }}> Generate </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
