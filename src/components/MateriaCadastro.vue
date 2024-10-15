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
          <h2>Cadastro de Matéria</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="cadastrarMateria">
          <q-input
            v-model="nomemateria"
            label="Nome da Matéria"
            outlined
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-btn
            label="Cadastrar Matéria"
            color="primary"
            type="submit"
            class="full-width q-mt-lg"
          />

          <q-banner
            v-if="errorMessage"
            class="q-mt-md"
            color="negative"
            icon="warning"
          >
            {{ errorMessage }}
          </q-banner>

          <q-banner
            v-if="successMessage"
            class="q-mt-md"
            color="positive"
            icon="check_circle"
          >
            {{ successMessage }}
          </q-banner>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Grid com as matérias cadastradas -->
    <q-card flat bordered class="my-card q-mt-md">
      <q-card-section>
        <h3>Matérias Cadastradas</h3>
        <q-table
          :rows="materias"
          :columns="columns"
          row-key="nomemateria"
          v-model:pagination="pagination"
          no-data-label="Nenhuma matéria cadastrada"
          grid
          flat
          bordered
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "@/axios"; // Usando axios diretamente

export default {
  data() {
    return {
      nomemateria: '',
      materias: [], // Lista de matérias
      columns: [
        {
          name: 'nomemateria',
          label: 'Nome da Matéria',
          align: 'left',
          field: 'nomemateria',
          sortable: true
        }
      ],
      errorMessage: '',
      successMessage: '',
      pagination: { page: 1, rowsPerPage: 10 },
      loading: false
    };
  },
  created() {
    this.carregarMaterias();
  },
  methods: {
    async carregarMaterias() {
      try {
        this.loading = true;
        const response = await axios.get('/materia', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.materias = response.data;
      } catch (error) {
        this.errorMessage = 'Erro ao carregar matérias.';
        console.error('Erro ao carregar matérias:', error);
      } finally {
        this.loading = false;
      }
    },
    async cadastrarMateria() {
      try {
        const response = await axios.post('/materia', {
          nomemateria: this.nomemateria,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.successMessage = 'Matéria cadastrada com sucesso!';
        this.errorMessage = '';
        this.nomemateria = ''; // Limpa o campo após o cadastro
        this.carregarMaterias(); // Recarrega a lista de matérias
        console.log('Matéria cadastrada com sucesso:', response.data);
      } catch (error) {
        this.errorMessage = 'Erro ao cadastrar matéria.';
        this.successMessage = '';
        console.error('Erro ao cadastrar matéria:', error);
      }
    }
  }
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
