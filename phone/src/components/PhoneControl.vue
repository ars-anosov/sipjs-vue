<template>
 
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-if="sip.displayReg" icon="mdi-phone-settings" color="error" v-bind="props" ></v-btn>
      <v-btn v-else-if="sip.outgoCallNow" icon="mdi-phone-outgoing" color="success" v-bind="props" ></v-btn>
      <v-btn v-else-if="sip.incomeCallNow" icon="mdi-phone-incoming" color="success" v-bind="props" ></v-btn>
      <v-btn v-else-if="sip.incomeDisplay" icon="mdi-phone-incoming" color="orange" v-bind="props" ></v-btn>
      <v-btn v-else icon="mdi-phone" color="white" v-bind="props"></v-btn>
    </template>
    <PhonePad :showInput="false" />
  </v-menu>

</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  import PhonePad from './PhonePad.vue'
</script>
