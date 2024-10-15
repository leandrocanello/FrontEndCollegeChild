<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <div>
          <h2 class="text-h5 text-primary">Frequência do Aluno</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Verificação se há frequências -->
        <q-banner v-if="!frequencias.length" class="q-mt-md" color="warning" icon="warning">
          Nenhuma informação de frequência disponível.
        </q-banner>

        <q-banner v-if="errorMessage" class="q-mt-md" color="negative" icon="error">
          {{ errorMessage }}
        </q-banner>

        <!-- Grid de frequências -->
        <div class="frequencias-grid" v-if="frequencias.length">
          <q-card v-for="(frequencia, index) in frequencias" :key="index" class="frequencia-card">
            <q-card-section>
              <q-item-label>
                <strong>Data da Aula:</strong> {{ formatarData(frequencia.diaaula) }}
              </q-item-label>
              <q-item-label>
                <strong>Presença:</strong> 
                <q-badge :color="frequencia.presenca ? 'green' : 'red'">
                  {{ frequencia.presenca ? 'Presente' : 'Ausente' }}
                </q-badge>
              </q-item-label>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      frequencias: [], // Armazena a lista de frequências
      errorMessage: "", // Mensagem de erro, se ocorrer
    };
  },
  async created() {
    const idaluno = this.$route.params.idaluno; // Obtém o idaluno da rota
    console.log("ID do aluno:", idaluno);
    try {
      // Faz a chamada GET para obter as frequências do aluno
      const response = await axios.get(`/frequencia/${idaluno}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Armazena as frequências retornadas pela API
      this.frequencias = response.data;
      console.log("Frequências recebidas:", this.frequencias);
    } catch (error) {
      this.errorMessage = "Erro ao carregar as frequências.";
      console.error("Erro ao carregar as frequências:", error);
    }
  },
  methods: {
    // Formatar a data para um formato mais amigável
    formatarData(dataISO) {
      const data = new Date(dataISO);
      return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    },
  },
};
</script>

<style scoped>
.my-card {
  max-width: 800px;
  margin: 0 auto;
}

.frequencias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 16px;
}

.frequencia-card {
  background-color: #e3f2fd;
  padding: 1em;
  border-radius: 5px;
}

.q-mt-md {
  margin-top: 20px;
}
</style>
