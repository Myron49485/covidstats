import React, {useState, useEffect} from 'react';
import {Container, Header, Content, Card, CardItem, Body} from 'native-base';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
  View,
  FlatList,
  ToastAndroid,
} from 'react-native';

const App: () => React$Node = () => {
  const [originalData, setOriginalData] = useState([]);
  const [datasource, setDatasource] = useState([]);
  let [country, setCountry] = useState('');

  useEffect(() => {
    fetch('https://covid-api.mmediagroup.fr/v1/cases?country=US')
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        const objArray = [];
        Object.keys(myJson).forEach((key) =>
          objArray.push({
            state: key,
            stats: myJson[key],
          }),
        );
        if (myJson.message === 'Too Many Requests') {
          ToastAndroid.showWithGravityAndOffset(
            'Too Many Requests; try again later',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          const country = 'Country: ' + objArray[0].stats.country;
          setOriginalData(objArray);
          setDatasource(objArray);
          ToastAndroid.showWithGravityAndOffset(
            country,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
        console.log(objArray);
      });
  }, []);

  return (
    <Container>
      <Content>
        <Header style={styles.header}>
          <Text style={styles.headerText}>Covid-19 Stats</Text>
        </Header>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.inputCountry}
            onChangeText={(text) => setCountry(text)}
            placeholder={'US'}
          />
          <TouchableHighlight
            style={styles.button}
            underlayColor="#DDDDDD"
            onPress={() => {
              if (country.length === 0) {
                country = 'US';
              }
              fetch(
                'https://covid-api.mmediagroup.fr/v1/cases?country=' + country,
              )
                .then((response) => {
                  return response.json();
                })
                .then((myJson) => {
                  const objArray = [];
                  Object.keys(myJson).forEach((key) =>
                    objArray.push({
                      state: key,
                      stats: myJson[key],
                    }),
                  );
                  if (objArray[0].state === 'Afghanistan') {
                    ToastAndroid.showWithGravityAndOffset(
                      'Country not found',
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                  } else if (myJson.message === 'Too Many Requests') {
                    ToastAndroid.showWithGravityAndOffset(
                      'Too Many Requests; try again later',
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                  } else {
                    const country = 'Country: ' + objArray[0].stats.country;
                    setOriginalData(objArray);
                    setDatasource(objArray);
                    ToastAndroid.showWithGravityAndOffset(
                      country,
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                  }
                  console.log(objArray);
                });
            }}>
            <Text style={styles.buttonText}>Search Country</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.filterBox}>
          <Text>Filter by state: </Text>
          <TextInput
            style={styles.inputFilter}
            onChangeText={(text) => {
              const newArr = [];
              for (let i = 0; i < originalData.length; i++) {
                if (originalData[i].state.startsWith(text)) {
                  newArr.push(originalData[i]);
                }
              }
              setDatasource(newArr);
            }}
            placeholder={'No filter'}
          />
        </View>
        <FlatList data={datasource} renderItem={renderItem} />
      </Content>
    </Container>
  );
};

const renderItem = ({item}) => {
  return (
    <Card style={styles.card}>
      <CardItem>
        <Body style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.state}</Text>
          <Text>{'Confirmed: ' + item.stats.confirmed}</Text>
          <Text>{'Deaths: ' + item.stats.deaths}</Text>
        </Body>
      </CardItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  filterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputCountry: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 8,
    flex: 4,
    height: 40,
    marginRight: 8,
  },
  inputFilter: {
    flex: 4,
    height: 40,
    marginRight: 10,
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'yellowgreen',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 4,
    marginRight: 4,
  },
  card: {
    marginLeft: 10,
    marginRight: 10,
  },
  cardBody: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  favourite: {
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 18,
  },
});

export default App;
