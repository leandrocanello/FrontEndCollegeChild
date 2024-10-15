<template>
    <div class="cadastro-container">
      <h2>Cadastro de Usuário</h2>
      <form @submit.prevent="cadastrarUsuario">
        <div class="form-group">
          <label for="usuario">Usuário:</label>
          <input type="text" v-model="usuario.usuario" id="usuario" required />
        </div>
        <div class="form-group">
          <label for="senha">Senha:</label>
          <input type="password" v-model="usuario.senha" id="senha" required />
        </div>
        <button type="submit" class="submit-button">Cadastrar</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  // código do script permanece o mesmo
  </script>
  
  <style scoped>
  .cadastro-container {
    background-color: #ffffff;
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
  }
  
  .form-group {
    margin-bottom: 1.5em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
    font-size: 1.1em;
    color: #333;
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
  }
  
  .success {
    color: green;
    text-align: center;
    margin-top: 1em;
  }
  </style>
  