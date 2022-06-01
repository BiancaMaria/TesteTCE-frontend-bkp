<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper blue darken-1">
        <a href="#" class="brand-logo center">Lista de Tarefas</a>
      </div>
    </nav>

    <div class="container">
      <ul>
        <li v-for="(erro, index) of errors" :key="index">
          campo <b>{{ erro.field }}</b> - {{ erro.defaultMessage }}
        </li>
      </ul>

      <form @submit.prevent="salvar">
        <label>Descrição</label>
        <input type="text" placeholder="Descrição" v-model="tarefa.descricao" />
        <label>Data</label>
        <input type="date" placeholder="Data" v-model="tarefa.data" />
        <label>Usuário da api</label>

        <div class="input-field">
          <select style="display:block" v-model="usuario.nome">
            <option value="" hidden>Selecione</option>
            <option v-for="(user, index) of usuarios" :key="index">
              {{user.nome}}
            </option>
          </select>
          <hr />
          Selected: {{ usuario.nome }}
        </div>

        <div class="input-group">
          <label>Status</label>
        </div>
        <p>
          <label>
            <input
              name="group1"
              type="radio"
              checked
              value="false"
              v-model="picked"
            />
            <span>Pendente</span>
          </label>
        </p>
        <p>
          <label>
            <input name="group1" type="radio" value="true" v-model="picked" />
            <span>Finalizado</span>
          </label>
        </p>
        <p>
          <span>Picked: {{ picked }}</span>
        </p>

        <button class="waves-effect waves-light btn-small purple">
          Salvar<i class="material-icons left">save</i>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>DESCRIÇÃO</th>
            <th>DATA</th>
            <th>USUÁRIO</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="tarefa of tarefas" :key="tarefa.id">
            <td>{{ tarefa.descricao }}</td>
            <td>{{ tarefa.data }}</td>
            <td>{{ tarefa.usuario.nome }}</td>
            <td>{{ tarefa.completada }}</td>
            <td>
              <button
                @click="editar(tarefa)"
                class="waves-effect btn-small blue darken-1"
              >
                <i class="material-icons">create</i>
              </button>
              <button
                @click="remover(tarefa.id)"
                class="waves-effect btn-small red darken-1"
              >
                <i class="material-icons">delete_sweep</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Tarefa from "./services/tarefas";
import Usuario from "./services/usuarios";

export default {
  name: "app",
  data() {
    return {
      tarefa: {
        id: "",
        descricao: "",
        data: "",
        usuario: "",
        completada: [],
      },
      usuario: {
        id: "",
        nome: "",
      },
      info: null,
      selectedUser: "",
      search: "",
      picked: "",
      tarefas: [],
      usuarios: [],
      errors: [],
    };
  },
  // watch: {
  //   selectedUser: function() {
  //     //fazer a requisicao que lista usuarios da api
  //     Usuario.listar()
  //       .then((resposta) => {
  //         this.usuarios = resposta.data;
  //         //console.log(resposta.data);
          
  //       })
  //   },
  // },

  mounted() {
    this.listarTarefas();
    this.listarUsuarios();
    
  },
  methods: {
    listarUsuarios() {
      //fazer a requisicao que lista usuarios da api - copia acima
      Usuario.listar()
        .then((resposta) => {
          this.usuarios = resposta.data;
        })
        .catch((e) => {
          console.log(e);
          console.log("deu errado user");
        });
    },

    listarTarefas() {
      Tarefa.listar()
        .then((resposta) => {
          this.tarefas = resposta.data;
          console.log(resposta.data + "tarefas");
        })
        .catch((e) => {
          console.log(e);
          console.log("deu errado");
        });
    },

    listarTarefasPorDescricao(descricao) {
      Tarefa.listarTarefasPorDescricao(descricao)
        .then((resposta) => {
          this.tarefas = resposta.data;
          console.log("descricao");
        })
        .catch((e) => {
          console.log(e);
          console.log("deu errado");
        });
    },

    salvar() {
      if (!this.tarefa.id) {
        Tarefa.salvar(this.tarefa)
          .then((resposta) => {
            this.resposta = resposta;
            this.tarefa = {};
            alert("Cadastrado com sucesso!");
            this.listar();
            this.errors = {};
          })
          .catch((e) => {
            this.errors = e.response.data.errors;
          });
      } else {
        Tarefa.atualizar(this.tarefa)
          .then((resposta) => {
            this.resposta = resposta;
            this.tarefa = {};
            this.errors = {};
            alert("Atualizado com sucesso!");
            this.listar();
          })
          .catch((e) => {
            this.errors = e.response.data.errors;
          });
      }
    },
    editar(tarefa) {
      this.tarefa = tarefa;
    },

    remover(id) {
      console.log("removido");
      if (confirm("Deseja excluir a tarefa?")) {
        Tarefa.apagar(id)
          .then((resposta) => {
            this.resposta = resposta.data;
            this.listar();
            this.errors = {};
          })
          .catch((e) => {
            this.errors = e.response.data.errors;
          });
      }
    },

    clearFilter() {
      this.search = "";
      this.selected = null;
    },

    filteredItems() {
      let items = [];
      items = this.items.filter((item) => {
        return (
          item.descricao.toLowerCase().indexOf(this.search.toLowerCase()) >
            -1 ||
          item.usuario.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        );
      });
      return items;
    },
  },
};
</script>

<style></style>
