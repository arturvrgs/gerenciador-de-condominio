import { formatarData } from '../utils/utils.js';

// Mapeamento de tag para classe CSS e rótulo legível
const TAG_VISUAL = {
  FIXADO:    { classe: 'etiqueta-alerta',     rotulo: 'Fixado'    },
  ALERTA:    { classe: 'etiqueta-urgente',    rotulo: 'Alerta'    },
  ELOGIO:    { classe: 'etiqueta-elogio',     rotulo: 'Elogio'    },
  RECLAMACAO:{ classe: 'etiqueta-reclamacao', rotulo: 'Reclamação'},
  NULA:      { classe: '',                    rotulo: ''           },
};

export class CardPostagemForum {
  // postagem  — objeto da API
  // ehSindico — boolean; controla visibilidade dos botões de gestão
  constructor(postagem, ehSindico) {
    this.postagem  = postagem;
    this.ehSindico = ehSindico;
  }

  get estaFixado() {
    return this.postagem.tag === 'FIXADO';
  }

  // Renderiza ações apenas para síndico
  _renderizarAcoes() {
    if (!this.ehSindico) return '';

    const labelPin = this.estaFixado ? 'Desafixar' : 'Fixar';

    return `
      <div style="display:flex;gap:4px;margin-left:auto;">
        <button class="btn-fantasma" style="font-size:12px;padding:0.35rem 0.5rem;"
                onclick="editarPost(this,'forum')">Editar</button>
        <button class="btn-fantasma" style="font-size:12px;padding:0.35rem 0.5rem;color:var(--texto-suave);"
                onclick="alternarPin(this)">${labelPin}</button>
        <button class="btn-perigo" style="font-size:12px;"
                onclick="excluirPost(this)">Excluir</button>
      </div>
    `;
  }

  render() {
    const tag     = TAG_VISUAL[this.postagem.tag] || TAG_VISUAL.NULA;
    const inicial = this.postagem.usuario.nome.charAt(0).toUpperCase();

    return `
      <div class="card-post ${this.estaFixado ? 'fixado' : ''}" data-id="${this.postagem.id}">
        <div style="display:flex;gap:10px;">
          <div class="avatar-post avatar-laranja">${inicial}</div>

          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
              <span style="font-size:14px;font-weight:600;">${this.postagem.usuario.nome}</span>
              <span class="badge-sindico">Síndico</span>
              ${tag.rotulo ? `<span class="etiqueta ${tag.classe}">${tag.rotulo}</span>` : ''}
              ${this.estaFixado ? `<svg width="12" height="12" fill="none" stroke="var(--laranja-principal)"
                stroke-width="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="17" x2="12" y2="22"/>
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
              </svg>` : ''}
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
              ${this._renderizarAcoes()}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}