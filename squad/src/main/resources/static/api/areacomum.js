import { http } from './http.js';
 
const PATH = '/areas-comuns';
 
export const areaComumApi = {
  listar:     ()              => http.get(PATH),
  acharPorId: (id)            => http.get(`${PATH}/${id}`),
  criar:      (area)          => http.post(PATH, area),
  atualizar:  (id, area)      => http.put(`${PATH}/${id}`, area),
  deletar:    (id)            => http.delete(`${PATH}/${id}`),
};
 