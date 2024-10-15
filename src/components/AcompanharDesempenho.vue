<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="my-card">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>Desempenho e Frequência dos Alunos</q-toolbar-title>
        </q-toolbar>
      </q-card-section>

      <q-card-section v-if="desempenho.length">
        <q-expansion-item
          v-for="(aluno, index) in desempenho"
          :key="index"
          :label="'Aluno: ' + aluno.nomeCompleto"
          icon="person"
          expand-icon="expand_more"
          dense
        >
          <q-list>
            <q-item
              v-for="(semestre, index) in aluno.semestres"
              :key="index"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label>Semestre {{ semestre.semestre }}</q-item-label>
              </q-item-section>

              <q-list>
                <q-item
                  v-for="(materia, index) in semestre.materias"
                  :key="index"
                >
                  <q-item-section>
                    <q-item-label>{{ materia.nomemateria }}</q-item-label>
                    <q-list dense>
                      <q-item
                        v-for="(nota, index) in materia.notas"
                        :key="index"
                      >
                        <q-item-section>
                          Tipo de Avaliação: {{ nota.tipodeavaliacao }} | Nota:
                          {{ nota.nota }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item>
          </q-list>

          <q-list>
            <q-item-section>
              <h5>Frequência</h5>
              <q-list>
                <q-item
                  v-for="(frequencia, index) in getFrequenciaPorAluno(aluno.idaluno)"
                  :key="index"
                >
                  <q-item-section>
                    <q-item-label>
                      Data da Aula: {{ formatarData(frequencia.diaaula) }} |
                      Presença:
                      <span :class="{ presente: frequencia.presenca, ausente: !frequencia.presenca }">
                        {{ frequencia.presenca ? 'Presente' : 'Ausente' }}
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
          </q-list>
        </q-expansion-item>
      </q-card-section>

      <q-card-section v-else>
        <q-banner color="negative" icon="warning">
          Nenhuma informação de desempenho ou frequência disponível.
        </q-banner>
      </q-card-section>

      <q-card-section v-if="errorMessage">
        <q-banner color="negative" icon="warning">{{ errorMessage }}</q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      desempenho: [], // Dados de desempenho dos alunos
      materias: [], // Lista de matérias
      alunos: [], // Lista de alunos
      frequencias: [], // Dados de frequência dos alunos
      errorMessage: ''
    };
  },
  async created() {
    const idresponsavel = this.$route.params.idresponsavel;
    try {
      // Busca os alunos relacionados ao responsável
      const alunosResponse = await axios.get(`/aluno/responsavel/${idresponsavel}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.alunos = alunosResponse.data;

      // Busca todas as notas de todos os alunos relacionados ao responsável
      const notasResponse = await axios.get(`/nota/${idresponsavel}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const notas = notasResponse.data;

      // Busca todas as matérias
      const materiasResponse = await axios.get('/materia', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.materias = materiasResponse.data;

      // Busca a frequência dos alunos
      const frequenciasResponse = await axios.get(`/frequencia/responsavel/${idresponsavel}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.frequencias = frequenciasResponse.data;

      // Organiza o desempenho associando cada aluno com suas respectivas notas
      this.desempenho = this.alunos.map(aluno => {
        const notasDoAluno = notas.filter(nota => nota.idaluno === aluno.idaluno);
        return {
          idaluno: aluno.idaluno,
          nomeCompleto: `${aluno.nome} ${aluno.sobrenome}`,
          semestres: this.formatarDesempenho(notasDoAluno)
        };
      });
    } catch (error) {
      this.errorMessage = 'Erro ao carregar o desempenho ou a frequência dos alunos.';
      console.error('Erro ao carregar dados:', error);
    }
  },
  methods: {
    // Organiza o desempenho por semestre e matéria
    formatarDesempenho(notas) {
      const semestres = {};
      notas.forEach(nota => {
        if (!semestres[nota.semestre]) {
          semestres[nota.semestre] = { semestre: nota.semestre, materias: {} };
        }
        const materiaNome = this.getNomeMateria(nota.idmateria);
        if (!semestres[nota.semestre].materias[materiaNome]) {
          semestres[nota.semestre].materias[materiaNome] = { nomemateria: materiaNome, notas: [] };
        }
        semestres[nota.semestre].materias[materiaNome].notas.push({
          tipodeavaliacao: nota.tipodeavaliacao,
          nota: nota.nota
        });
      });
      return Object.values(semestres).map(sem => ({
        semestre: sem.semestre,
        materias: Object.values(sem.materias)
      }));
    },

    // Obtém o nome da matéria pelo ID
    getNomeMateria(idmateria) {
      const materia = this.materias.find(m => m.idmateria === idmateria);
      return materia ? materia.nomemateria : 'Desconhecido';
    },

    // Filtra as frequências por ID do aluno
    getFrequenciaPorAluno(idaluno) {
      return this.frequencias.filter(frequencia => frequencia.idaluno === idaluno);
    },

    // Formata a data para um formato mais amigável
    formatarData(dataISO) {
      const data = new Date(dataISO);
      return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }
  }
};
</script>

<style scoped>
.my-card {
  max-width: 800px;
  margin: 0 auto;
}

.presente {
  color: green;
  font-weight: bold;
}

.ausente {
  color: red;
  font-weight: bold;
}
</style>
