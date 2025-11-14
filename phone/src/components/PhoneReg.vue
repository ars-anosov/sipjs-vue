<template>
  <v-card elevation="8" class="pa-2 mt-4">
    <!-- <v-divider></v-divider> -->
    <v-row v-if="sip.regNow">
      <v-col cols="12" sm="12" class="text-right">
        <v-icon color="error" @click="handleClose">
          mdi-close-box
        </v-icon>
      </v-col>
    </v-row>
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
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="sip.uriHost"
            label="Host"
            :rules="[requiredRule]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="sip.wssPort"
            label="Port"
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



  function handleClose() {
    sip.displayReg = false
  }

  function handleRegister() {
    if (!formRef.value?.validate()) {
      console.warn('Form validation failed')
      return
    }
    // sip.register(sip.uriHost, sip.wssPort)



    let uri = undefined
    if (sip.callerUserNum) {
      uri = UserAgent.makeURI("sip:"+sip.callerUserNum+"@"+sip.uriHost)
      if (!uri) {
        // throw new Error("Failed to create URI")
        console.log("Failed to create UserAgent URI for:","sip:"+sip.callerUserNum+"@"+sip.uriHost)
      }
    }

    const userAgentOptions = {
      uri,
      authorizationUsername: sip.callerUserNum,
      authorizationPassword: sip.regUserPass,
      displayName: sip.callerUserNum,
      hackIpInContact: true,
      transportOptions: {
        server: "wss://"+sip.uriHost+":"+sip.wssPort
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
