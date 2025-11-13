<template>
  <v-app>
    <br />
    <v-container class="rounded-xl border-sm border-dashed" max-width="600px">
      <AppBar />
      <PhoneReg v-if="sip.displayReg" />
      <PhonePad v-if="sip.displayPad" :showInput="true" />
      <PhoneHistory v-if="sip.displayHistory" />
      <Copyright />
    </v-container>
  </v-app>
</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()
</script>
