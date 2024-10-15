<template>
    <div class="alterar-usuario-senha-container">
      <h2>Alterar Usuário e Senha</h2>
      <form @submit.prevent="alterarUsuarioSenha">
        <div class="form-group">
          <label for="username">Novo Usuário:</label>
          <input type="text" v-model="usuario.username" id="username" placeholder="Deixe em branco para não alterar" />
        </div>
        <div class="form-group">
          <label for="password">Nova Senha:</label>
          <input type="password" v-model="usuario.password" id="password" placeholder="Deixe em branco para não alterar" />
        </div>
        <button type="submit" class="submit-button">Alterar</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from '@/axios';
  
  export default {
    data() {
      return {
        usuario: {
          username: '', // Novo nome de usuário (opcional)
          password: ''  // Nova senha (opcional)
        },
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async alterarUsuarioSenha() {
        const idaluno = this.$route.params.iduser; // Obtém o idaluno da rota
        const payload = {};
  
        // Preencher o payload somente com os campos que o usuário deseja alterar
        if (this.usuario.username) {
          payload.username = this.usuario.username;
        }
        if (this.usuario.password) {
          payload.password = this.usuario.password;
        }
  
        if (Object.keys(payload).length === 0) {
          this.errorMessage = 'Nenhuma alteração foi feita.';
          return;
        }
  
        try {
          const response = await axios.patch(`/usuario/${idaluno}`, payload, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.successMessage = 'Usuário e/ou senha alterados com sucesso!';
          this.errorMessage = '';
          console.log('Resposta:', response.data);
        } catch (error) {
          this.errorMessage = 'Erro ao alterar usuário e/ou senha. Tente novamente.';
          this.successMessage = '';
          console.error('Erro ao alterar usuário e/ou senha:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .alterar-usuario-senha-container {
    background-color: #f9f9f9;
    padding: 2em;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 450px;
    margin: 3em auto;
    font-family: 'Arial', sans-serif;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5em;
    color: #333;
    font-size: 1.8em;
  }
  
  .form-group {
    margin-bottom: 1.5em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
    font-size: 1.1em;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 0.75em;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }
  
  input:focus {
    border-color: #007bff;
    outline: none;
  }
  
  button.submit-button {
    width: 100%;
    padding: 0.75em;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px; 
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button.submit-button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    text-align: center;
    margin-top: 1em;
    font-size: 1.1em;
  }
  
  .success {
    color: green;
    text-align: center;
    margin-top: 1em;
    font-size: 1.1em;
  }
  </style>
  