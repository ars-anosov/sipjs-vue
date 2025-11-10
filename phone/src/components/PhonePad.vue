<template>
  <v-card elevation="8" class="pa-2">
    <v-card-title>{{ sip.phoneHeader }}</v-card-title>
    <v-divider></v-divider>
    <v-form ref="formRef" v-model="formValid" @submit.prevent="handleClkSubmit" @reset.prevent="handleClkReset">
    <v-row>
      <v-col cols="12" sm="12">
        <v-text-field
          v-model="sip.calleePhoneNum"
          label="98..."
          :rules="[requiredRule]"
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="10" class="text-right">
        <v-btn
          color="success"
          type="submit"
          prepend-icon="mdi-phone"
        >
          Call
        </v-btn>
      </v-col>
      <v-col cols="12" sm="2" class="text-right">
        <v-btn
          color="error"
          type="submit"
          prepend-icon="mdi-phone-hangup"
        >
          End
        </v-btn>
      </v-col>
    </v-row>
    </v-form>
  </v-card>
</template>
  
<script setup>
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

  const handleClkSubmit = (event) => {
    event.preventDefault()  // Не перезагружать после form Submit

    if (sip.incomeDisplay) {
      // Входящий
      sip.handleClkSubmitIn()
    }
    else {
      // Исходящий
      sip.handleClkSubmitOut()
    }

  }

  const handleClkReset = (event) => {
    sip.handleClkReset(sip.outgoingSession, sip.incomingSession, sip.callerUserNum)
  }

</script>
  