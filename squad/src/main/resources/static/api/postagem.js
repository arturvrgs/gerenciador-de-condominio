import { http } from './http.js';

const PATH = '/postagens';

// tipoPost: 'FORUM' | 'OCORRENCIA'
export const postagemApi = {
  listar:          ()              => http.get(PATH),
  listarPorTipo:   (tipoPost)      => http.get(`${PATH}/tipo/${tipoPost}`),
  acharPorId:      (id)            => http.get(`${PATH}/${id}`),
  criar:           (postagem)      => http.post(PATH, postagem),
  atualizar:       (id, postagem)  => http.put(`${PATH}/${id}`, postagem),
  deletar:         (id)            => http.delete(`${PATH}/${id}`),
};