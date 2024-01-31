/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import ListPokemon from './components/ListPokemon';
import {name as appName} from './app.json';
import Prueba from './components/Prueba';

AppRegistry.registerComponent(appName, () => ListPokemon);
