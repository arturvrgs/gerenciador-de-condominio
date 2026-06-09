import { CardPostagemForum } from './componentes/CardPostagemForum.js';
import { postagemApi } from './api/postagem.js';

// ═══════════════════════════════════════════════
// ESTADO DO USUÁRIO ATUAL
// ═══════════════════════════════════════════════
let usuarioAtual = {
  nome: 'Artur Vargas',
  perfil: 'sindico', /* 'sindico' ou 'morador' */
  iniciais: 'A'
};

// ═══════════════════════════════════════════════
// MÁSCARA DE CPF
// ═══════════════════════════════════════════════
function aplicarMascaraCPF(campo) {
  let valor = campo.value.replace(/\D/g, '');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  campo.value = valor;
}

// ═══════════════════════════════════════════════
// AUTENTICAÇÃO
// ═══════════════════════════════════════════════
function realizarLogin() {
  const cpf   = document.getElementById('campo-cpf').value;
  const senha = document.getElementById('campo-senha').value;
  if (!cpf || !senha) {
    mostrarToast('Preencha CPF e senha');
    return;
  }
  entrarComo('sindico');
}

function entrarComo(perfil) {
  if (perfil === 'sindico') {
    usuarioAtual = { nome: 'Artur Vargas', perfil: 'sindico', iniciais: 'A' };
  } else {
    usuarioAtual = { nome: 'Gabriel Lacerda', perfil: 'morador', iniciais: 'G' };
  }
  aplicarPermissoesDePerfil();
  trocarTela('tela-app');
}

function realizarLogout() {
  fecharDrawerPerfil();
  trocarTela('tela-login');
}

function abrirModalEsqueciSenha() {
  abrirModal('modal-esqueci-senha');
}

// ═══════════════════════════════════════════════
// PERMISSÕES POR PERFIL
// ═══════════════════════════════════════════════
function aplicarPermissoesDePerfil() {
  const ehSindico = usuarioAtual.perfil === 'sindico';

  ['forum','ocorrencias','wiki','areas'].forEach(pagina => {
    const elAvatar = document.getElementById('avatar-topo-' + pagina);
    if (elAvatar) elAvatar.textContent = usuarioAtual.iniciais;
  });

  const elAvatarSidebar = document.getElementById('avatar-sidebar');
  const elNomeSidebar   = document.getElementById('nome-sidebar');
  const elBadgeSidebar  = document.getElementById('badge-sidebar');
  if (elAvatarSidebar) elAvatarSidebar.textContent = usuarioAtual.iniciais;
  if (elNomeSidebar)   elNomeSidebar.textContent   = usuarioAtual.nome;
  if (elBadgeSidebar) {
    elBadgeSidebar.textContent  = ehSindico ? 'SÍNDICO' : 'MORADOR';
    elBadgeSidebar.className    = ehSindico ? 'badge-sindico' : 'badge-morador';
  }

  const botoesSindico = [
    'btn-novo-aviso',
    'btn-editar-wiki',
    'btn-nova-area',
    'btn-editar-wiki-mobile',
    'btn-nova-area-mobile',
    'fab-forum',
  ];

  botoesSindico.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = ehSindico ? '' : 'none';
  });

  const acoesAdminArea = [
    'acao-editar-area-salao','acao-suspender-area-salao','acao-excluir-area-salao',
    'acao-editar-area-piscina','acao-suspender-area-piscina','acao-excluir-area-piscina',
    'acao-reativar-area-academia','acao-excluir-area-academia',
  ];

  acoesAdminArea.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = ehSindico ? '' : 'none';
  });

  ['acoes-forum-1','acoes-forum-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = ehSindico ? '' : 'none';
  });

  const acoesPropriosMorador = document.querySelectorAll('.acoes-proprio');
  acoesPropriosMorador.forEach(el => {
    const cardPai = el.closest('[data-proprio]');
    if (ehSindico) {
      el.style.display = 'flex';
    } else {
      el.style.display = (cardPai && cardPai.dataset.proprio === 'true') ? 'flex' : 'none';
    }
  });

  const fabOcorrencias = document.getElementById('fab-ocorrencias');
  if (fabOcorrencias) fabOcorrencias.style.display = '';
}

// ═══════════════════════════════════════════════
// TROCA DE TELAS (login ↔ app)
// ═══════════════════════════════════════════════
function trocarTela(idTela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  document.getElementById(idTela).classList.add('ativa');
}

// ═══════════════════════════════════════════════
// NAVEGAÇÃO ENTRE PÁGINAS
// ═══════════════════════════════════════════════
function mostrarPagina(pagina) {
  document.querySelectorAll('.conteudo-principal').forEach(p => p.classList.remove('ativo'));
  document.getElementById('pagina-' + pagina).classList.add('ativo');

  document.querySelectorAll('.item-nav').forEach(n => n.classList.remove('ativo'));
  const navItem = document.getElementById('nav-' + pagina);
  if (navItem) navItem.classList.add('ativo');

  document.querySelectorAll('.item-nav-sidebar').forEach(n => {
    n.style.background = 'none';
    n.style.color = 'var(--texto-secundario)';
  });
  const sidebarItem = document.getElementById('sidebar-' + pagina);
  if (sidebarItem) {
    sidebarItem.style.background = 'var(--laranja-palido)';
    sidebarItem.style.color      = 'var(--laranja-principal)';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════
// ABAS
// ═══════════════════════════════════════════════
function trocarAba(botao, idAba) {
  botao.closest('.barra-abas').querySelectorAll('.btn-aba').forEach(b => b.classList.remove('ativo'));
  botao.classList.add('ativo');

  document.getElementById('aba-lista').style.display     = idAba === 'aba-lista'    ? '' : 'none';
  document.getElementById('aba-reservas').style.display  = idAba === 'aba-reservas' ? '' : 'none';
}

// ═══════════════════════════════════════════════
// MODAIS (bottom sheets)
// ═══════════════════════════════════════════════
function abrirModal(id) {
  document.getElementById(id).classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('aberto');
  document.body.style.overflow = '';
}

function fecharModalFora(evento, id) {
  if (evento.target === document.getElementById(id)) fecharModal(id);
}

// ═══════════════════════════════════════════════
// DRAWER DE PERFIL
// ═══════════════════════════════════════════════
function abrirDrawerPerfil() {
  const ehSindico = usuarioAtual.perfil === 'sindico';

  document.getElementById('avatar-drawer').textContent  = usuarioAtual.iniciais;
  document.getElementById('nome-drawer').textContent    = usuarioAtual.nome;

  const elBadge    = document.getElementById('badge-drawer');
  elBadge.textContent = ehSindico ? 'SÍNDICO' : 'MORADOR';
  elBadge.className   = ehSindico ? 'badge-sindico' : 'badge-morador';

  document.getElementById('drawer-perfil').classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

function fecharDrawerPerfil(evento) {
  if (!evento || evento.target === document.getElementById('drawer-perfil')) {
    document.getElementById('drawer-perfil').classList.remove('aberto');
    document.body.style.overflow = '';
  }
}

// ═══════════════════════════════════════════════
// TOAST DE NOTIFICAÇÃO
// ═══════════════════════════════════════════════
let temporizadorToast = null;

function mostrarToast(mensagem) {
  const elToast = document.getElementById('toast-aviso');
  document.getElementById('mensagem-toast').textContent = mensagem;
  elToast.classList.add('visivel');

  if (temporizadorToast) clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => {
    elToast.classList.remove('visivel');
  }, 2800);
}

// ═══════════════════════════════════════════════
// VOTO POSITIVO (up vote com toggle)
// ═══════════════════════════════════════════════
function alternarVoto(botao) {
  const elContador = botao.querySelector('span');
  const estaAtivo  = botao.classList.toggle('ativo');
  const contadorAtual = parseInt(elContador.textContent);
  elContador.textContent = estaAtivo ? contadorAtual + 1 : contadorAtual - 1;
}

// ═══════════════════════════════════════════════
// EXCLUIR POST
// ═══════════════════════════════════════════════
function excluirPost(botao) {
  if (!confirm('Excluir esta publicação?')) return;
  botao.closest('.card-post').remove();
  mostrarToast('Publicação excluída');
}

// ═══════════════════════════════════════════════
// FIXAR / DESAFIXAR POST (PIN)
// ═══════════════════════════════════════════════
function alternarPin(botao) {
  const card     = botao.closest('.card-post');
  const estaFixo = card.classList.toggle('fixado');
  botao.textContent = estaFixo ? 'Desafixar' : 'Fixar';
  mostrarToast(estaFixo ? 'Aviso fixado no topo' : 'Aviso desafixado');
}

// ═══════════════════════════════════════════════
// EDITAR POST
// ═══════════════════════════════════════════════
function editarPost(botao, tipo) {
  abrirModal(tipo === 'forum' ? 'modal-novo-aviso' : 'modal-nova-ocorrencia');
}

// ═══════════════════════════════════════════════
// ENVIAR AVISO NO FÓRUM
// ═══════════════════════════════════════════════
function enviarAviso() {
  fecharModal('modal-novo-aviso');
  mostrarToast('Aviso publicado com sucesso');
}

// ═══════════════════════════════════════════════
// REGISTRAR OCORRÊNCIA
// ═══════════════════════════════════════════════
function enviarOcorrencia() {
  fecharModal('modal-nova-ocorrencia');
  mostrarToast('Ocorrência registrada');
}

// ═══════════════════════════════════════════════
// FILTRAR OCORRÊNCIAS POR ETIQUETA
// ═══════════════════════════════════════════════
function filtrarEtiqueta(botao, etiqueta) {
  document.querySelectorAll('[data-etiqueta]').forEach(card => {
    const visivel = etiqueta === 'todas' || card.dataset.etiqueta === etiqueta;
    card.style.display = visivel ? '' : 'none';
  });
}

// ═══════════════════════════════════════════════
// ÁREAS COMUNS — SUSPENDER / REATIVAR / EXCLUIR
// ═══════════════════════════════════════════════
function suspenderArea(idArea, botao) {
  const card = document.getElementById(idArea);
  card.classList.add('suspensa');

  botao.textContent   = 'Reativar';
  botao.style.color   = 'var(--verde)';
  botao.onclick       = function() { reativarArea(idArea, botao); };

  mostrarToast('Área suspensa com sucesso');
}

function reativarArea(idArea, botao) {
  const card = document.getElementById(idArea);
  card.classList.remove('suspensa');

  botao.textContent   = 'Suspender';
  botao.style.color   = 'var(--amarelo)';
  botao.onclick       = function() { suspenderArea(idArea, botao); };

  mostrarToast('Área reativada com sucesso');
}

function excluirArea(idArea) {
  if (!confirm('Excluir esta área e cancelar todas as reservas vinculadas?')) return;
  document.getElementById(idArea).remove();
  mostrarToast('Área excluída');
}

// ═══════════════════════════════════════════════
// RESERVAS — DEFINIR ÁREA PRÉ-SELECIONADA
// ═══════════════════════════════════════════════
function definirAreaReserva(nomeArea) {
  const seletor = document.getElementById('selecionar-area-reserva');
  if (!seletor) return;
  for (let i = 0; i < seletor.options.length; i++) {
    if (seletor.options[i].text === nomeArea) {
      seletor.selectedIndex = i;
      break;
    }
  }
}

// ═══════════════════════════════════════════════
// CONFIRMAR RESERVA E GERAR CÓDIGO DE ACESSO
// ═══════════════════════════════════════════════
function confirmarReserva() {
  const campoData = document.getElementById('data-reserva');
  const dataEscolhida = campoData.value;

  if (dataEscolhida) {
    const hoje        = new Date();
    const dataSelecionada = new Date(dataEscolhida + 'T00:00:00');
    const diferencaDias   = (dataSelecionada - hoje) / (1000 * 60 * 60 * 24);

    if (diferencaDias > 7 || diferencaDias < -1) {
      mostrarToast('Só é possível reservar dentro da semana corrente');
      return;
    }
  }

  fecharModal('modal-reservar');

  const caracteres = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) codigo += '-';
    codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
  }

  document.getElementById('codigo-gerado').textContent = codigo;
  abrirModal('modal-codigo');
}

// ═══════════════════════════════════════════════
// LABEL DA SEMANA E LIMITES DO INPUT DE DATA
// ═══════════════════════════════════════════════
function definirLabelSemana() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();

  const difParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() + difParaSegunda);

  const domingo = new Date(segunda);
  domingo.setDate(segunda.getDate() + 6);

  const formatar = d =>
    `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;

  const elRotulo = document.getElementById('rotulo-semana');
  if (elRotulo) elRotulo.textContent = `${formatar(segunda)} a ${formatar(domingo)}`;

  const campoData = document.getElementById('data-reserva');
  if (campoData) {
    const hojeStr   = hoje.toISOString().split('T')[0];
    const domingoStr = domingo.toISOString().split('T')[0];
    campoData.min   = hojeStr;
    campoData.max   = domingoStr;
    campoData.value = hojeStr;
  }
}

// ═══════════════════════════════════════════════
// LISTAR POSTAGENS DO FÓRUM
// ═══════════════════════════════════════════════
async function listarPostagensForum() {
   let container = document.getElementById('lista-forum');
   let retorno = await postagemApi.listar();
   
   retorno.forEach(postagem => {
      const card = new CardPostagemForum(postagem);
      container.innerHTML += card.render();
   })
}

Object.assign(window, {
  aplicarMascaraCPF,
  realizarLogin,
  entrarComo,
  realizarLogout,
  abrirModalEsqueciSenha,
  mostrarPagina,
  trocarAba,
  abrirModal,
  fecharModal,
  fecharModalFora,
  abrirDrawerPerfil,
  fecharDrawerPerfil,
  alternarVoto,
  excluirPost,
  alternarPin,
  editarPost,
  enviarAviso,
  enviarOcorrencia,
  filtrarEtiqueta,
  suspenderArea,
  reativarArea,
  excluirArea,
  definirAreaReserva,
  confirmarReserva
});

// ═══════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════
listarPostagensForum();
definirLabelSemana();
