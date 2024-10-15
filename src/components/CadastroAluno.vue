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
          <h2>Cadastro de Aluno</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="cadastrarAluno">
          <q-input
            v-model="aluno.nome"
            label="Nome"
            outlined
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-input
            v-model="aluno.sobrenome"
            label="Sobrenome"
            outlined
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-input
            v-model="aluno.periodo"
            label="Período"
            outlined
            type="number"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-input
            v-model="aluno.observacao"
            label="Observação"
            outlined
            class="q-mb-md"
          />

          <!-- Campo para selecionar a turma -->
          <q-select
            v-model="aluno.idturma"
            :options="turmas.map(turma => ({
              label: 'Turma ' + turma.numeroturma,
              value: turma.idturma
            }))"
            label="Selecione a Turma"
            outlined
            emit-value
            map-options
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <!-- Campo para selecionar o responsável -->
          <q-select
            v-model="aluno.idresponsavel"
            :options="responsaveis.map(responsavel => ({
              label: responsavel.nome + ' - ' + responsavel.celular,
              value: responsavel.idresponsavel
            }))"
            label="Selecione o Responsável"
            outlined
            emit-value
            map-options
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-btn
            label="Cadastrar"
            color="primary"
            type="submit"
            :disable="!aluno.userid"
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

          <div v-if="successMessage">
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
      aluno: {
        nome: "",
        sobrenome: "",
        periodo: "",
        observacao: "",
        idturma: null, // ID da turma selecionada
        idresponsavel: null, // ID do responsável selecionado
        userid: null, // O user_id será preenchido após o cadastro do usuário
      },
      turmas: [], // Lista de turmas carregada do backend
      responsaveis: [], // Lista de responsáveis carregada do backend
      usuario: "", // Nome do usuário gerado
      senha: "", // Senha usada para o aluno
      errorMessage: "",
      successMessage: "",
    };
  },
  async created() {
    try {
      // Gera um nome de usuário único baseado em timestamp e define uma senha padrão
      this.usuario = `aluno_${Date.now()}`;
      this.senha = "senha_padrao"; // Pode ajustar para ser dinâmica ou pedida ao usuário

      // Ao acessar a tela, cria-se um usuário com role "aluno"
      const usuarioResponse = await axios.post(
        "/usuario",
        {
          usuario: this.usuario,
          senha: this.senha,
          role: "aluno",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      // Armazena o ID do usuário criado no campo userid do aluno
      this.aluno.userid = usuarioResponse.data.iduser;
      console.log("Usuário criado com sucesso, ID:", this.aluno.userid);

      // Carregar turmas e responsáveis
      await this.carregarTurmas();
      await this.carregarResponsaveis();
    } catch (error) {
      this.errorMessage = "Erro ao criar o usuário ou carregar dados.";
      console.error("Erro:", error);
    }
  },
  methods: {
    async carregarTurmas() {
      try {
        const response = await axios.get("http://localhost:3000/turma", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.turmas = response.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar as turmas.";
        console.error("Erro ao carregar turmas:", error);
      }
    },
    async carregarResponsaveis() {
      try {
        const response = await axios.get("http://localhost:3000/responsavel", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.responsaveis = response.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar os responsáveis.";
        console.error("Erro ao carregar responsáveis:", error);
      }
    },
    async cadastrarAluno() {
      if (!this.aluno.userid) {
        this.errorMessage = "Não foi possível vincular o usuário ao aluno.";
        return;
      }

      try {
        // Faz o cadastro do aluno com o user_id vinculado
        const response = await axios.post(
          "http://localhost:3000/aluno",
          this.aluno,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.successMessage = "Aluno cadastrado com sucesso!";
        this.errorMessage = "";
        console.log("Resposta:", response.data);
      } catch (error) {
        this.errorMessage = "Erro ao cadastrar aluno. Tente novamente.";
        this.successMessage = "";
        console.error("Erro ao cadastrar aluno:", error);
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
