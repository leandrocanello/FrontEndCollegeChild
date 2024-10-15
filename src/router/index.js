import { createRouter, createWebHistory } from 'vue-router';
import loginUser from '@/components/loginUser.vue';
import Dashboard from '@/components/DashboardIni.vue';
import DashboardAluno from '@/components/DashboardAluno.vue';
import DashboardProfessor from '@/components/DashboardProfessor.vue';
import DashboardResponsavel from '@/components/DashboardResponsavel.vue';
import CadastroMateria from '@/components/MateriaCadastro.vue'; // Importe o novo componente
import CadastroTurma from '@/components/CadastroTurma.vue';
import CadastroAluno from '@/components/CadastroAluno.vue';
import CadastroUsuario from '@/components/CadastroUsuario.vue';
import CadastroFrequencia from '@/components/CadastroFrequencia.vue';
import CadastroResponsavel from '@/components/CadastroResponsavel.vue';
import CadastroNota from '@/components/CadastroNota.vue';
import VisualizarMaterias from '@/components/VisualizarMaterias.vue';
import VisualizarNotas from '@/components/VisualizarNotas.vue';
import VisualizarTurmas from '@/components/VisualizarTurmas.vue';
import AlterarUsuarioSenha from '@/components/AlterarUsuarioSenha.vue';
import AcompanharDesempenho from '@/components/AcompanharDesempenho.vue';
import EnviarMensagem from '@/components/EnviarMensagem.vue';
import VincularAlunoMateria from '@/components/VincularAlunoMateria.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: loginUser
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/aluno',
    name: 'DashboardAluno',
    component: DashboardAluno,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/professor',
    name: 'DashboardProfessor',
    component: DashboardProfessor,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/responsavel',
    name: 'DashboardResponsavel',
    component: DashboardResponsavel,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroMateria', // Adicione a nova rota
    name: 'CadastroMateria',
    component: CadastroMateria,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroTurma',
    name: 'CadastroTurma',
    component: CadastroTurma,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroAluno',
    name: 'CadastroAluno',
    component: CadastroAluno,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroUsuario/:alunoId',
    name: 'CadastroUsuario',
    component: CadastroUsuario,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroFrequencia',
    name: 'CadastroFrequencia',
    component: CadastroFrequencia,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroResponsavel',
    name: 'CadastroResponsavel',
    component: CadastroResponsavel,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroNota',
    name: 'CadastroNota',
    component: CadastroNota,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/aluno/materias/:idaluno',
    name: 'VisualizarMaterias',
    component: VisualizarMaterias,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/aluno/notas/:idaluno',
    name: 'VisualizarNotas',
    component: VisualizarNotas,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/aluno/turmas/:idaluno',
    name: 'VisualizarTurmas',
    component: VisualizarTurmas,
    meta: { requiresAuth: true }
  },
  {
    path: '/alterarUsuarioSenha/:iduser',
    name: 'AlterarUsuarioSenha',
    component: AlterarUsuarioSenha,
    meta: { requiresAuth: true } // Certifique-se de que essa rota requer autenticação
  },
  {
    path: '/dashboard/responsavel/desempenho/:idresponsavel',
    name: 'AcompanharDesempenho',
    component: AcompanharDesempenho,
    meta: { requiresAuth: true }
  },
  {
    path: '/enviarMensagem',
    name: 'EnviarMensagem',
    component: EnviarMensagem,
    meta: { requiresAuth: true }
  },
  {
    path: '/vincularAlunoMateria',
    name: 'VincularAlunoMateria',
    component: VincularAlunoMateria,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/aluno/frequencias/:idaluno',
    name: 'FrequenciaAluno',
    component: () => import('@/components/FrequenciaAluno.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastroProfessor',
    name: 'CadastroProfessor',
    component: () => import('@/components/CadastroProfessor.vue'), // Importe o componente da tela de cadastro de professor
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Verificação global de autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!localStorage.getItem('token');

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
