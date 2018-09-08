import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Version can be specified in package.json
import { TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json
//import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

class MedicationsScreen extends React.Component {
  render() {
    return (
    <View>
      <View style={styles.headerviewStyle}>
	<Text style={styles.headertextStyle}>Medications</Text>
      </View>
      	<FlatList
          data={[
            {key: 'Add Medication: '},
          ]}
          renderItem={({item}) => <Text style={styles.itemStyle}>{item.key}</Text>}
        />
    </View>      
    );
  }
}

const styles = StyleSheet.create({
  headerviewStyle: {
		backgroundColor: '#0080ff',
		justifyContent: 'center',
		alignItems: 'center',
		height: 70,
		paddingTop: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		elevation: 5,
		position: 'relative'
	},
  headertextStyle: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold'
  },
  itemStyle: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  cardStyle: {
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 5,
		marginRight: 5,
		marginTop: 10
  }
})
class Card extends React.Component {
}
class CameraScreen extends React.Component {
  render() {
    return (
      <View style={styles.headerviewStyle}>
	<Text style={styles.headertextStyle}>Camera</Text>
      </View>
    );
  }
}

export default TabNavigator(
  {
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
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
);
