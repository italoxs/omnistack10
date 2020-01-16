import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Main from './pages/Main'
import Profile from './pages/Profile'

const Routes = createAppContainer(
  createStackNavigator({
    Main: {
      screen: Main, //qual componente sera renderizado
      navigationOptions: { //Opções especificas da tela
        title: 'DevRadar'
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Perfil no Github'
      }
    },
  }, {
    defaultNavigationOptions: {
      headerTintColor: '#FFF',
      headerBackTitleVisible: false, 
      headerStyle: { // container header
        backgroundColor: '#7D40E7'
      }
    }
  })
)

export default Routes
