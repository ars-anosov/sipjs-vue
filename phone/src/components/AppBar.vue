<template>
  <v-toolbar color="primary">
    <LeftMenu />
    <v-toolbar-title>WebRTC</v-toolbar-title>

    {{ sip.phoneHeader }}
    <PhoneControl />
  </v-toolbar>
</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  import LeftMenu from './LeftMenu.vue'
  import PhoneControl from './PhoneControl.vue'
</script>
