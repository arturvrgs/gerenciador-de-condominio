import { formatarData } from '../utils/utils.js';

export class CardPostagemForum {
  constructor(postagem) {
    this.postagem = postagem;
  }

  render() {
    return `
      <div class="card-post">
        <div style="display:flex;gap:10px;">
          <div class="avatar-post avatar-laranja">
            ${this.postagem.usuario.nome.charAt(0).toUpperCase()}
          </div>

          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
              <span style="font-size:14px;font-weight:600;">
                ${this.postagem.usuario.nome}
              </span>

              <span class="badge-sindico">
                ${this.postagem.usuario.tipo}
              </span>

              <span class="etiqueta etiqueta-normal">
                ${this.postagem.tag}
              </span>
            </div>

            <p style="font-size:15px;font-weight:600;margin-bottom:4px;line-height:1.35;">
              ${this.postagem.titulo}
            </p>

            <p style="font-size:14px;color:var(--texto-secundario);line-height:1.55;">
              ${this.postagem.descricao}
            </p>

            <div style="margin-top:10px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:12px;color:var(--texto-suave);">
                ${formatarData(this.postagem.dataPublicacao)}
              </span>

              <div style="display:flex;gap:4px;margin-left:auto;">
                <button
                  class="btn-fantasma"
                  style="font-size:12px;padding:0.35rem 0.5rem;"
                  onclick="editarPost(this,'forum')">
                  Editar
                </button>

                <button
                  class="btn-fantasma"
                  style="font-size:12px;padding:0.35rem 0.5rem;color:var(--texto-suave);"
                  onclick="alternarPin(this)">
                  Fixar
                </button>

                <button
                  class="btn-perigo"
                  style="font-size:12px;"
                  onclick="excluirPost(this)">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}