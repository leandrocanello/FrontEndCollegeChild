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
          <h2>Cadastro de Turma</h2>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="cadastrarTurma">
          <q-input
            v-model="turma.numeroturma"
            label="Número da Turma"
            outlined
            type="number"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            class="q-mb-md"
          />

          <q-select
            v-model="turma.idprofessor"
            :options="
              professores.map((prof) => ({
                label: prof.nome,
                value: prof.idprofessor,
              }))
            "
            label="Professor"
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

    <!-- Grid com as turmas cadastradas -->
    <q-card flat bordered class="my-card q-mt-md">
      <q-card-section>
        <h3>Turmas Cadastradas</h3>
        <q-table
          :rows="turmas"
          :columns="columns"
          row-key="idturma"
          v-model:pagination="pagination"
          no-data-label="Nenhuma turma cadastrada"
          grid
          flat
          bordered
        >
          <template v-slot:body-cell-professor="props">
            <q-td :props="props">
              {{ props.row.professor_nome }} <!-- Ajuste para professor_nome -->
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "@/axios"; // Usando axios diretamente sem a instância configurada

export default {
  data() {
    return {
      turma: {
        numeroturma: "",
        idprofessor: "",
      },
      professores: [],
      turmas: [], // Para armazenar as turmas
      columns: [
        // Removemos a coluna ID, mantendo apenas Número da Turma e Professor
        {
          name: "numeroturma",
          label: "Número da Turma",
          align: "left",
          field: "numeroturma",
          sortable: true,
        },
        {
          name: "professor",
          label: "Professor",
          align: "left",
          field: "professor_nome",  // Atualizado para professor_nome
          sortable: false,
        },
      ],
      errorMessage: "",
      successMessage: "",
      pagination: { page: 1, rowsPerPage: 10 },
      loading: false,
    };
  },
  created() {
    this.carregarProfessores();
    this.carregarTurmas();
  },
  methods: {
    async carregarProfessores() {
      try {
        const response = await axios.get("/professor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.professores = response.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar lista de professores.";
      }
    },
    async carregarTurmas() {
      try {
        this.loading = true;
        const response = await axios.get("/turma/professor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.turmas = response.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar lista de turmas.";
      } finally {
        this.loading = false;
      }
    },
    async cadastrarTurma() {
      try {
        const response = await axios.post(
          "http://localhost:3000/turma",
          this.turma,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        this.successMessage = "Turma cadastrada com sucesso!";
        this.errorMessage = "";
        // Recarregar a lista de turmas
        this.carregarTurmas();
      } catch (error) {
        this.errorMessage = "Erro ao cadastrar turma. Tente novamente.";
        this.successMessage = "";
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
