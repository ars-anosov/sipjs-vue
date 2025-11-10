<template>
  <v-card elevation="8" class="pa-2">
    <v-card-title>{{ sip.phoneHeader }}</v-card-title>
    <v-divider></v-divider>
    <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit" @reset.prevent="handleReset">
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
      <v-col cols="12" sm="12" class="text-right">
        <v-btn class="ma-2"
          color="success"
          type="submit"
          prepend-icon="mdi-phone"
          :disabled="sip.outgoCallNow || sip.incomeCallNow"
        >
        {{ sip.incomeDisplay ? 'Answer' : 'Call' }}
        </v-btn>
        <v-btn class="ml-2"
          color="error"
          type="reset"
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
    console.log('PhonePad MOUNT')
  })

  onUnmounted(() => {
    console.log('PhonePad UNMOUNT')
  })



  function handleSubmit() {
    if (sip.incomeDisplay) {
      // Входящий
      sip.handleClkSubmitIn()
    }
    else {
      // Исходящий
      sip.handleClkSubmitOut()
    }
  }

  function handleReset() {
    sip.handleClkReset(sip.outgoingSession, sip.incomingSession, sip.callerUserNum)
  }
</script>



<style scoped>
.v-btn {
  min-width: 100px;
}
</style>
