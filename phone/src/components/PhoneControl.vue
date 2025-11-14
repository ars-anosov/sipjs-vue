<template>
 
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-if="!sip.regNow" icon="mdi-phone-settings" variant="outlined" size="small" class="phone-ctl-btn" color="error" v-bind="props" ></v-btn>
      <v-btn v-else-if="sip.outgoCallNow" icon="mdi-phone-outgoing" variant="outlined" size="small" class="phone-ctl-btn" v-bind="props" ></v-btn>
      <v-btn v-else-if="sip.incomeCallNow" icon="mdi-phone-incoming" variant="outlined" size="small" class="phone-ctl-btn" v-bind="props" ></v-btn>
      <v-btn v-else-if="sip.incomeDisplay" icon="mdi-phone-ring" variant="outlined" size="small" class="phone-ctl-btn blinking-btn" v-bind="props" ></v-btn>
      <v-btn v-else icon="mdi-phone" variant="outlined" size="small" class="phone-ctl-btn" v-bind="props"></v-btn>
    </template>
    <PhonePad :showInput="false" />
  </v-menu>

</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  import PhonePad from './PhonePad.vue'
</script>



<style scoped>
  .phone-ctl-btn {
    margin-left: 8px;
  }

  .blinking-btn {
    animation: blink 1s infinite alternate;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>