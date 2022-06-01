import { http } from './config'

export default {
  salvar:(usuario)=>{
    return http.post('usuario', usuario);
  },

  listar:()=>{
    return http.get('/usuarios');
   },

  listarUsersPorNome:(nome)=>{
    return http.get('/usuarios',{params:{nome:nome}});
	},

  // findAllByNome: (nome: string) => {
  //   const usuarios = _usuarios
  //     .filter((u) => u.nome.toLowerCase().includes(nome.toLowerCase()))
  //     .map((usuario) => new Usuario(usuario.id, usuario.nome));
  //   return usuarios;
  // }
}