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
          <h2>Cadastro de Professor</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="cadastrarProfessor">
          <q-input
            v-model="professor.nome"
            label="Nome"
            outlined
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-btn
            label="Cadastrar"
            color="primary"
            type="submit"
            :disable="!professor.user_id"
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

          <div v-if="successMessage" class="q-mt-md">
            <p>Usuário: <strong>{{ usuario }}</strong></p>
            <p>Senha: <strong>{{ senha }}</strong></p>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      professor: {
        nome: "",
        user_id: null, // Será preenchido após o cadastro do usuário
      },
      usuario: "", // Nome de usuário gerado
      senha: "", // Senha gerada
      errorMessage: "",
      successMessage: "",
    };
  },
  async created() {
    try {
      // Gera um nome de usuário único e uma senha padrão
      this.usuario = `professor_${Date.now()}`;
      this.senha = "senha_padrao"; // Ajustar para ser dinâmica ou pedida ao usuário

      // Cria o usuário com a role "professor"
      const usuarioResponse = await axios.post(
        "/usuario",
        {
          usuario: this.usuario,
          senha: this.senha,
          role: "professor",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      // Armazena o ID do usuário criado no campo user_id do professor
      this.professor.user_id = usuarioResponse.data.iduser;
      console.log("Usuário criado com sucesso, ID:", this.professor.user_id);
    } catch (error) {
      this.errorMessage = "Erro ao criar o usuário.";
      console.error("Erro ao criar o usuário:", error);
    }
  },
  methods: {
    async cadastrarProfessor() {
      if (!this.professor.user_id) {
        this.errorMessage = "Não foi possível vincular o usuário ao professor.";
        return;
      }

      try {
        // Faz o cadastro do professor com o user_id vinculado
        const response = await axios.post(
          "http://localhost:3000/professor",
          this.professor,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );

        this.successMessage = "Professor cadastrado com sucesso!";
        this.errorMessage = "";
        console.log("Resposta:", response.data);
      } catch (error) {
        this.errorMessage = "Erro ao cadastrar professor. Tente novamente.";
        this.successMessage = "";
        console.error("Erro ao cadastrar professor:", error);
      }
    },
  },
};
</script>

<style scoped>
.my-card {
  max-width: 600px;
  margin: 0 auto;
}

.full-width {
  width: 100%;
}

.q-mt-md {
  margin-top: 20px;
}
</style>
