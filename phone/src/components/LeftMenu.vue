<template>
 
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-menu" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item @click="clkPhoneReg">
        <v-list-item-title>Карточка регистрации</v-list-item-title>
        <v-list-item-subtitle>PhoneReg.vue component</v-list-item-subtitle>
      </v-list-item>
      <v-list-item @click="clkPhonePad">
        <v-list-item-title>Телефон с кнопками</v-list-item-title>
        <v-list-item-subtitle>PhonePad.vue component</v-list-item-subtitle>
      </v-list-item>
      <v-list-item @click="clkPhoneHistory">
        <v-list-item-title>История звонков</v-list-item-title>
        <v-list-item-subtitle>PhoneHistory.vue component</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>

</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  function clkPhoneReg() {
    sip.displayReg = !sip.displayReg
  }
  function clkPhonePad() {
    sip.displayPad = !sip.displayPad
  }
  function clkPhoneHistory() {
    sip.displayHistory = !sip.displayHistory
  }
</script>
