<template>
  <v-card elevation="8" class="pa-2 mt-4">
    <v-card-title>История звонков</v-card-title>
    <v-table density="compact">
      <thead>
        <tr>
          <th>
            Время
          </th>
          <th>
            Абонент
          </th>
          <th class="text-right">
            Статус
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in sip.callsArr"
          :key="item.start"
        >
          <td class="text-caption">{{ formatDate(item.start) }}</td>
          <td>{{ item.uri }}</td>
          <td class="text-right text-caption">{{ item.flow + ' ' + item.status }}</td>
        </tr>
      </tbody>
    </v-table>
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
  
</style>
  