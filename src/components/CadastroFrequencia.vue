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
          <h2>Cadastro de Frequência</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="cadastrarFrequencia">
          <q-input
            v-model="frequencia.diaaula"
            label="Data da Aula"
            outlined
            type="date"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-select
            v-model="frequencia.presenca"
            :options="[
              { label: 'Presente', value: true },
              { label: 'Ausente', value: false }
            ]"
            label="Presença"
            outlined
            emit-value
            map-options
            :rules="[(val) => val !== null || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-select
            v-model="frequencia.idaluno"
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

          <q-btn
            label="Cadastrar Frequência"
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
      frequencia: {
        diaaula: "",
        presenca: true, // Define como true por padrão
        idaluno: null,
      },
      alunos: [],
      errorMessage: "",
      successMessage: "",
    };
  },
  async created() {
    try {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
      this.userDetails = JSON.parse(storedUserDetails); // Recupera e atribui os detalhes do usuário
      console.log("Detalhes do usuário recuperados:", this.userDetails);
    } else {
      console.error("Nenhum dado de usuário encontrado no localStorage.");
    }
      const response = await axios.get("/aluno/professor/" + this.userDetails[0].idprofessor, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.alunos = response.data; // Supondo que o array de alunos está em response.data
    } catch (error) {
      this.errorMessage = "Erro ao carregar alunos.";
      console.error("Erro ao carregar alunos:", error);
    }
  },
  methods: {
    async cadastrarFrequencia() {
      try {
        const response = await axios.post(
          "http://localhost:3000/frequencia",
          this.frequencia,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.successMessage = "Frequência cadastrada com sucesso!";
        this.errorMessage = "";
        console.log("Frequência cadastrada:", response.data);
      } catch (error) {
        this.errorMessage = "Erro ao cadastrar frequência. Tente novamente.";
        this.successMessage = "";
        console.error("Erro ao cadastrar frequência:", error);
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
