<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <div>
          <h2 class="text-h5 text-primary">Notas do Aluno</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-banner v-if="!notas.length" class="q-mt-md" color="warning" icon="warning">
          Nenhuma nota encontrada para este aluno.
        </q-banner>

        <q-banner v-if="errorMessage" class="q-mt-md" color="negative" icon="error">
          {{ errorMessage }}
        </q-banner>

        <!-- Grid com paginação -->
        <div class="notas-grid" v-if="notasFiltradas.length">
          <q-card v-for="nota in notasFiltradas" :key="nota.idnota" class="nota-card">
            <q-card-section>
              <q-item-label>
                <strong>Semestre:</strong> {{ nota.semestre }}
              </q-item-label>
              <q-item-label>
                <strong>Tipo de Avaliação:</strong> {{ nota.tipodeavaliacao.trim() }}
              </q-item-label>
              <q-item-label>
                <strong>Nota:</strong> {{ nota.nota }}
              </q-item-label>
              <q-item-label>
                <strong>Matéria:</strong> {{ getMateriaNome(nota.idmateria) }}
              </q-item-label>
            </q-card-section>
          </q-card>
        </div>

        <!-- Paginação -->
        <q-pagination
          v-if="notas.length > notasPorPagina"
          v-model="paginaAtual"
          :max="totalPaginas"
          max-pages="7"
          boundary-numbers
          class="q-mt-md"
          color="primary"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      notas: [], // Lista de notas do aluno
      materias: [], // Lista de todas as matérias
      errorMessage: "",
      paginaAtual: 1, // Página inicial
      notasPorPagina: 10, // Número de notas por página
    };
  },
  computed: {
    // Calcula as notas que devem ser exibidas na página atual
    notasFiltradas() {
      const inicio = (this.paginaAtual - 1) * this.notasPorPagina;
      const fim = this.paginaAtual * this.notasPorPagina;
      return this.notas.slice(inicio, fim);
    },
    totalPaginas() {
      return Math.ceil(this.notas.length / this.notasPorPagina);
    },
  },
  async created() {
    const idaluno = this.$route.params.idaluno; // Obtém o idaluno da rota
    try {
      // Carrega as notas do aluno
      const notasResponse = await axios.get(`/nota/aluno/${idaluno}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.notas = notasResponse.data;

      // Carrega todas as matérias
      const materiasResponse = await axios.get("/materia", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.materias = materiasResponse.data;
    } catch (error) {
      this.errorMessage = "Erro ao carregar notas ou matérias.";
      console.error("Erro ao carregar notas ou matérias:", error);
    }
  },
  methods: {
    // Função para mapear idmateria ao nome da matéria
    getMateriaNome(idmateria) {
      const materia = this.materias.find((m) => m.idmateria === idmateria);
      return materia ? materia.nomemateria : "Desconhecido";
    },
  },
};
</script>

<style scoped>
.my-card {
  max-width: 800px;
  margin: 0 auto;
}

.notas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 16px;
}

.nota-card {
  background-color: #e3f2fd;
  padding: 1em;
  border-radius: 5px;
}

.q-mt-md {
  margin-top: 20px;
}
</style>
