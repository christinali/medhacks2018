import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Alert, Button, AsyncStorage, StatusBar, KeyboardAvoidingView, Keyboard, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Camera, Permissions } from 'expo';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { Card, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; // Version can be specified in package.json
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

//mport base64 from 'base-64';

const cloudVisionKey = 'AIzaSyAVqD0PDgXcYT2riE8wo4fNMwsX9wKPTDI';
const cloudVision  = 'https://vision.googleapis.com/v1/images:annotate?key=' + cloudVisionKey;

const users = [
 {
    name: 'Acetaminophen',
    avatar: 'https://i.imgur.com/C3EnFOq.png'
 },
  {
    name: 'Lisinopril',
    avatar: 'https://i.imgur.com/cjjkJNL.png'
 },
  {
    name: 'Azithromycin',
    avatar: 'https://i.imgur.com/NfcdsLl.png'
 },
];
const addDrug = [
  {
    name:'Add Medication:',
    avatar: 'http://pngimg.com/uploads/plus/plus_PNG116.png' 
  }
];

function myFunc(size, sizeword, medication) {
  console.log("made it here");
  try{
            const accountSid = 'ACd170786528d6c198e654050f2cd7145d';
              const authToken = '48ecc397e00188e82bbb6e3b05aef061';
              const base64 = require('base-64');
            console.log(sizeword);
            console.log(medication);

            var msg = "Good morning! This is your 8:00am reminder to take " +size +" " + sizeword + " of " + medication + " -- reply 'yes' when you've taken your medication";
            var details = {
                'Body': msg,
                'To': '14129998417',
                'From': '14053539635'
            };

            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

              // TODO: make ajax request to post a response to Twilio API
              fetch('https://api.twilio.com/2010-04-01/Accounts/ACd170786528d6c198e654050f2cd7145d/Messages.json', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': "Basic " + base64.encode(accountSid+":"+authToken)
              },
              body: formBody
            }).then((response) => response.json())
              .then((responseJson) => {
                console.log("successfully getting back json body", responseJson);
              })
              .catch((error) => {
                console.error("error getting back json body", error);
              });
  }
  catch (e) {
    console.error(e.message);
  }
}


class SplashScreen extends React.Component {
    constructor(props) {
    super(props);
    this.state = { number: '' };
  }
  
  componentDidMount () {
    
  }
  componentWillUnmount () {

  }

/*
  _submit() {
      Keyboard.dismiss();
    }
*/
  

  render() {

    return(
      
      <View style={styles.baby}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.description}>
            Welcome to Pocket Pills
          </Text>
        </View>

        <View style = {styles.pillimage}>
        <Image style={styles.stretch} source={require('image.png')} />
        </View>

        <KeyboardAvoidingView behavior="padding" style={styles.form}>
        
          <TextInput
            style={styles.input}
            value={this.state.number}
            onChangeText={number => this.setState({number})}
            ref={ref => {this._numberInput = ref}}
            placeholder="Enter your phone number"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            returnKeyType="send"
            //onEndEditing={this._submit}
            blurOnSubmit={true}
          />
          <View style={styles.buttonBorder}>
            <TouchableOpacity style={styles.button}>
              <Button title="Let's Get Started!"  color="#336699" 
              onPress={ () => {
                Keyboard.dismiss();
                this.props.navigation.navigate('Medications');
              }}
              />
            </TouchableOpacity>
            <Text style={styles.legal}>
              We will text to remind you when it's time to take your pills!
            </Text>
            
          </View>
          </KeyboardAvoidingView>
      </View>
    );
    }

// store key locally using AsyncStorage
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('userNumber', this.state.number);
      } catch (error) {
        console.log("error saving number");
        }
    }
}

class MedicationsScreen extends React.Component {
  render() {
    return (
    <View>
      <View style={styles.headerviewStyle}>
	      <Text style={styles.headertextStyle}>Medications</Text>
      </View>
    <Card containerStyle={{padding: 0}} >
    {
      users.map((u, i) => {
        return (
          <ListItem
            key={i}
            roundAvatar
            title={u.name}
            avatar={{uri:u.avatar}}
          />
        );
      })
  }
</Card>
<Card containerStyle={{padding: 0}} >
    {
      addDrug.map((u, i) => {
        return (
          
          <ListItem
            onPress={() => this.props.navigation.navigate('Camera')}
            key={i}
            roundAvatar
            title={u.name}
            avatar={{uri:u.avatar}}
          />
        );
      })
  }
</Card>
    </View>      
    );
  }
}

class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captureText: null,
      showLoader: false,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back
    };
    this.toggleLoader = this.toggleLoader.bind(this);
    this.showAlert = this.showAlert.bind(this);
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    })
  }

  toggleLoader() {
    this.setState({
      showLoader: !this.state.showLoader
    })
  }

  showAlert(title, message) {
    this.toggleLoader();
    setTimeout(()=>{
      Alert.alert(
        title,
        message,
        [
          {text: 'Dismiss', onPress: () => console.log('OK Pressed')},
        ]
      )
    }, 100);
  }

  _takeImage(){
    if (this.camera) {
      let _this = this;
      this.toggleLoader();
      this.camera.takePictureAsync({base64:true}).then((data)=>{
        axios.post(cloudVision, {
          "requests":[{
            "image": {
              "content": data.base64
            },
            "features":[{
              "type": "TEXT_DETECTION",
              "maxResults": 1
            }]
          }]
        }).then(function(response) {
          if (response.data.responses[0].textAnnotations == undefined) {
            _this.showAlert("Notice", "There is no character on image or you need to take photo more clearly");
          } else {
            let textAnnotations  = response.data.responses[0].textAnnotations[0];
            let textContent = textAnnotations.description;
            
            // this is running Nico's code
            var str = textContent.toLowerCase();
             console.log(str);

              var words = str.split(/\n|" "/);
              console.log(words);
              var words2 = [];
              for (let item of words) {
                for (let item2 of item.split(" ")) {
                  words2.push(item2);
                }
              }
              console.log(words2);

              words = words2;

              var size = "NA";
              var temp = -1;


              var sizeloc =words.indexOf("take") + 1;
              size = words[sizeloc];

              var sizewordloc = sizeloc + 1;
              var sizeword = words[sizewordloc];

              // size AND size word are stored


              // find our medication name from list
              var medicinelist = ["hydrocodone", "acetaminophen", "lisinopril", "synthroid", "azithromycin", "amoxicillin", "metformin","hydrochlorothiazide"]

              temp =-1;
              var count=0;
              while(temp==-1){
                if(count==medicinelist.length){
                  console.log("couldn't find the medication");
                  break
                }
                temp = words.indexOf(medicinelist[count]);
                count++;
              }
              var medication = words[temp];
              // medication name is stored!!


              //let's find frequency
              var dict = {"twice a day":0.5, "twice daily":0.5, "every day":1, "a day":1, "per day":1, "daily":1, "once a day":1,  "every other day":2, "every two days":2};

              temp =-1;
              count=0;
              while(temp==-1){
                if(count==Object.keys(dict).length){
                  console.log("couldn't find the frequency");
                  break
                }
                temp = str.indexOf(Object.keys(dict)[count]);
                //console.log(temp);
                count++;
              }
              var freq = dict[Object.keys(dict)[count-1]];

              //frequency is now included
              var numdayloc = words.indexOf("for", sizewordloc)+1;
              var numdays = parseInt(words[numdayloc]);

              if(words[numdayloc+1]=="week" || words[numdayloc+1]=="weeks"){
                numdays = numdays *7;
              }
              if(words[numdayloc+1]=="month" || words[numdayloc+1]=="months"){
                numdays = numdays *30;
              }

              if(words[numdayloc+1]!="day"&&words[numdayloc+1]!="days"&&words[numdayloc+1]!="week"&&words[numdayloc+1]!="weeks"&&words[numdayloc+1]!="month"&&words[numdayloc+1]!="months"){
                console.log("Cannot determine length of medication use");
                numdays =0;
              }

              var summary = "You will be taking " + size + " " + sizeword + " of " + medication.toUpperCase() + " every " + (freq* 24) + " hours for " + numdays + " days" ;
              var variables = [size, sizeword, medication, (freq*24), numdays];

              myFunc(size, sizeword, medication.toUpperCase());

              _this.showAlert("Success", summary);

              // TODO: try catch block
              
              

                // var msg = "Good morning! This is your 8:00am reminder to take " +size +" " + sizeword + " of " + medication + ". Have a great day!";

                // var phonenumber = '4059232627'; //THIS IS THE USER INPUTTED PHONE NUMBER


                // const accountSid = 'ACd170786528d6c198e654050f2cd7145d';
                // const authToken = '48ecc397e00188e82bbb6e3b05aef061';
                // const client = require('twilio')(accountSid, authToken);
                // client.messages
                // .create({
                //     body: msg,
                //     from: '+14053539635',
                //     to: '+1' + phonenumber
                //   })
                // .then(message => console.log(message.sid))
                // .done();

          }
        }).catch(function (error) {
          _this.showAlert("Error", "Error occured!. It's related with OCR or Network connection problem. Please check and try it again");
        });
      })
      .catch(err => console.error(err));
    }
  }

  render() {
    const { hasCameraPermission, showLoader } = this.state;
    if (hasCameraPermission === null) {
      return <View/>
    } else if (hasCameraPermission === false) {
      return <Text>No access to Camera</Text>
    } else {
      return (
        <View style={styles.container}>
         
          <Camera 
            ref={ref => {
              this.camera = ref;
            }} style={styles.camera} type={this.state.type}>
             <Spinner visible={showLoader}/>
            <View style={styles.bottom}>
              <TouchableOpacity onPress={this._takeImage.bind(this)}>
                <Image source={require('./image/take.png')}  style={styles.take}/>
              </TouchableOpacity>
              <View style={styles.rebase}>
                <TouchableOpacity onPress={()=>{
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                  <Image source={require('./image/cycle.png')} style={styles.rebaseImage}/>
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

export default TabNavigator(
  {
    Help: {screen: SplashScreen},
    Medications: { screen: MedicationsScreen },
    Camera: { screen: CameraScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Medications') {
          iconName = `ios-medical${focused ? '' : '-outline'}`;
        } else if (routeName === 'Camera') {
          iconName = `ios-camera${focused ? '' : '-outline'}`;
        } else if (routeName === 'Help'){
          iconName = `ios-constructor${focused ? '' : '-outline'}`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#336699',
      inactiveTintColor: 'gray',
    },
    animationEnabled: true,
    swipeEnabled: true,
  }
);

const styles = StyleSheet.create({
  pillimage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stretch: {
    width: 100,
    height: 100
  },
  buttonBorder: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 10
  },
  button: {
    borderRadius: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 10 ,
    shadowOffset : { width: 0.5, height: 13},
  },
  baby: {
    flex: 1,
    backgroundColor: '#ecf0f1'
  },
  header: {
    paddingTop: 100,
    padding: 20,
    backgroundColor: '#336699',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center'
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  legal: {
    paddingTop: 5,
    margin: 10,
    color: '#696969',
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 10
  },
  headerviewStyle: {
		backgroundColor: '#336699',
		justifyContent: 'center',
		alignItems: 'center',
		height: 70,
		paddingTop: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		elevation: 5,
		position: 'relative'
	},
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  bottom: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  take: {
    width:80,
    height: 80,
  },
  rebase: {
    position: 'absolute',
    right: 10
    // marginRight: 10,
  },
  rebaseImage: {
    width: 40,
    resizeMode: 'contain'
  },
  headertextStyle: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold'
  },
  headerContentStyle: {
		flexDirection: 'row',
		justifyContent: 'stretch',
	},
	headerTextStyle: {
		fontSize: 18,
    color: 'grey'
	},
  cardStyle: {	borderBottomWidth: 1,
          padding: 5,
          backgroundColor: '#fff',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          borderColor: '#ddd',
          position: 'relative',
          borderRadius: 5},
});
