<template>
  <v-card elevation="8" class="pa-2">
    <v-card-title>История звонков</v-card-title>
    <!-- <v-divider></v-divider> -->
    <div v-if="sip.callsArr.length === 0" class="empty">Нет звонков</div>
    <div v-else class="call-list">
    <div
      v-for="(call, index) in sip.callsArr"
      :key="index"
      class="call-item"
    >
      <div class="call-info">
      <span class="direction">{{ call.flow }}</span>
      <span class="identity">{{ call.uri }}</span>
      </div>
      <div class="timestamp">{{ formatDate(call.start) }}</div>
    </div>
    </div>
  </v-card>
</template>
  


<script setup>
  import { onMounted, onUnmounted } from 'vue'
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()
  
  onMounted(() => {
    console.log('PhonePad MOUNT')
    sip.CallsArrUpdate()
  })

  onUnmounted(() => {
    console.log('PhonePad UNMOUNT')
  })

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }
</script>
  
<style scoped>
  .phone-history {
    padding: 1rem;
  }
  h2 {
    margin-bottom: 1rem;
  }
  .empty {
    color: #888;
    font-style: italic;
  }
  .call-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .call-item {
    background: #fff;
    padding: 0.75rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  .call-info {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
  }
  .timestamp {
    font-size: 0.875rem;
    color: #666;
  }
</style>
  