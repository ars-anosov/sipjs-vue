<template>
  <v-card elevation="8" class="pa-2">
    <v-card-title>{{ phoneHeader }}</v-card-title>
    <v-divider></v-divider>
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
import { ref, onMounted } from 'vue'
import { useSipStore } from '@/stores/sip'

const sip = useSipStore()
const phoneHeader = ref('SIP Registration')
const formRef = ref(null)
const formValid = ref(false)

const requiredRule = value => !!value || 'Field is required'

onMounted(() => {
  console.log('PhoneReg MOUNT')
})

function handleRegister() {
  if (!formRef.value?.validate()) {
    console.warn('Form validation failed')
    return
  }

  const uriHost = localStorage.getItem('uas_uri')
  const wssPort = localStorage.getItem('wss_port')
  sip.register(uriHost, wssPort)
}
</script>
