// Mapeamento de estado para rótulo e classe visual
const ESTADO_VISUAL = {
  DISPONIVEL: { rotulo: 'Disponível', classeStatus: 'status-verde',    classeBadge: 'badge-disponivel' },
  RESERVADA:  { rotulo: 'Reservada',  classeStatus: 'status-amarelo',  classeBadge: 'badge-reservada'  },
  SUSPENSA:   { rotulo: 'Suspensa',   classeStatus: 'status-vermelho', classeBadge: 'badge-suspensa'   },
};

export class CardAreaComum {
  // area      — objeto da API (AreaComum)
  // ehSindico — boolean
  constructor(area, ehSindico) {
    this.area      = area;
    this.ehSindico = ehSindico;
  }

  get estaSuspensa() {
    return this.area.estado === 'SUSPENSA';
  }

  // Renderiza botões de gestão visíveis apenas para o síndico
  _renderizarAcoesSindico() {
    if (!this.ehSindico) return '';

    if (this.estaSuspensa) {
      return `
        <button class="btn-fantasma" style="font-size:13px;color:var(--verde);min-height:40px;"
                onclick="reativarAreaComum(${this.area.id}, this)">Reativar</button>
        <button class="btn-perigo" style="font-size:12px;"
                onclick="excluirAreaComum(${this.area.id})">Excluir</button>
      `;
    }

    return `
      <button class="btn-secundario" style="font-size:13px;min-height:40px;"
              onclick="abrirEdicaoArea(${this.area.id})">Editar</button>
      <button class="btn-fantasma" style="font-size:13px;color:var(--amarelo);min-height:40px;"
              onclick="suspenderAreaComum(${this.area.id}, this)">Suspender</button>
      <button class="btn-perigo" style="font-size:12px;"
              onclick="excluirAreaComum(${this.area.id})">Excluir</button>
    `;
  }

  render() {
    const visual = ESTADO_VISUAL[this.area.estado] || ESTADO_VISUAL.DISPONIVEL;

    return `
      <div class="card-area ${this.estaSuspensa ? 'suspensa' : ''}" id="area-card-${this.area.id}" data-area-id="${this.area.id}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="indicador-status ${visual.classeStatus}"></div>
            <span style="font-size:16px;font-weight:600;">${this.area.nome}</span>
          </div>
          <span class="etiqueta ${visual.classeBadge}" style="font-size:11px;padding:3px 9px;border-radius:20px;">
            ${visual.rotulo}
          </span>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;">
          ${this.estaSuspensa
            ? `<button class="btn-secundario" style="font-size:13px;min-height:40px;flex:1;" disabled>Indisponível</button>`
            : `<button class="btn-primario" style="font-size:13px;min-height:40px;padding:0.5rem 1rem;flex:1;"
                       onclick="abrirModalReserva(${this.area.id}, '${this.area.nome}')">Reservar</button>`
          }
          ${this._renderizarAcoesSindico()}
        </div>
      </div>
    `;
  }
}
