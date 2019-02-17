import React from "react"
import Navigator from './app/main-navigator'
import UserRepository from './app/repository/user-repository'

UserRepository.instance().syncOfflineInfo()

export default class App extends React.Component {
  render() {
    return <Navigator />;
  }
}