<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="my-card">
      <q-card-section class="row items-center">
        <q-img
          src="https://cdn.quasar.dev/img/parallax2.jpg"
          class="q-mr-md"
          style="max-width: 100px"
        />
        <div>
          <h2>Vincular Aluno com Matéria</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="vincularAlunoMateria">
          <q-select
            v-model="alunoSelecionado"
            :options="alunos.map((aluno) => ({
              label: aluno.nome + ' ' + aluno.sobrenome,
              value: aluno.idaluno,
            }))"
            label="Selecione o Aluno"
            outlined
            emit-value
            map-options
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-select
            v-model="materiaSelecionada"
            :options="materias.map((materia) => ({
              label: materia.nomemateria,
              value: materia.idmateria,
            }))"
            label="Selecione a Matéria"
            outlined
            emit-value
            map-options
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-btn
            label="Vincular"
            color="primary"
            type="submit"
            class="full-width q-mt-lg"
          />

          <q-banner
            v-if="successMessage"
            class="q-mt-md"
            color="positive"
            icon="check_circle"
          >
            {{ successMessage }}
          </q-banner>

          <q-banner
            v-if="errorMessage"
            class="q-mt-md"
            color="negative"
            icon="warning"
          >
            {{ errorMessage }}
          </q-banner>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "@/axios"; // Usando axios diretamente sem a instância configurada

export default {
  data() {
    return {
      alunos: [], // Lista de alunos
      materias: [], // Lista de matérias
      alunoSelecionado: null, // ID do aluno selecionado
      materiaSelecionada: null, // ID da matéria selecionada
      successMessage: "",
      errorMessage: "",
      userDetails: {},
    };
  },
  async created() {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      this.userDetails = JSON.parse(storedUserDetails); // Recupera e atribui os detalhes do usuário
      console.log("Detalhes do usuário recuperados:", this.userDetails);
    } else {
      console.error("Nenhum dado de usuário encontrado no localStorage.");
    }

    this.carregarDados(); // Carrega os dados de alunos e matérias
  },
  methods: {
    async vincularAlunoMateria() {
      try {
        // Faz o POST para vincular aluno com matéria
        const response = await axios.post(
          "http://localhost:3000/alunomateria",
          {
            idaluno: this.alunoSelecionado,
            idmateria: this.materiaSelecionada,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.successMessage = "Aluno vinculado com sucesso!";
        this.errorMessage = "";
        console.log("Resposta:", response.data);
      } catch (error) {
        this.errorMessage =
          "Erro ao vincular aluno com a matéria. Tente novamente.";
        this.successMessage = "";
        console.error("Erro ao vincular aluno com a matéria:", error);
      }
    },
    async carregarDados() {
      try {
        // Carrega a lista de alunos
        const alunosResponse = await axios.get(
          "/aluno/professor/" + this.userDetails[0].idprofessor,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.alunos = alunosResponse.data;

        // Carrega a lista de matérias
        const materiasResponse = await axios.get("/materia", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.materias = materiasResponse.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar alunos ou matérias.";
        console.error("Erro ao carregar alunos ou matérias:", error);
      }
    },
  },
};
</script>

<style scoped>
.my-card {
  max-width: 800px;
  margin: 0 auto;
}
.full-width {
  width: 100%;
}
.q-mt-md {
  margin-top: 20px;
}
</style>
