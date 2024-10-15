<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Dashboard</q-toolbar-title>
        <q-btn flat dense icon="logout" label="Sair" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple @click="navigateTo('cadastroMateria')">
          <q-item-section avatar>
            <q-icon name="book" />
          </q-item-section>
          <q-item-section>Cadastro de Matéria</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('cadastroTurma')">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>Cadastro de Turma</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('cadastroAluno')">
          <q-item-section avatar>
            <q-icon name="face" />
          </q-item-section>
          <q-item-section>Cadastro de Aluno</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('cadastroFrequencia')">
          <q-item-section avatar>
            <q-icon name="check_circle" />
          </q-item-section>
          <q-item-section>Cadastro de Frequência</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('cadastroResponsavel')">
          <q-item-section avatar>
            <q-icon name="supervisor_account" />
          </q-item-section>
          <q-item-section>Cadastro de Responsável</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('cadastroNota')">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>Cadastro de Nota</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('vincularAlunoMateria')">
          <q-item-section avatar>
            <q-icon name="link" />
          </q-item-section>
          <q-item-section>Vincular Aluno com Matéria</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('cadastroProfessor')">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Cadastro de Professor</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateToAlterarUsuario('alterarUsuarioSenha')">
          <q-item-section avatar>
            <q-icon name="vpn_key" />
          </q-item-section>
          <q-item-section>Alterar Usuário e Senha</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('enviarMensagem')">
          <q-item-section avatar>
            <q-icon name="email" />
          </q-item-section>
          <q-item-section>Enviar Mensagem</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view></router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      drawer: true, // Controla o drawer lateral
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(`/${route}`);
    },
    navigateToAlterarUsuario() {
      this.$router.push('/alterarUsuarioSenha/' + this.userId);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      this.$router.push('/login');
    },
    async buscarDetalhesUsuario(userId, role) {
      try {
        const response = await this.$axios.get(`/buscausuariologado/${userId}/${role}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        localStorage.setItem('userDetails', JSON.stringify(response.data));
      } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
      }
    },
  },
  created() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('idusuario');
    const role = localStorage.getItem('role');
    this.userId = localStorage.getItem('idusuario');
    if (!token) {
      this.$router.push('/login');
    } else {
      this.buscarDetalhesUsuario(userId, role);
    }
  },
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.q-drawer {
  width: 250px;
}

.q-page {
  padding: 20px;
}

.q-toolbar-title {
  font-size: 1.5em;
  font-weight: bold;
}
</style>
