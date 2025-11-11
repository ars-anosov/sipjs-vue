<template>
  <p class="text-center text-caption font-weight-light">
    powered by
    sip.js {{pkg.dependencies['sip.js']}},
    vue {{pkg.dependencies['vue']}},
    vuetify {{pkg.dependencies['vuetify']}},
    pinia {{pkg.dependencies['pinia']}},
    vite {{pkg.devDependencies['vite']}}
    <br />
    <strong>v.{{pkg.version}}</strong>
    Copyright &copy; <a href="https://github.com/ars-anosov/sipjs-vue">ars</a> {{new Date().getFullYear()}}.
  </p>
</template>



<script setup>
  import pkg from '../../package.json'
</script>

