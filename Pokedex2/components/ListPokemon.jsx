
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, SafeAreaView,StyleSheet,Button,ScrollView,TouchableOpacity } from 'react-native';

const ListPokemon = () => {
  const [pokemos, setPokemon] = useState([]);
  const [newPokemos,setNewPokemos] = useState([]);
  const [next,setNext] = useState('');
  const [previous,setPrevious] = useState('');
  const [isLoadingMore,setIsLoadingMore] = useState(false);
  const [url,setUrl] = useState('https://pokeapi.co/api/v2/pokemon');
  const urlTypes = 'https://pokeapi.co/api/v2/type';
  const [tipos,setTipos] = useState([]);
  const [selectType, useSelectType] = useState("");
  /* const urlPokemon = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=30';
 */
  const fetchPokemon = () => {
    fetch(urlTypes)
      .then(response => response.json())
      .then(data => setTipos(data.results))
      .catch(error => console.log(error));
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let pokemons = data.results;
        setNext(data.next)
        //console.log(next)
        setPrevious(data.previous)
        //console.log(previous)
        const promises = pokemons.map((pokemo) =>
          fetch(pokemo.url).then((res) => res.json())
        );
        Promise.all(promises).then((pokemonData) => {
          setPokemon(pokemonData);
        });
      })
      .catch((error) => console.log(error));
  };
  const handleNextButtonClick = () => {
    if (next) {
      setUrl(next);
    }
  };
  const handlePreviousButtonClick = () => {
    if (previous) {
      setUrl(previous);
    }
  };

  const loadMore=()=>
  {
    setIsLoadingMore(true)
    if(next)
    {
      setIsLoadingMore(true)
      fetch(next)
      .then(response=>response.json())
      .then(data=> {setNewPokemos(prevPokemons=>([data.results]));setNext(next);setIsLoadingMore(false)})
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [url,selectType]);

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <ScrollView horizontal={true}>
      <View style={{ flexDirection: 'row' }}>
        {
          tipos.map((tipo)=>(
            <View style={styles.containerBottonType} key={tipo.name}>
              <TouchableOpacity 
              style={styles[tipo.name]}
              onPress={()=>useSelectType(tipo.name)}
              >
                <Text style={{textAlign: 'center',color:'white'}}>{tipo.name}</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    </ScrollView>
      
      <FlatList 
        style={styles.containerList}
        data={pokemos}
        keyExtractor={(item) => item.id.toString()} 
        onEndReached={loadMore}
        renderItem={({ item }) => 
        (
          (selectType === item.types[0].type.name || selectType === '') ?
          (
          <View style={styles.containerCard}>
            <Image
              style={styles.logo}
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`,
              }}
            />
            <Text style={styles.idBack}>#{item.id}</Text>
            <View style={styles.pokemonInfo}>
              <View style={styles.column}>
                <Text style={styles.pokemonId}>#{item.id}</Text>
                <Text style={styles.pokemonId}>#{item.types[0].type.name}</Text>
                <Text style={styles.pokemonName}>{item.name.toUpperCase()}</Text>
              </View>
              <View style={styles.pokemonTipos}>
                {item.types.map((type) => (
                  
                  <Text key={type.slot} style={styles[type.type.name]}>
                    {type.type.name}
                  </Text>
                ))}
              </View>
              <View style={styles.column}>
                <Text style={styles.pokemonId}>{item.height / 10}m</Text>
                <Text style={styles.pokemonId}>{item.weight / 10}kg</Text>
              </View>
            </View>
          </View>) : null
        )}
      />
      <View style={styles.containerButton}>
        <Button 
          onPress={handleNextButtonClick} 
          title="NEXT"
          color="green"
          style={styles.botton}
        />
        <Button
          onPress={handlePreviousButtonClick}
          title="PREVIOUS"
          color="#841584"
        />
      </View>
    </SafeAreaView>
  );
};

//export default ListPokemon;


const styles = StyleSheet.create(
    {
        containerSafeArea:
        {
            flex:1,
            backgroundColor:'#ececec',
            justifyContent: 'center',
            alignItems:'center',
            
        },

        containerList:
        {
          //marginBottom:10,
          marginTop:11,
          //backgroundColor: 'red'
        },
        containerCard:
        {
            flex:1,
            alignItems: 'center',
            paddingTop:8,
            backgroundColor:'#f7f7f7',
            marginTop:15,
            width: 300,
            height: 500,
            borderRadius:30,
        },
        logo: 
        {
            width: 240,
            height: 250,
        },
        idBack:
        {
            position:'absolute',
            top:-1,
            fontSize:110,
            fontWeight:'bold',
            zIndex: -1,
            color:'black'
        },
        pokemonId:
        {
            backgroundColor:'#ececec',
            paddingRight:10,
            paddingLeft:10,
            marginRight:10,
            borderRadius:10,
            height:19,
            color:'black',

        },
        pokemonInfo:
        {
            flex:1,
            width:200,
        },
        column: 
        {
            flex: 1, // Hace que cada columna ocupe la mitad del espacio disponible.
            paddingHorizontal: 10, // Espacio horizontal entre columnas.
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            textAlign:'center',
            //backgroundColor: 'red',
        },
        text: 
        {
            fontSize: 16,
            marginBottom: 10,
          },
        pokemonName:
        {
            fontSize: 25,
            color:'black',
            fontWeight:'bold',
        },
        pokemonTipos:
        {
            flex:1,
            gap:1,
            fontSize:5,
            flexDirection:'row',
            flexWrap:'wrap',
            justifyContent:'center',
            //backgroundColor:'red',
            alignItems:'center',
            textAlign:'center'
        },

        containerButton:
        {
          flexDirection:'row',
          width: 300,
          justifyContent: 'space-between',
          marginBottom: 16,

        },
        
        containerTypes:
        {
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          zIndex: 1,
          marginBottom: 27,
        },

        containerBottonType:
        {
          width: 100,
          height: 50,
          margin: 5,
        },

        bottonType:
        {
          width:4,
          height:3,
          margin:5,
        },

        botton:
        {
          
          borderRadius: 20,
        },

        /* clases para los tipos de Pokemon */
        normal:
        {
            backgroundColor:'#A8A878',
            color:'white',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
            
        },
        fire:
        {
            backgroundColor:'#F08030',
            color:'red',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        water:
        {
            backgroundColor:'#6890F0',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        grass:
        {
            backgroundColor:'#78C850',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        electric:
        {
            backgroundColor:'#F8D030',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        ice:
        {
            backgroundColor:'#98D8D8',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        fighting:
        {
            backgroundColor:'#C03028',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        poison:
        {
            backgroundColor:'#A040A0',
            color:'white',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        ground:
        {
            backgroundColor:'#E0C068',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        flying:
        {
            backgroundColor:'#A890F0',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        psychic:
        {
            backgroundColor:'#F85888',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        bug:
        {
            backgroundColor:'#A8B820',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        rock:
        {
            backgroundColor:'#B8A038',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        ghost:
        {
            backgroundColor:'#705898',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        dragon:
        {
            backgroundColor:'#7038F8',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        steel:
        {
            backgroundColor:'#B8B8D0',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        fairy:
        {
            backgroundColor:'#F0B6BC',
            color:'black',
            padding:2,
            paddingRight:2,
            marginRight:3,
            borderRadius:10,
            height:30,
        },
        
    }
)
export default ListPokemon