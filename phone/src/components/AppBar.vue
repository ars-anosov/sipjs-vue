<template>
  <v-toolbar color="primary">
    <v-btn icon="mdi-menu"></v-btn>

    <v-toolbar-title text="WebRTC"></v-toolbar-title>
    {{ sip.phoneHeader }}
    
    <PhoneControl/>
  </v-toolbar>
</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  import PhoneControl from './PhoneControl.vue'
</script>
