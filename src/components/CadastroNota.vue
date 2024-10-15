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
          <h2>Cadastro de Nota</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="cadastrarNota">
          <q-input
            v-model="nota.semestre"
            label="Semestre"
            outlined
            type="number"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-input
            v-model="nota.tipodeavaliacao"
            label="Tipo de Avaliação"
            outlined
            type="text"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-input
            v-model="nota.nota"
            label="Nota"
            outlined
            type="number"
            step="0.1"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-select
            v-model="nota.idaluno"
            :options="
              alunos.map((aluno) => ({
                label: aluno.nome + ' ' + aluno.sobrenome,
                value: aluno.idaluno,
              }))
            "
            label="Aluno"
            outlined
            emit-value
            map-options
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-select
            v-model="nota.idmateria"
            :options="
              materias.map((materia) => ({
                label: materia.nomemateria,
                value: materia.idmateria,
              }))
            "
            label="Matéria"
            outlined
            emit-value
            map-options
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-btn
            label="Cadastrar Nota"
            color="primary"
            type="submit"
            class="full-width q-mt-lg"
          />

          <q-banner
            v-if="errorMessage"
            class="q-mt-md"
            color="negative"
            icon="warning"
          >
            {{ errorMessage }}
          </q-banner>

          <q-banner
            v-if="successMessage"
            class="q-mt-md"
            color="positive"
            icon="check_circle"
          >
            {{ successMessage }}
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
      nota: {
        semestre: "",
        tipodeavaliacao: "",
        nota: "",
        idaluno: null,
        idmateria: null,
      },
      alunos: [],
      materias: [],
      errorMessage: "",
      successMessage: "",
      userDetails: {},
    };
  },
  created() {
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
    async carregarDados() {
      try {
        // Carrega a lista de alunos
        console.log(this.userDetails[0].idprofessor);
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
    async cadastrarNota() {
      try {
        // Faz o cadastro da nota
        const response = await axios.post(
          "http://localhost:3000/nota",
          this.nota,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.successMessage = "Nota cadastrada com sucesso!";
        this.errorMessage = "";
        console.log("Resposta:", response.data);
      } catch (error) {
        this.errorMessage = "Erro ao cadastrar nota. Tente novamente.";
        this.successMessage = "";
        console.error("Erro ao cadastrar nota:", error);
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
