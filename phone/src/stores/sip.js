// stores/sip.js
import { defineStore } from 'pinia'
// sip.js
// https://github.com/onsip/SIP.js/blob/main/docs/api.md
import {
  // Invitation,
  Inviter,
  // InviterOptions,
  Registerer,
  // RegistererOptions,
  // Session,
  SessionState,
  UserAgent,
  // UserAgentOptions,
  // InvitationAcceptOptions
} from "sip.js"

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
    logCall(session, status, direction) {
      const log = {
        id   : session.id,
        clid : session.displayName,
        uri  : session.remoteIdentity.uri.raw.user+(session.remoteIdentity.displayName ? ' "'+session.remoteIdentity.displayName+'"' : ''),
        time : new Date().getTime()
      }
      let calllog = JSON.parse(localStorage.getItem('sipCalls'))
      if (!calllog) { calllog = {} }
    
      if (!calllog.hasOwnProperty(session.id)) {
        calllog[log.id] = {
          id    : log.id,
          clid  : log.clid,
          uri   : log.uri,
          start : log.time,
          flow  : direction
        }
      }
    
      if (status === 'завершен') {
        calllog[log.id].stop = log.time
      }
    
      if (status === 'завершен' && calllog[log.id].status === 'звонит') {
          calllog[log.id].status = 'пропущен'
      } else {
          calllog[log.id].status = status
      }
    
      localStorage.setItem('sipCalls', JSON.stringify(calllog))
    },

    CallsArrUpdate() {
      let calllog = JSON.parse(localStorage.getItem('sipCalls'))
      const rows = []
    
      if (calllog !== null) {
        for (const calllogObj in calllog) {
          rows.push(calllog[calllogObj])
        }
      }
    
      // Удаляю первую строчку лога (самую старую)
      if (rows.length > 10) {
        delete calllog[rows[0].id]
        localStorage.setItem('sipCalls', JSON.stringify(calllog))
      }
  
      rows.sort((a, b) => a.start > b.start ? -1 : 1)
      this.callsArr = rows
    },

    // https://sipjs.com/guides/end-call/
    endCall(session) {
      switch(session.state) {
        case SessionState.Initial:
        case SessionState.Establishing:
          if (session instanceof Inviter) {
            // An unestablished outgoing session
            session.cancel();
          } else {
            // An unestablished incoming session
            session.reject();
          }
          break;
        case SessionState.Established:
          // An established session
          session.bye();
          break;
        case SessionState.Terminating:
        case SessionState.Terminated:
          // Cannot terminate a session that is already terminated
          break;
      }
    },

    handleClkReset(outgoingSession, incomingSession, phoneHeader) {
      if (outgoingSession) endCall(outgoingSession)
      if (incomingSession) endCall(incomingSession)
      this.phoneHeader = phoneHeader
      this.calleePhoneNum = ''
      this.incomeDisplay = false
      this.outgoCallNow = false
      this.incomeCallNow = false
    },

    handleClkRegister(userAgentOptions, sessionOptions) {
      const thisState = this

      const audioLocalIn = new Audio()
      audioLocalIn.preload = 'auto'
      audioLocalIn.src = 'sounds/sipjs/incoming.mp3'
      audioLocalIn.loop = true

      const audioLocalOut = new Audio()
      audioLocalOut.preload = 'auto'
      audioLocalOut.src = 'sounds/sipjs/outgoing.mp3'
      audioLocalOut.loop = true

      const audioRemote = new Audio()

      const remoteStream = new MediaStream()
      
      const userAgent = new UserAgent(userAgentOptions)

      /*
      * Setup handling for incoming INVITE requests
      */
      userAgent.delegate = {
        onInvite(invitation) {

          const incomingSession = invitation
          thisState.incomingSession = incomingSession,
      
          incomingSession.delegate = {
            // Handle incoming REFER request.
            onRefer(referral) {
              console.log('sip.js incomingSession <--- incoming REFER request.')
            }
          }

          incomingSession.stateChange.addListener((newState) => {
            switch (newState) {
              case SessionState.Establishing:
                // logCall
                break;
              case SessionState.Established:
                thisState.logCall(incomingSession, 'разговор', 'вх.')
                thisState.CallsArrUpdate()
                setupRemoteMedia(incomingSession, audioRemote, remoteStream)
                break;
              case SessionState.Terminated:
                thisState.logCall(incomingSession, 'завершен', 'вх.')
                thisState.CallsArrUpdate()
                cleanupMedia(audioRemote, audioLocalIn, audioLocalOut)
                thisState.handleClkReset(false, incomingSession, userAgentOptions.authorizationUsername)
                break;
              default:
                break;
            }
          })

          audioLocalIn.play()
          thisState.logCall(incomingSession, 'звонит', 'вх.')
          thisState.CallsArrUpdate()
          thisState.incomeDisplay = true
          thisState.phoneHeader = userAgentOptions.authorizationUsername+' < '+incomingSession.remoteIdentity.uri.raw.user
          thisState.calleePhoneNum = incomingSession.remoteIdentity.uri.raw.user
        }
      }



      const registererOptions = sessionOptions
      const registerer = new Registerer(userAgent, registererOptions)


      // ------------------------------------------------------------ Handling Changes in Network State
      const reconnectionAttempts = 3
      const reconnectionDelay = 4

      // Used to guard against overlapping reconnection attempts
      let attemptingReconnection = false;
      // If false, reconnection attempts will be discontinued or otherwise prevented
      let shouldBeConnected = true;

      const attemptReconnection = (reconnectionAttempt = 1) => {

        if (!userAgent) {
          return;
        }

        if (!shouldBeConnected) {
          return;
        }

        if (attemptingReconnection) {
          return;
        }

        if (reconnectionAttempt > reconnectionAttempts) {
          return;
        }
        thisState.displayReg = true
        thisState.phoneHeader = 'Reconnection'


        attemptingReconnection = true;

        setTimeout(() => {
          if (!shouldBeConnected) {
            attemptingReconnection = false
            return;
          }
          // Attempt reconnect
          userAgent.reconnect()
            .then(() => {
              console.log('userAgent.reconnect()')
              attemptingReconnection = false
            })
            .catch((error) => {
              attemptingReconnection = false
              attemptReconnection(++reconnectionAttempt)
            });
        }, reconnectionAttempt === 1 ? 0 : reconnectionDelay * 1000)
      }



      userAgent.delegate.onConnect = () => {
        registerer.register({
          requestDelegate: {
            onAccept(response) {
              console.log('register.onAccept()',response)
              thisState.displayReg = false
              thisState.phoneHeader = response.message.from.displayName
            },
            onReject(response) {
              console.log('register.onReject()',response)
              thisState.displayReg = true
              thisState.phoneHeader = response.message.statusCode+' '+response.message.reasonPhrase
              // Принудительно отключаю, чтобы сбросить старые атрибуты user/secret
              setTimeout(() => {
                userAgent.stop()
              }, 1000)
            },
          },
        })
        .catch((e) => {
          console.log('register.catch()',e)
          thisState.displayReg = true
          thisState.phoneHeader = 'Registration error'
          // Принудительно отключаю, чтобы сбросить старые атрибуты user/secret
          setTimeout(() => {
            userAgent.stop()
          }, 1000)
        })
      }

      userAgent.delegate.onDisconnect = (error) => {
        thisState.displayReg = true
        thisState.phoneHeader = 'Disconnected'
        // registerer.unregister()
        // .catch((e) => {
        //   console.log('unregister.catch()', e)
        // })

        if (error) {
          // console.log('userAgent.onDisconnect(error)', error)
          attemptReconnection()
        }
      }

      // END OF ------------------------------------------------------------ Handling Changes in Network State



      thisState.audioLocalIn = audioLocalIn
      thisState.audioLocalOut = audioLocalOut
      thisState.audioRemote = audioRemote
      thisState.remoteStream = remoteStream
      thisState.userAgentOptions = userAgentOptions
      thisState.sessionOptions = sessionOptions
      thisState.userAgent = userAgent
      thisState.phoneHeader = 'UserAgent starting...'

      userAgent.start().then(() => {
        // UA started
      })
      .catch((e) => {
        thisState.displayReg = true
        thisState.phoneHeader = 'SIP proxy WebSocket problem'
      })

    }
  }

})
