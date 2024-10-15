<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <div>
          <h2 class="text-h5 text-primary">Turmas do Aluno</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-banner v-if="!turmas.length" class="q-mt-md" color="warning" icon="warning">
          Nenhuma turma encontrada para este aluno.
        </q-banner>

        <q-banner v-if="errorMessage" class="q-mt-md" color="negative" icon="error">
          {{ errorMessage }}
        </q-banner>

        <!-- Grid de turmas -->
        <div class="turmas-grid" v-if="turmas.length">
          <q-card v-for="turma in turmas" :key="turma.idturma" class="turma-card">
            <q-card-section>
              <q-item-label>
                <strong>Esa é a sua Turma:</strong> {{ turma.numeroturma }}
              </q-item-label>
              <q-item-label>
                <strong>Professor (a):</strong> {{ getProfessorNome(turma.idprofessor) }}
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
      turmas: [], // Lista de turmas do aluno
      professores: [], // Lista de todos os professores
      errorMessage: "",
    };
  },
  async created() {
    const idaluno = this.$route.params.idaluno; // Obtém o idaluno da rota
    console.log(idaluno);
    try {
      // Carrega as turmas do aluno
      const turmasResponse = await axios.get(`/turma/aluno/` + idaluno, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.turmas = turmasResponse.data;

      // Carrega todos os professores
      const professoresResponse = await axios.get("/professor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.professores = professoresResponse.data;
    } catch (error) {
      this.errorMessage = "Erro ao carregar turmas ou professores.";
      console.error("Erro ao carregar turmas ou professores:", error);
    }
  },
  methods: {
    // Função para mapear idprofessor ao nome do professor
    getProfessorNome(idprofessor) {
      const professor = this.professores.find(
        (p) => p.idprofessor === idprofessor
      );
      return professor ? professor.nome : "Desconhecido";
    },
  },
};
</script>

<style scoped>
.my-card {
  max-width: 800px;
  margin: 0 auto;
}

.turmas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 16px;
}

.turma-card {
  background-color: #e3f2fd;
  padding: 1em;
  border-radius: 5px;
}

.q-mt-md {
  margin-top: 20px;
}
</style>
