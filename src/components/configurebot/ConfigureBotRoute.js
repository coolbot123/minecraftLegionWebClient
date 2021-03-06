import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { getBotBySocketId } from '../../actions/botsAction'
import NotFound from '../../pages/NotFound'

import GeneralConfig from './GeneralConfig'
import ItemsToBeReady from './ItemsToBeReady'
import Chests from './Chests'
import Combat from './Combat'
import GuardJob from './GuardJob'
import MinerJob from './MinerJob'
import ConfigureBotLayout from './ConfigureBotLayout'

class ConfigureBotRoute extends Component {
  constructor (props) {
    super(props)
    this.state = { botName: '' }
  }

  componentDidMount () {
    if (!this.props.loged) {
      this.props.history.push('/configuration')
      return
    }
    this.updateBotconfig()
  }

  componentDidUpdate (prevProps) {
    if (this.props.selectedSocketId === undefined) {
      this.props.history.push('/dashboard')
      return
    }

    if (
      this.props.botsOnline !== prevProps.botsOnline ||
      this.props.loged !== prevProps.loged
    ) {
      if (!this.props.loged) {
        this.props.history.push('/configuration')
        return
      }
    }

    if (this.props.selectedSocketId !== prevProps.selectedSocketId) {
      this.updateBotconfig()
    }
  }

  updateBotconfig () {
    this.props.socket.emit('sendAction', {
      action: 'getConfig',
      socketId: this.props.selectedSocketId,
      value: ''
    })
    this.setState({ botName: this.props.getBotBySocketId(this.props.selectedSocketId).name })
  }

  render () {
    return (
      <>
        <div className='row'>
          <div className='col-12'><h1>Bot Configuration - {this.state.botName}</h1></div>
        </div>

        <ConfigureBotLayout history={this.props.history} match={this.props.match}>
          <Switch>
            <Route exact path='/configurebot/generalconfig' component={GeneralConfig} />
            <Route exact path='/configurebot/itemstobeready' component={ItemsToBeReady} />
            <Route exact path='/configurebot/chests' component={Chests} />
            <Route exact path='/configurebot/combat' component={Combat} />
            <Route exact path='/configurebot/guardjob' component={GuardJob} />
            <Route exact path='/configurebot/minerjob' component={MinerJob} />
            <Route component={NotFound} />
          </Switch>
        </ConfigureBotLayout>
      </>
    )
  }
}

const mapStateToProps = (reducers) => {
  const { botsReducer, configurationReducer } = reducers
  const { botsOnline, logs } = botsReducer
  const { loged, socket, selectedSocketId } = configurationReducer
  return { botsOnline, logs, loged, socket, selectedSocketId }
}

const mapDispatchToProps = {
  getBotBySocketId
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureBotRoute)
