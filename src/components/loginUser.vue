<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Usuário:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit" class="login-button">Entrar</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'; // Importa a instância configurada do Axios

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
  try {
    const credentials = btoa(`${this.username}:${this.password}`);
    const response = await axios.post('/login', {}, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });
    console.log(response.data)
    const { token, idusuario, role } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('idusuario', idusuario);
    localStorage.setItem('role', role);

    this.$router.push('/dashboard');
  } catch (error) {
    this.errorMessage = 'Erro ao realizar login. Verifique suas credenciais.';
    console.error('Erro ao realizar login:', error);
  }
}
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  background: #fff;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 1em;
  color: #333;
}

.form-group {
  margin-bottom: 1.5em;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5em;
  color: #555;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #007bff;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 0.75em;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

.error {
  margin-top: 1em;
  color: red;
}
</style>