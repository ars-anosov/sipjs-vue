<template>
  <v-card elevation="8" class="pa-2">
    <v-card-title>{{ sip.phoneHeader }}</v-card-title>
    <!-- <v-divider></v-divider> -->
    <v-form ref="formRef" v-model="formValid" @submit.prevent="handleRegister">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="sip.callerUserNum"
            label="Number"
            :rules="[requiredRule]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="sip.regUserPass"
            label="Secret"
            type="password"
            :rules="[requiredRule]"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" class="text-right">
          <v-btn
            color="primary"
            type="submit"
            prepend-icon="mdi-login"
          >
            Register
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>



<script setup>
  import { UserAgent } from "sip.js"
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  const formRef = ref(null)
  const formValid = ref(false)
  const requiredRule = value => !!value || 'Пусто'

  onMounted(() => {
    console.log('PhoneReg MOUNT')
  })

  onUnmounted(() => {
    console.log('PhoneReg UNMOUNT')
  })



  function handleRegister() {
    if (!formRef.value?.validate()) {
      console.warn('Form validation failed')
      return
    }

    const uriHost = localStorage.getItem('uas_uri')
    const wssPort = localStorage.getItem('wss_port')
    // sip.register(uriHost, wssPort)



    let uri = undefined
    if (sip.callerUserNum) {
      uri = UserAgent.makeURI("sip:"+sip.callerUserNum+"@"+uriHost)
      if (!uri) {
        // throw new Error("Failed to create URI")
        console.log("Failed to create UserAgent URI for:","sip:"+sip.callerUserNum+"@"+uriHost)
      }
    }

    const userAgentOptions = {
      uri,
      authorizationUsername: sip.callerUserNum,
      authorizationPassword: sip.regUserPass,
      displayName: "WebRTC user "+sip.callerUserNum,
      hackIpInContact: true,
      transportOptions: {
        server: "wss://"+uriHost+":"+wssPort
      },
      logLevel: process.env.NODE_ENV === 'production' ? "error" : "debug"
    }

    const constrainsDefault = {
      audio: true,
      video: false,
    }

    const sessionOptions = {
      sessionDescriptionHandlerOptions: {
        constraints: constrainsDefault,
      }
    }

    if (userAgentOptions.authorizationUsername) {
      sip.handleClkRegister(userAgentOptions, sessionOptions)
    }

  }
</script>
