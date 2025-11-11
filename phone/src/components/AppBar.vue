<template>
  <v-toolbar color="primary">
    <v-btn icon="mdi-menu"></v-btn>

    <v-toolbar-title text="WebRTC"></v-toolbar-title>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-if="sip.displayReg" icon="mdi-phone-settings" color="error" v-bind="props" ></v-btn>
        <v-btn v-else-if="sip.outgoCallNow" icon="mdi-phone-outgoing" color="success" v-bind="props" ></v-btn>
        <v-btn v-else-if="sip.incomeCallNow" icon="mdi-phone-incoming" color="success" v-bind="props" ></v-btn>
        <v-btn v-else-if="sip.incomeDisplay" icon="mdi-phone-incoming" color="orange" v-bind="props" ></v-btn>
        <v-btn v-else icon="mdi-phone" color="white" v-bind="props"></v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, i) in phoneMenu"
          :key="i"
          :value="i"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-menu>

  </v-toolbar>
</template>



<script setup>
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  const phoneMenu = [
    { title: 'Click Me1', subtitle: 'subtitle 1' },
    { title: 'Click Me2', subtitle: 'subtitle 2' },
  ]
</script>
