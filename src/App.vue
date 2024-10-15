<template>
  <q-layout view="lHh Lpr lFf">


    <q-page-container>
      <router-view /> <!-- Importante: onde as rotas serão renderizadas -->
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LayoutDefault',

  setup () {
    return {
      leftDrawerOpen: ref(false)
    }
  }
}
</script>
