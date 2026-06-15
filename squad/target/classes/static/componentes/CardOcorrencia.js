import { formatarData } from '../utils/utils.js';

// Mapeamento de etiqueta para classe CSS e rótulo legível
const ETIQUETA_CLASSE = {
  RECLAMACAO: { classe: 'etiqueta-reclamacao', rotulo: 'Reclamação' },
  ELOGIO:     { classe: 'etiqueta-elogio',     rotulo: 'Elogio'     },
  NULA:       { classe: '',                    rotulo: ''            },
};

export class CardOcorrencia {
  // postagem    — objeto da API
  // idUsuarioAtual — id do usuário logado
  // ehSindico   — boolean
  constructor(postagem, idUsuarioAtual, ehSindico) {
    this.postagem        = postagem;
    this.idUsuarioAtual  = idUsuarioAtual;
    this.ehSindico       = ehSindico;
  }

  // Verifica se o usuário logado é o autor do post
  get ehAutor() {
    return this.postagem.usuario.id === this.idUsuarioAtual;
  }

  // Renderiza as ações de editar/excluir respeitando as permissões
  _renderizarAcoes() {
    // Síndico controla tudo; morador só gerencia o próprio post
    if (!this.ehSindico && !this.ehAutor) return '';

    return `
      <div class="acoes-proprio" style="display:flex;gap:4px;margin-left:auto;">
        <button class="btn-fantasma" style="font-size:12px;padding:0.35rem 0.5rem;"
                onclick="abrirEdicaoOcorrencia(${this.postagem.id})">Editar</button>
        <button class="btn-perigo" style="font-size:12px;"
                onclick="excluirOcorrencia(${this.postagem.id}, this)">Excluir</button>
      </div>
    `;
  }

  render() {
    const etiqueta = ETIQUETA_CLASSE[this.postagem.tag] || ETIQUETA_CLASSE.NULA;
    const inicialAvatar = this.postagem.usuario.nome.charAt(0).toUpperCase();
    const corAvatar = this.ehAutor ? 'avatar-azul' : 'avatar-verde';

    return `
      <div class="card-post" data-id="${this.postagem.id}" data-etiqueta="${(this.postagem.tag || '').toLowerCase()}">
        <div style="display:flex;gap:10px;">
          <div class="avatar-post ${corAvatar}">${inicialAvatar}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
              <span style="font-size:14px;font-weight:600;">${this.postagem.usuario.nome}</span>
              <span class="${this.postagem.usuario.tipo === 'ADMINISTRADOR' ? 'badge-sindico' : 'badge-morador'}">
                ${this.postagem.usuario.tipo === 'ADMINISTRADOR' ? 'Síndico' : 'Morador'}
              </span>
              ${etiqueta.rotulo ? `<span class="etiqueta ${etiqueta.classe}">${etiqueta.rotulo}</span>` : ''}
            </div>

            <p style="font-size:15px;font-weight:600;margin-bottom:4px;line-height:1.35;">
              ${this.postagem.titulo}
            </p>
            <p style="font-size:14px;color:var(--texto-secundario);line-height:1.55;">
              ${this.postagem.descricao}
            </p>

            <div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <button class="btn-voto" onclick="alternarVoto(this, ${this.postagem.id})">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                <span>${this.postagem.qtdeUpvotes}</span>
              </button>
              <span style="font-size:12px;color:var(--texto-suave);">
                ${formatarData(this.postagem.dataPublicacao)}
              </span>
              ${this._renderizarAcoes()}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
