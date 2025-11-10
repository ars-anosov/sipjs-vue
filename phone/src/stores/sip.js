// stores/sip.js
import { defineStore } from 'pinia'
import { UserAgent } from 'sip.js'

export const useSipStore = defineStore('sip', {
  state: () => ({
    userAgent: null,
    registered: false,
    callerUserNum: '',
    regUserPass: '',
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
