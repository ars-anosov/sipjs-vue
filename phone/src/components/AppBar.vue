<template>
  <v-toolbar color="primary" class="pr-2">
    <LeftMenu />
    <v-toolbar-title>WebRTC</v-toolbar-title>

    {{ sip.phoneHeader }}
    <PhoneControl v-if="sip.displayControl" />
  </v-toolbar>
</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  import LeftMenu from './LeftMenu.vue'
  import PhoneControl from './PhoneControl.vue'
</script>
