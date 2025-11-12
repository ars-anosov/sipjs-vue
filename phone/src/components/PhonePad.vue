<template>
  <v-card
    elevation="8"
    class="mx-auto pa-2"
    max-width="300"
  >
    <v-card-title>{{ sip.phoneHeader }}</v-card-title>
    <!-- <v-divider></v-divider> -->
    <v-form @submit.prevent="handleSubmit" @reset.prevent="handleReset">
    <v-row v-if="props.showInput">
      <v-col cols="7" sm="9">
        <v-text-field
          v-model="sip.calleePhoneNum"
          label="98..."
        ></v-text-field>
      </v-col>
      <v-col cols="5" sm="3" class="text-left">
        <v-btn icon="mdi-arrow-left-bold-outline" @click="sip.deleteLast"></v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6" sm="6" class="text-center">
        <v-btn
          color="success"
          type="submit"
          icon
          :disabled="sip.outgoCallNow || sip.incomeCallNow"
        >
          <v-icon>mdi-phone</v-icon>
          <v-tooltip activator="parent" location="top">{{ sip.incomeDisplay ? 'Answer' : 'Call' }}</v-tooltip>
        </v-btn>
      </v-col>
      <v-col cols="6" sm="6" class="text-center">
        <v-btn
          color="error"
          type="reset"
          icon
        >
          <v-icon>mdi-phone-hangup</v-icon>
          <v-tooltip activator="parent" location="top">End</v-tooltip>
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="props.showInput">
      <v-col cols="12" sm="12">
        <v-card
          elevation="0"
          class="mx-auto pa-4"
          max-width="270"
        >
          <v-row>
            <v-col
              v-for="key in keys"
              :key="key[0]"
              cols="4" sm="4" class="text-center"
            >
              <v-btn
                height="40"
                @click="sip.appendKey(key[0])"
              >
                <span>
                  <div class="mb-1">{{ key[0] }}</div>
                  <small class="text-medium-emphasis">{{ key[1] }}</small>
                </span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    
  </v-form>
  </v-card>
</template>



<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  const props = defineProps({
    showInput: true
  })
  import { useSipStore } from '@/stores/sip'
  const sip = useSipStore()

  onMounted(() => {
    console.log('PhonePad MOUNT')
  })

  onUnmounted(() => {
    console.log('PhonePad UNMOUNT')
  })

  const keys = [
    ["1", ""],
    ["2", "ABC"],
    ["3", "DEF"],
    ["4", "GHI"],
    ["5", "JKL"],
    ["6", "MNO"],
    ["7", "PQRS"],
    ["8", "TUV"],
    ["9", "WXYZ"],
    ["*", ""],
    ["0", "+"],
    ["#", ""],
  ]

  function handleSubmit() {
    if (sip.incomeDisplay) {
      // Входящий
      sip.handleClkSubmitIn()
    }
    else {
      // Исходящий
      sip.handleClkSubmitOut()
    }
  }

  function handleReset() {
    sip.handleClkReset(sip.outgoingSession, sip.incomingSession, sip.callerUserNum)
  }

</script>



<style scoped>
/* .v-btn {
  min-width: 100px;
} */
</style>
