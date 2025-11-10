// stores/sip.js
import { defineStore } from 'pinia'
import { UserAgent } from 'sip.js'

export const useSipStore = defineStore('sip', {
  state: () => ({
    displayPad      : false,
    displayReg      : true,
    displayIco      : true,
    status          : '',

    userAgentOptions  : null,
    sessionOptions    : null,
    userAgent         : null,
    audioLocalIn      : null,
    audioLocalOut     : null,
    audioRemote       : null,
    remoteStream      : null,
    incomingSession   : null,
    outgoingSession   : null,
    
    phoneHeader     : 'Не зарегистрирован',
    callerUserNum   : '',
    regUserPass     : '',
    calleePhoneNum  : '',
    incomeDisplay   : false,
    outgoCallNow    : false,
    incomeCallNow   : false,

    callsArr        : []
  }),
  actions: {
    async register(uriHost, wssPort) {
      const uri = UserAgent.makeURI(`sip:${this.callerUserNum}@${uriHost}`)
      if (!uri) {
        console.error('Invalid URI')
        return
      }

      const userAgentOptions = {
        uri,
        authorizationUsername: this.callerUserNum,
        authorizationPassword: this.regUserPass,
        displayName: `WebRTC user ${this.callerUserNum}`,
        transportOptions: {
          server: `wss://${uriHost}:${wssPort}`,
        },
      }

      this.userAgent = new UserAgent(userAgentOptions)
      try {
        await this.userAgent.start()
        this.registered = true
        console.log('SIP registered')
      } catch (error) {
        console.error('Registration failed:', error)
      }
    },
  },
})
