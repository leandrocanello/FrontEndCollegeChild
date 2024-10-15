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
          <h2>Enviar Mensagem para os Responsáveis</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="enviarMensagem">
          <q-select
            v-model="responsaveisSelecionados"
            :options="responsaveis.map((responsavel) => ({
              label: responsavel.nome + ' (' + responsavel.celular + ')',
              value: responsavel,
            }))"
            label="Selecione os Responsáveis"
            outlined
            multiple
            emit-value
            map-options
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-input
            v-model="mensagem"
            label="Mensagem"
            outlined
            type="textarea"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
            rows="4"
            placeholder="Escreva a mensagem aqui..."
          />

          <q-btn
            label="Enviar Mensagem"
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
import axios from "@/axios";

export default {
  data() {
    return {
      responsaveis: [], // Lista de responsáveis carregada do backend
      responsaveisSelecionados: [], // Lista de responsáveis selecionados
      mensagem: "", // Mensagem escrita pelo professor
      errorMessage: "",
      successMessage: "",
    };
  },
  async created() {
    // Carregar a lista de responsáveis do backend
    try {
      const response = await axios.get("/responsavel", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.responsaveis = response.data;
    } catch (error) {
      this.errorMessage = "Erro ao carregar a lista de responsáveis.";
      console.error("Erro:", error);
    }
  },
  methods: {
    async enviarMensagem() {
      if (this.responsaveisSelecionados.length === 0 || !this.mensagem) {
        this.errorMessage =
          "Selecione pelo menos um responsável e escreva uma mensagem.";
        return;
      }

      // Extrai os números de telefone dos responsáveis selecionados
      const numeros = this.responsaveisSelecionados.map((responsavel) =>
        responsavel.celular.replace(/\D/g, "")
      ); // Remove qualquer caractere que não seja número

      try {
        // Envia a requisição para a API
        const response = await axios.post(
          "http://localhost:8001/enviarMensagem",
          {
            phone_numbers: numeros,
            message: this.mensagem,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.successMessage = "Mensagens enviadas com sucesso!";
        this.errorMessage = "";
        console.log(response.data);
      } catch (error) {
        this.errorMessage = "Erro ao enviar as mensagens. Tente novamente.";
        console.error("Erro ao enviar mensagens:", error);
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
