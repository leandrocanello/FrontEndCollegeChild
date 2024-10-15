<template>
  <q-page class="q-pa-md">
    <q-layout view="lHh lpr lFf">
      <!-- Barra lateral divertida e colorida -->
      <q-drawer show-if-above bordered content-class="bg-yellow-5 text-white">
        <q-list>
          <q-item-label header class="text-h6 text-center">Menu</q-item-label>

          <q-item clickable @click="navigateTomateria('materia')">
            <q-item-section avatar>
              <q-icon name="book" color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Matérias</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="navigateTonota('nota')">
            <q-item-section avatar>
              <q-icon name="edit" color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Notas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="navigateToTurma('turma')">
            <q-item-section avatar>
              <q-icon name="school" color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Turmas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            @click="navigateToUsuarioSenha('alterarUsuarioSenha')"
          >
            <q-item-section avatar>
              <q-icon name="key" color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Alterar usuário e senha</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="navigateToFrequencia('frequencia')">
            <q-item-section avatar>
              <q-icon name="event" color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Frequência</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="exit_to_app" color="red" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-red">Sair</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <!-- Conteúdo Principal -->
      <q-page-container>
        <q-page class="q-pa-md">
          <div class="q-mb-lg">
            <q-banner
              inline-actions
              class="bg-pink-3 text-white q-pa-md q-mt-md"
            >
              <div class="row items-center q-gutter-md">
                <q-avatar size="100px" rounded>
                  <img
                    src="https://i1.sndcdn.com/avatars-59yxrRyhM9GIfV7z-j15POQ-t1080x1080.jpg"
                    alt="Avatar"
                  />
                </q-avatar>
                <div class="col">
                  <div class="text-h5">Bem-vindo ao seu Dashboard!</div>
                  <div class="text-subtitle1">
                    Vamos aprender de maneira divertida!
                  </div>
                </div>
              </div>
            </q-banner>
          </div>

          <!-- Barra de XP -->
          <q-card
            flat
            bordered
            class="bg-light-blue-1 text-dark q-pa-md q-mb-md"
          >
            <div class="row q-col-gutter-md items-center">
              <div class="col">
                <div class="text-h6">Nível {{ nivel }}</div>
                <q-linear-progress
                  :value="xpAtual / xpMaximo"
                  color="accent"
                  track-color="grey-3"
                  size="20px"
                  rounded
                >
                  <div>{{ xpAtual }} / {{ xpMaximo }} XP</div>
                </q-linear-progress>
              </div>
              <q-avatar size="100px" class="q-ml-md">
                <img
                  src="https://i1.sndcdn.com/avatars-59yxrRyhM9GIfV7z-j15POQ-t1080x1080.jpg"
                  alt="Avatar"
                />
              </q-avatar>
            </div>
          </q-card>

          <router-view></router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script>
import axios from "@/axios"; // Importa a instância do Axios

export default {
  data() {
    return {
      userDetails: null,
      idaluno: null,
      userId: null,
      nivel: 1, // Nível inicial do aluno
      xpAtual: 0, // XP atual do aluno
      xpMaximo: 2000, // XP necessário para subir de nível
    };
  },
  async created() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("idusuario");
    const role = localStorage.getItem("role");

    if (!token || token === "undefined" || token === null || token === "") {
      this.$router.push("/login");
    } else {
      try {
        await this.buscarDetalhesUsuario(userId, role);
        // Chama buscarXPENivel somente após buscarDetalhesUsuario ter concluído
        if (this.idaluno) {
          this.buscarXPENivel(this.idaluno);
        } else {
          console.error("ID do Aluno não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      }
    }
  },
  methods: {
    navigateTomateria(route) {
      if (route === "materia") {
        if (this.idaluno) {
          this.$router.push(`/dashboard/aluno/materias/${this.idaluno}`);
        } else {
          console.error("ID do Aluno não encontrado.");
        }
      } else {
        this.$router.push(`/${route}`);
      }
    },
    navigateTonota(route) {
      if (route === "nota") {
        if (this.idaluno) {
          this.$router.push(`/dashboard/aluno/notas/${this.idaluno}`);
        } else {
          console.error("ID do Aluno não encontrado.");
        }
      } else {
        this.$router.push(`/${route}`);
      }
    },
    navigateToTurma(route) {
      if (route === "turma") {
        if (this.idaluno) {
          this.$router.push(`/dashboard/aluno/turmas/${this.idaluno}`);
        } else {
          console.error("ID do Aluno não encontrado.");
        }
      } else {
        this.$router.push(`/${route}`);
      }
    },
    navigateToUsuarioSenha(route) {
      if (route === "alterarUsuarioSenha") {
        if (this.idaluno) {
          this.$router.push(
            `/alterarUsuarioSenha/${this.userId}`
          );
        } else {
          console.error("ID do Aluno não encontrado.");
        }
      } else {
        this.$router.push(`/${route}`);
      }
    },
    navigateToFrequencia(route) {
      if (route === "frequencia") {
        if (this.idaluno) {
          this.$router.push(`/dashboard/aluno/frequencias/${this.idaluno}`);
        } else {
          console.error("ID do Aluno não encontrado.");
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
        this.userId = userId;
        this.userDetails = response.data;
        this.idaluno = response.data[0].idaluno;
        console.log("ID do Aluno:", this.idaluno);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      }
    },
    async buscarXPENivel(idaluno) {
      try {
        const response = await axios.get(`/aluno_gamificacao/${idaluno}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { nivel, xp } = response.data;
        this.nivel = nivel;
        this.xpAtual = xp;
        this.atualizarBarraDeXP();
      } catch (error) {
        console.error("Erro ao buscar XP e Nível:", error);
      }
    },
    atualizarBarraDeXP() {
      const progress = (this.xpAtual / this.xpMaximo) * 100;
      this.xpBarWidth = `${progress}%`; // Agora o valor de 'progress' é usado para atualizar a largura da barra de XP
    },
  },
};
</script>

<style scoped>
/* Layout infantil com cores alegres e vibrantes */
.q-page {
  background-color: #e1f5fe;
  font-family: "Comic Sans MS", sans-serif;
}

.q-layout {
  background-color: #ffeb3b;
}

.q-drawer {
  background-color: #ffeb3b;
}

.q-banner {
  background-color: #ff5252;
}

.my-card {
  background-color: #e3f2fd;
}

.q-linear-progress {
  height: 20px;
  border-radius: 10px;
}

.q-item {
  font-size: 1.2em;
  font-weight: bold;
}
</style>
