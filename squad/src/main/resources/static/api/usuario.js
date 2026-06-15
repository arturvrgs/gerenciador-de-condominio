import { http } from './http.js';

const PATH = '/usuarios';

export const usuarioApi = {
  listar:     ()           => http.get(PATH),
  acharPorId: (id)         => http.get(`${PATH}/${id}`),
  criar:      (usuario)    => http.post(PATH, usuario),
  atualizar:  (id, usuario)=> http.put(`${PATH}/${id}`, usuario),
  deletar:    (id)         => http.delete(`${PATH}/${id}`),
  login: (cpf, senha) => http.post(`${PATH}/login`, { cpf, senha }),
};
