<template>
  <v-app>
    <br />
    <v-container class="rounded-xl border-sm border-dashed" max-width="600px">
      <AppBar />
      <br />
      <PhoneReg v-if="sip.displayReg" />
      <br />
      <Copyright />
    </v-container>
  </v-app>
</template>

<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()
</script>
