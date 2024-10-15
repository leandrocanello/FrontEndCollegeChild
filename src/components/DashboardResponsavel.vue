<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <div>
          <h3 class="text-h5 text-primary">Bem-vindo, Responsável!</h3>
          <p>Acompanhe o desempenho do aluno.</p>
        </div>
      </q-card-section>
    </q-card>

    <!-- Sidebar Menu -->
    <q-drawer v-model="drawer" side="left" width="250" class="bg-primary text-white">
      <q-list padding>
        <q-item clickable v-ripple @click="navigateTo('desempenho')">
          <q-item-section avatar>
            <q-icon name="insert_chart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Acompanhar Desempenho</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="navigateToUsuarioSenha('alterarUsuarioSenha')">
          <q-item-section avatar>
            <q-icon name="vpn_key" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Alterar Usuário e Senha</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sair</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-btn
        @click="drawer = !drawer"
        color="primary"
        icon="menu"
        class="q-mb-md"
        label="Menu"
      />
      <!-- Conteúdo Principal -->
      <router-view />
    </q-page-container>
  </q-page>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      userDetails: null, // Detalhes do usuário
      drawer: false, // Controle do menu lateral
    };
  },
  created() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("idusuario");
    const role = localStorage.getItem("role");

    if (!token || token === "undefined" || token === null || token === "") {
      this.$router.push("/login");
    } else {
      this.buscarDetalhesUsuario(userId, role);
    }
  },
  methods: {
    navigateTo(route) {
      if (route === "desempenho") {
        if (this.idresponsavel) {
          this.$router.push(
            `/dashboard/responsavel/desempenho/${this.idresponsavel}`
          );
        } else {
          console.error("ID do Aluno não encontrado.");
        }
      } else {
        this.$router.push(`/${route}`);
      }
    },
    navigateToUsuarioSenha(route) {
      if (route === "alterarUsuarioSenha") {
        if (this.userId) {
          this.$router.push(
            `/alterarUsuarioSenha/${this.userId}`
          );
        } else {
          console.error("ID usuario não encontrado.");
        }
      } else {
        this.$router.push(`/${route}`);
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      this.$router.push("/login");
    },
    async buscarDetalhesUsuario(userId, role) {
      try {
        const response = await axios.get(
          `/buscausuariologado/${userId}/${role}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(userId);
        this.userDetails = response.data;
        this.idresponsavel = response.data[0].idresponsavel;
        this.userId = userId;
        console.log("Detalhes do usuário:", this.userDetails);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
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

.q-mb-md {
  margin-bottom: 20px;
}

.q-page {
  display: flex;
  height: 100vh;
  font-family: "Comic Sans MS", sans-serif;
}

.q-drawer {
  border-radius: 15px 0 0 15px;
}

.q-page-container {
  flex: 1;
  padding: 2em;
  background-color: #e0f2f1;
  border-radius: 0 15px 15px 0;
  position: relative;
}

.q-item {
  background-color: #004d40;
  border-radius: 10px;
  margin-bottom: 10px;
}

.q-item:hover {
  background-color: #00695c;
}
</style>
