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
          <h2>Cadastro de Responsável</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="cadastrarResponsavel">
          <q-input
            v-model="responsavel.nome"
            label="Nome"
            outlined
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-input
            v-model="responsavel.celular"
            label="Celular"
            outlined
            mask="(##) #####-####"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-btn
            label="Cadastrar"
            color="primary"
            type="submit"
            :disable="!responsavel.userid"
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
      responsavel: {
        nome: "",
        celular: "",
        userid: null, // O user_id será preenchido após o cadastro do usuário
      },
      usuario: "", // Nome do usuário gerado
      senha: "", // Senha usada para o responsável
      errorMessage: "",
      successMessage: "",
    };
  },
  async created() {
    try {
      // Gera um nome de usuário único baseado em timestamp e define uma senha padrão
      this.usuario = `responsavel_${Date.now()}`;
      this.senha = "senha_padrao"; // Pode ajustar para ser dinâmica ou pedida ao usuário

      // Ao acessar a tela, cria-se um usuário com role "responsavel"
      const usuarioResponse = await axios.post(
        "/usuario",
        {
          usuario: this.usuario,
          senha: this.senha,
          role: "responsavel",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      // Armazena o ID do usuário criado no campo userid do responsável
      this.responsavel.userid = usuarioResponse.data.iduser;
      console.log("Usuário criado com sucesso, ID:", this.responsavel.userid);
    } catch (error) {
      this.errorMessage = "Erro ao criar o usuário.";
      console.error("Erro ao criar o usuário:", error);
    }
  },
  methods: {
    async cadastrarResponsavel() {
      if (!this.responsavel.userid) {
        this.errorMessage = "Não foi possível vincular o usuário ao responsável.";
        return;
      }

      try {
        // Faz o cadastro do responsável com o user_id vinculado
        const response = await axios.post(
          "http://localhost:3000/responsavel",
          this.responsavel,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.successMessage = "Responsável cadastrado com sucesso!";
        this.errorMessage = "";
        console.log("Resposta:", response.data);
      } catch (error) {
        this.errorMessage = "Erro ao cadastrar responsável. Tente novamente.";
        this.successMessage = "";
        console.error("Erro ao cadastrar responsável:", error);
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
