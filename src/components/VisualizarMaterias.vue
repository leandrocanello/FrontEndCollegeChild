<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <div>
          <h2 class="text-h5 text-primary">Suas Matérias</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-list v-if="materias.length">
          <q-item v-for="materia in materias" :key="materia.idmateria" clickable>
            <q-item-section>
              <q-item-label>{{ materia.nomemateria }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-banner v-else class="q-mt-md" color="warning" icon="warning">
          Nenhuma matéria encontrada para este aluno.
        </q-banner>

        <q-banner v-if="errorMessage" class="q-mt-md" color="negative" icon="error">
          {{ errorMessage }}
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      materias: [], // Lista de matérias do aluno
      errorMessage: "",
    };
  },
  async created() {
    const idaluno = this.$route.params.idaluno; // Obtém o idaluno da rota
    try {
      const response = await axios.get(`/materia/aluno/${idaluno}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.materias = response.data; // Armazena as matérias recebidas
    } catch (error) {
      this.errorMessage = "Erro ao carregar matérias.";
      console.error("Erro ao carregar matérias:", error);
    }
  },
};
</script>

<style scoped>
.my-card {
  max-width: 600px;
  margin: 0 auto;
}

.q-mt-md {
  margin-top: 20px;
}
</style>
