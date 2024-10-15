<script>
export default {
  data() {
    return {
      userDetails: null, // Para armazenar os detalhes do usuário
    };
  },
  created() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || token === 'undefined' || token === null || token === '') {
      this.$router.push('/login');
    } else {
      this.redirecionarTela(role); // Redireciona para a tela apropriada
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(`/${route}`);
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      this.$router.push('/login');
    },
    redirecionarTela(role) {
      if (role === 'aluno') {
        this.$router.push('/dashboard/aluno');
      } else if (role === 'responsavel') {
        this.$router.push('/dashboard/responsavel');
      } else if (role === 'professor') {
        this.$router.push('/dashboard/professor');
      } else {
        this.$router.push('/login'); // Caso não reconheça a role, redireciona para o login
      }
    }
  }
};
</script>

