import { CardPostagemForum } from './componentes/CardPostagemForum.js';
import { CardOcorrencia }    from './componentes/CardOcorrencia.js';
import { CardAreaComum }     from './componentes/CardAreaComum.js';
import { postagemApi }       from './api/postagem.js';
import { areaComumApi }      from './api/areacomum.js';
import { reservaApi }        from './api/reserva.js';
import { wikiApi }           from './api/wiki.js';
import { usuarioApi } from './api/usuario.js';

// ═══════════════════════════════════════════════
// ESTADO GLOBAL
// ═══════════════════════════════════════════════

// Usuário logado no momento
let usuarioAtual = {
  id:       1,
  nome:     'Artur Vargas',
  perfil:   'sindico', // 'sindico' ou 'morador'
  iniciais: 'A',
};

// Cache de postagens do fórum para edição inline
let postagensForumCache = {};

// Id da postagem sendo editada no fórum (null = criação)
let editandoPostagemForumId = null;

// Cache de ocorrências para edição inline
let ocorrenciasCache = {};

// Id da ocorrência sendo editada (null = criação)
let editandoOcorrenciaId = null;

// Cache de áreas comuns
let areasCache = {};

// Id da área sendo editada (null = criação)
let editandoAreaId = null;

// Id da wiki atual (existe somente uma por condomínio)
let wikiId = null;

// Cache das reservas carregadas (usado para reaplicar o filtro de área sem novo fetch)
let reservasSemanaCache = [];

// Área selecionada para filtrar a grade de "Reservas da semana" ('todas' = sem filtro)
let areaFiltroReservas = 'todas';

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
async function realizarLogin() {
  const cpf   = document.getElementById('campo-cpf').value;
  const senha = document.getElementById('campo-senha').value;

  if (!cpf || !senha) {
    mostrarToast('Preencha CPF e senha');
    return;
  }

  try {
    const usuario = await usuarioApi.login(cpf, senha);
    usuarioAtual = {
      id:       usuario.id,
      nome:     `${usuario.nome} ${usuario.sobrenome}`,
      perfil:   usuario.tipo === 'ADMINISTRADOR' ? 'sindico' : 'morador',
      iniciais: usuario.nome.charAt(0).toUpperCase(),
    };
    aplicarPermissoesDePerfil();
    trocarTela('tela-app');
    carregarForum();
    carregarOcorrencias();
    carregarAreasComuns();
    carregarWiki();
  } catch (erro) {
    mostrarToast('CPF ou senha incorretos');
  }
}

function entrarComo(perfil) {
  if (perfil === 'sindico') {
    usuarioAtual = { id: 1, nome: 'Artur Vargas',   perfil: 'sindico', iniciais: 'A' };
  } else {
    usuarioAtual = { id: 2, nome: 'Gabriel Lacerda', perfil: 'morador', iniciais: 'G' };
  }
  aplicarPermissoesDePerfil();
  trocarTela('tela-app');
  // Carrega dados ao entrar
  carregarForum();
  carregarOcorrencias();
  carregarAreasComuns();
  carregarWiki();
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

  // Atualiza avatares de topo em todas as páginas
  ['forum', 'ocorrencias', 'wiki', 'areas'].forEach(pagina => {
    const elAvatar = document.getElementById('avatar-topo-' + pagina);
    if (elAvatar) elAvatar.textContent = usuarioAtual.iniciais;
  });

  // Atualiza sidebar desktop
  const elAvatarSidebar = document.getElementById('avatar-sidebar');
  const elNomeSidebar   = document.getElementById('nome-sidebar');
  const elBadgeSidebar  = document.getElementById('badge-sidebar');
  if (elAvatarSidebar) elAvatarSidebar.textContent = usuarioAtual.iniciais;
  if (elNomeSidebar)   elNomeSidebar.textContent   = usuarioAtual.nome;
  if (elBadgeSidebar) {
    elBadgeSidebar.textContent = ehSindico ? 'SÍNDICO' : 'MORADOR';
    elBadgeSidebar.className   = ehSindico ? 'badge-sindico' : 'badge-morador';
  }

  // Botões exclusivos do síndico
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

  // FAB de ocorrências é visível para todos
  const fabOcorrencias = document.getElementById('fab-ocorrencias');
  if (fabOcorrencias) fabOcorrencias.style.display = '';
}

// ═══════════════════════════════════════════════
// TROCA DE TELA (login ↔ app)
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
    n.style.color      = 'var(--texto-secundario)';
  });
  const sidebarItem = document.getElementById('sidebar-' + pagina);
  if (sidebarItem) {
    sidebarItem.style.background = 'var(--laranja-palido)';
    sidebarItem.style.color      = 'var(--laranja-principal)';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════
// ABAS (Áreas Comuns)
// ═══════════════════════════════════════════════
function trocarAba(botao, idAba) {
  botao.closest('.barra-abas').querySelectorAll('.btn-aba').forEach(b => b.classList.remove('ativo'));
  botao.classList.add('ativo');
  document.getElementById('aba-lista').style.display    = idAba === 'aba-lista'    ? '' : 'none';
  document.getElementById('aba-reservas').style.display = idAba === 'aba-reservas' ? '' : 'none';

  // Carrega reservas ao acessar a aba
  if (idAba === 'aba-reservas') carregarReservasSemana();
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

  document.getElementById('avatar-drawer').textContent = usuarioAtual.iniciais;
  document.getElementById('nome-drawer').textContent   = usuarioAtual.nome;

  const elBadge       = document.getElementById('badge-drawer');
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
// ESTADO VAZIO GENÉRICO
// ═══════════════════════════════════════════════
function htmlEstadoVazio(mensagem) {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;
                text-align:center;padding-top:4rem;color:var(--texto-suave);">
      <svg width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 9h8"/><path d="M8 13h5"/>
      </svg>
      <p style="font-size:14px;font-weight:500;color:var(--texto-secundario);margin:0;">${mensagem}</p>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// ──────────────── FÓRUM ─────────────────────
// ═══════════════════════════════════════════════

async function carregarForum() {
  const container = document.getElementById('lista-forum');
  try {
    const postagens = await postagemApi.listarPorTipo('FORUM');
    postagensForumCache = {};

    if (!postagens || postagens.length === 0) {
      container.innerHTML = htmlEstadoVazio('Não há avisos no fórum.');
      return;
    }

    // Postagens com tag FIXADO vêm primeiro
    const ordenadas = [...postagens].sort((a, b) => {
      if (a.tag === 'FIXADO' && b.tag !== 'FIXADO') return -1;
      if (b.tag === 'FIXADO' && a.tag !== 'FIXADO') return  1;
      return 0;
    });

    container.innerHTML = '';
    ordenadas.forEach(postagem => {
      postagensForumCache[postagem.id] = postagem;
      const card = new CardPostagemForum(postagem, usuarioAtual.perfil === 'sindico');
      container.innerHTML += card.render();
    });
  } catch (erro) {
    console.error('Erro ao carregar fórum:', erro);
    container.innerHTML = htmlEstadoVazio('Erro ao carregar avisos. Tente novamente.');
  }
}

// Abre o modal de novo aviso (limpa estado de edição)
function abrirModalCriarAviso() {
  document.getElementById('form-novo-aviso').reset();
  document.getElementById('titulo-modal-aviso').textContent  = 'Novo aviso';
  document.getElementById('btn-modal-postagem').textContent  = 'Publicar aviso';
  editandoPostagemForumId = null;
  abrirModal('modal-novo-aviso');
}

// Fecha o modal de aviso e reseta estado
function fecharModalAviso() {
  editandoPostagemForumId = null;
  document.getElementById('titulo-modal-aviso').textContent = 'Novo aviso';
  document.getElementById('btn-modal-postagem').textContent = 'Publicar aviso';
  fecharModal('modal-novo-aviso');
}

// Clique no botão "Editar" de um post do fórum
function editarPost(botao, tipo) {
  if (tipo !== 'forum') return;

  const card    = botao.closest('.card-post');
  const id      = Number(card.dataset.id);
  const postagem = postagensForumCache[id];

  if (!postagem) return;

  document.getElementById('aviso-titulo').value    = postagem.titulo;
  document.getElementById('aviso-descricao').value = postagem.descricao;
  document.getElementById('aviso-tag').value       = postagem.tag || 'NULA';

  document.getElementById('titulo-modal-aviso').textContent = 'Editar aviso';
  document.getElementById('btn-modal-postagem').textContent = 'Salvar alterações';

  editandoPostagemForumId = id;
  abrirModal('modal-novo-aviso');
}

// Submit do formulário de aviso (criar ou editar)
function handleNovaPostagemForum(evento) {
  evento.preventDefault();
  const form = evento.target;

  const dados = {
    titulo:    form.titulo.value.trim(),
    descricao: form.descricao.value.trim(),
    tag:       form.tag.value,
    urlImagem: null,
    tipoPost:  'FORUM',
    usuario:   { id: usuarioAtual.id },
  };

  if (!dados.titulo || !dados.descricao) {
    mostrarToast('Preencha título e descrição');
    return;
  }

  if (editandoPostagemForumId !== null) {
    atualizarPostagemForum(editandoPostagemForumId, dados);
  } else {
    criarPostagemForum(dados);
  }
}

async function criarPostagemForum(dados) {
  try {
    await postagemApi.criar(dados);
    fecharModalAviso();
    mostrarToast('Aviso publicado com sucesso');
    await carregarForum();
  } catch (erro) {
    console.error('Erro ao criar aviso:', erro);
    mostrarToast('Erro ao publicar aviso');
  }
}

async function atualizarPostagemForum(id, dados) {
  try {
    await postagemApi.atualizar(id, dados);
    fecharModalAviso();
    mostrarToast('Aviso atualizado com sucesso');
    await carregarForum();
  } catch (erro) {
    console.error('Erro ao atualizar aviso:', erro);
    mostrarToast('Erro ao atualizar aviso');
  }
}

// Excluir post do fórum
async function excluirPost(botao) {
  if (!confirm('Excluir esta publicação?')) return;

  const card = botao.closest('.card-post');
  const id   = Number(card.dataset.id);

  try {
    await postagemApi.deletar(id);
    mostrarToast('Aviso excluído');
    await carregarForum();
  } catch (erro) {
    console.error('Erro ao excluir aviso:', erro);
    mostrarToast('Erro ao excluir aviso');
  }
}

// Fixar / desafixar post (altera tag via API)
async function alternarPin(botao) {
  const card     = botao.closest('.card-post');
  const id       = Number(card.dataset.id);
  const postagem = postagensForumCache[id];
  if (!postagem) return;

  const novaTag = postagem.tag === 'FIXADO' ? 'NULA' : 'FIXADO';

  try {
    await postagemApi.atualizar(id, { ...postagem, tag: novaTag, usuario: { id: postagem.usuario.id } });
    mostrarToast(novaTag === 'FIXADO' ? 'Aviso fixado no topo' : 'Aviso desafixado');
    await carregarForum();
  } catch (erro) {
    console.error('Erro ao alterar pin:', erro);
    mostrarToast('Erro ao alterar fixação');
  }
}

// ═══════════════════════════════════════════════
// ──────────────── OCORRÊNCIAS ───────────────
// ═══════════════════════════════════════════════

async function carregarOcorrencias() {
  const container = document.getElementById('lista-ocorrencias');
  try {
    const postagens = await postagemApi.listarPorTipo('OCORRENCIA');
    ocorrenciasCache = {};

    if (!postagens || postagens.length === 0) {
      container.innerHTML = htmlEstadoVazio('Não há ocorrências registradas.');
      return;
    }

    container.innerHTML = '';
    postagens.forEach(postagem => {
      ocorrenciasCache[postagem.id] = postagem;
      const ehSindico = usuarioAtual.perfil === 'sindico';
      const card = new CardOcorrencia(postagem, usuarioAtual.id, ehSindico);
      container.innerHTML += card.render();
    });
  } catch (erro) {
    console.error('Erro ao carregar ocorrências:', erro);
    container.innerHTML = htmlEstadoVazio('Erro ao carregar ocorrências. Tente novamente.');
  }
}

// Abre modal de criação de ocorrência
function abrirModalCriarOcorrencia() {
  document.getElementById('form-nova-ocorrencia').reset();
  document.getElementById('titulo-modal-ocorrencia').textContent = 'Nova ocorrência';
  document.getElementById('btn-modal-ocorrencia').textContent    = 'Registrar';
  editandoOcorrenciaId = null;
  abrirModal('modal-nova-ocorrencia');
}

// Fecha modal de ocorrência e reseta estado
function fecharModalOcorrencia() {
  editandoOcorrenciaId = null;
  document.getElementById('titulo-modal-ocorrencia').textContent = 'Nova ocorrência';
  document.getElementById('btn-modal-ocorrencia').textContent    = 'Registrar';
  fecharModal('modal-nova-ocorrencia');
}

// Abre modal preenchido para editar ocorrência
function abrirEdicaoOcorrencia(id) {
  const ocorrencia = ocorrenciasCache[id];
  if (!ocorrencia) return;

  document.getElementById('ocorrencia-titulo').value    = ocorrencia.titulo;
  document.getElementById('ocorrencia-descricao').value = ocorrencia.descricao;
  document.getElementById('ocorrencia-tag').value       = ocorrencia.tag || 'RECLAMACAO';

  document.getElementById('titulo-modal-ocorrencia').textContent = 'Editar ocorrência';
  document.getElementById('btn-modal-ocorrencia').textContent    = 'Salvar alterações';

  editandoOcorrenciaId = id;
  abrirModal('modal-nova-ocorrencia');
}

// Submit do formulário de ocorrência
function handleNovaOcorrencia(evento) {
  evento.preventDefault();
  const form = evento.target;

  const dados = {
    titulo:    form.titulo.value.trim(),
    descricao: form.descricao.value.trim(),
    tag:       form.tag.value,
    urlImagem: null,
    tipoPost:  'OCORRENCIA',
    usuario:   { id: usuarioAtual.id },
  };

  if (!dados.titulo || !dados.descricao) {
    mostrarToast('Preencha título e descrição');
    return;
  }

  if (editandoOcorrenciaId !== null) {
    atualizarOcorrencia(editandoOcorrenciaId, dados);
  } else {
    criarOcorrencia(dados);
  }
}

async function criarOcorrencia(dados) {
  try {
    await postagemApi.criar(dados);
    fecharModalOcorrencia();
    mostrarToast('Ocorrência registrada com sucesso');
    await carregarOcorrencias();
  } catch (erro) {
    console.error('Erro ao registrar ocorrência:', erro);
    mostrarToast('Erro ao registrar ocorrência');
  }
}

async function atualizarOcorrencia(id, dados) {
  try {
    await postagemApi.atualizar(id, dados);
    fecharModalOcorrencia();
    mostrarToast('Ocorrência atualizada com sucesso');
    await carregarOcorrencias();
  } catch (erro) {
    console.error('Erro ao atualizar ocorrência:', erro);
    mostrarToast('Erro ao atualizar ocorrência');
  }
}

async function excluirOcorrencia(id, botao) {
  if (!confirm('Excluir esta ocorrência?')) return;

  try {
    await postagemApi.deletar(id);
    mostrarToast('Ocorrência excluída');
    await carregarOcorrencias();
  } catch (erro) {
    console.error('Erro ao excluir ocorrência:', erro);
    mostrarToast('Erro ao excluir ocorrência');
  }
}

// Up vote — ainda sem endpoint dedicado; incrementa localmente e atualiza via PUT
async function alternarVoto(botao, id) {
  const elContador = botao.querySelector('span');
  const estaAtivo  = botao.classList.toggle('ativo');
  const valorAtual = parseInt(elContador.textContent);

  // Atualiza visualmente de imediato (optimistic update)
  elContador.textContent = estaAtivo ? valorAtual + 1 : valorAtual - 1;

  try {
    const atualizada = await postagemApi.upvote(id, estaAtivo);
    // Sincroniza com o valor real retornado pelo backend
    elContador.textContent = atualizada.qtdeUpvotes;
    ocorrenciasCache[id] = atualizada;
  } catch (erro) {
    // Reverte visualmente em caso de falha
    botao.classList.toggle('ativo');
    elContador.textContent = valorAtual;
    console.error('Erro ao registrar voto:', erro);
    mostrarToast('Erro ao registrar voto');
  }
}

// Filtrar ocorrências por etiqueta (client-side)
function filtrarEtiqueta(botao, etiqueta) {
  document.querySelectorAll('[data-etiqueta]').forEach(card => {
    const visivel = etiqueta === 'todas' || card.dataset.etiqueta === etiqueta.toLowerCase();
    card.style.display = visivel ? '' : 'none';
  });
}

// ═══════════════════════════════════════════════
// ──────────────── WIKI ──────────────────────
// ═══════════════════════════════════════════════

async function carregarWiki() {
  try {
    const wiki = await wikiApi.buscarPrimeira();
    wikiId = wiki.id;
    renderizarConteudoWiki(wiki);
  } catch (erro) {
    console.warn('Wiki não cadastrada ainda:', erro);
    wikiId = null;
  }
}

function renderizarConteudoWiki(wiki) {
  const elNome     = document.getElementById('nome-condominio-wiki');
  const elConteudo = document.getElementById('conteudo-wiki');
  const elData     = document.getElementById('data-atualizacao-wiki');

  if (elNome)     elNome.textContent     = wiki.nome;
  if (elConteudo) elConteudo.textContent = wiki.descricao;
  if (elData)     elData.textContent     = 'Última atualização: ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Abre modal de edição da wiki preenchido com dados atuais
async function abrirModalEditarWiki() {
  if (wikiId) {
    try {
      const wiki = await wikiApi.acharPorId(wikiId);
      document.getElementById('wiki-nome-input').value      = wiki.nome;
      document.getElementById('wiki-descricao-input').value = wiki.descricao;
    } catch (erro) {
      console.error('Erro ao buscar wiki para edição:', erro);
    }
  }
  abrirModal('modal-editar-wiki');
}

// Submit do formulário de wiki
async function handleSalvarWiki() {
  const nome      = document.getElementById('wiki-nome-input').value.trim();
  const descricao = document.getElementById('wiki-descricao-input').value.trim();

  if (!nome || !descricao) {
    mostrarToast('Preencha nome e descrição da wiki');
    return;
  }

  const dados = { nome, descricao };

  try {
    if (wikiId) {
      await wikiApi.atualizar(wikiId, dados);
    } else {
      const criada = await wikiApi.criar(dados);
      wikiId = criada.id;
    }
    fecharModal('modal-editar-wiki');
    mostrarToast('Wiki atualizada com sucesso');
    await carregarWiki();
  } catch (erro) {
    console.error('Erro ao salvar wiki:', erro);
    mostrarToast('Erro ao salvar wiki');
  }
}

// ═══════════════════════════════════════════════
// ──────────────── ÁREAS COMUNS ──────────────
// ═══════════════════════════════════════════════

async function carregarAreasComuns() {
  const container = document.getElementById('lista-areas');
  try {
    const areas = await areaComumApi.listar();
    areasCache = {};

    // Atualiza o filtro de áreas de "Reservas da semana" com dados reais
    popularFiltroAreaReservas(areas || []);

    if (!areas || areas.length === 0) {
      container.innerHTML = htmlEstadoVazio('Nenhuma área comum cadastrada.');
      return;
    }

    container.innerHTML = '';
    areas.forEach(area => {
      areasCache[area.id] = area;
      const ehSindico = usuarioAtual.perfil === 'sindico';
      const card = new CardAreaComum(area, ehSindico);
      container.innerHTML += card.render();
    });

    // Atualiza o select de reserva com as áreas disponíveis
    atualizarSelectAreasReserva(areas);
  } catch (erro) {
    console.error('Erro ao carregar áreas comuns:', erro);
    container.innerHTML = htmlEstadoVazio('Erro ao carregar áreas. Tente novamente.');
  }
}

// Preenche o filtro de área usado na grade de "Reservas da semana" com as áreas reais
function popularFiltroAreaReservas(areas) {
  const seletor = document.getElementById('filtro-area-reservas');
  if (!seletor) return;

  const valorAtual = seletor.value || 'todas';

  seletor.innerHTML = '<option value="todas">Todas as áreas</option>';
  areas.forEach(area => {
    const op = document.createElement('option');
    op.value       = area.id;
    op.textContent = area.nome;
    seletor.appendChild(op);
  });

  // Mantém a seleção anterior caso a área ainda exista; senão volta para "todas"
  const opcaoExiste = [...seletor.options].some(o => o.value === String(valorAtual));
  seletor.value     = opcaoExiste ? valorAtual : 'todas';
  areaFiltroReservas = seletor.value;
}

// Atualiza o <select> de área no modal de reserva
function atualizarSelectAreasReserva(areas) {
  const seletor = document.getElementById('selecionar-area-reserva');
  if (!seletor) return;

  seletor.innerHTML = '';
  areas
    .filter(a => a.estado !== 'SUSPENSA')
    .forEach(area => {
      const op = document.createElement('option');
      op.value       = area.id;
      op.textContent = area.nome;
      seletor.appendChild(op);
    });
}

// Abre modal de nova área (cria)
function abrirModalCriarArea() {
  document.getElementById('form-area').reset();
  document.getElementById('titulo-modal-area').textContent = 'Nova área comum';
  document.getElementById('btn-modal-area').textContent    = 'Criar área';
  editandoAreaId = null;
  abrirModal('modal-nova-area');
}

// Fecha modal de área e reseta estado
function fecharModalArea() {
  editandoAreaId = null;
  fecharModal('modal-nova-area');
}

// Abre modal preenchido para editar área
function abrirEdicaoArea(id) {
  const area = areasCache[id];
  if (!area) return;

  document.getElementById('area-nome').value   = area.nome;
  document.getElementById('area-estado').value = area.estado;

  document.getElementById('titulo-modal-area').textContent = 'Editar área';
  document.getElementById('btn-modal-area').textContent    = 'Salvar alterações';

  editandoAreaId = id;
  abrirModal('modal-nova-area');
}

// Submit do formulário de área
function handleSalvarArea(evento) {
  evento.preventDefault();
  const form = evento.target;

  const dados = {
    nome:   form.nome.value.trim(),
    estado: form.estado.value,
  };

  if (!dados.nome || !dados.estado) {
    mostrarToast('Preencha nome e estado da área');
    return;
  }

  if (editandoAreaId !== null) {
    atualizarAreaComum(editandoAreaId, dados);
  } else {
    criarAreaComum(dados);
  }
}

async function criarAreaComum(dados) {
  try {
    await areaComumApi.criar(dados);
    fecharModalArea();
    mostrarToast('Área criada com sucesso');
    await carregarAreasComuns();
  } catch (erro) {
    console.error('Erro ao criar área:', erro);
    mostrarToast('Erro ao criar área');
  }
}

async function atualizarAreaComum(id, dados) {
  try {
    await areaComumApi.atualizar(id, dados);
    fecharModalArea();
    mostrarToast('Área atualizada com sucesso');
    await carregarAreasComuns();
  } catch (erro) {
    console.error('Erro ao atualizar área:', erro);
    mostrarToast('Erro ao atualizar área');
  }
}

async function excluirAreaComum(id) {
  if (!confirm('Excluir esta área e cancelar todas as reservas vinculadas?')) return;
  try {
    await areaComumApi.deletar(id);
    mostrarToast('Área excluída');
    await carregarAreasComuns();
  } catch (erro) {
    console.error('Erro ao excluir área:', erro);
    mostrarToast('Erro ao excluir área');
  }
}

async function suspenderAreaComum(id) {
  const area = areasCache[id];
  if (!area) return;
  try {
    await areaComumApi.atualizar(id, { ...area, estado: 'SUSPENSA' });
    mostrarToast('Área suspensa com sucesso');
    await carregarAreasComuns();
  } catch (erro) {
    console.error('Erro ao suspender área:', erro);
    mostrarToast('Erro ao suspender área');
  }
}

async function reativarAreaComum(id) {
  const area = areasCache[id];
  if (!area) return;
  try {
    await areaComumApi.atualizar(id, { ...area, estado: 'DISPONIVEL' });
    mostrarToast('Área reativada com sucesso');
    await carregarAreasComuns();
  } catch (erro) {
    console.error('Erro ao reativar área:', erro);
    mostrarToast('Erro ao reativar área');
  }
}

// ═══════════════════════════════════════════════
// ──────────────── RESERVAS ──────────────────
// ═══════════════════════════════════════════════

// Abre modal de reserva pré-selecionando área, data e período (quando vindos da grade)
function abrirModalReserva(idArea, nomeArea, dataStr, periodoValor) {
  definirLimitesDataReserva();

  const seletor = document.getElementById('selecionar-area-reserva');
  if (seletor && idArea) seletor.value = idArea;

  const campoData = document.getElementById('data-reserva');
  if (campoData && dataStr) campoData.value = dataStr;

  const campoPeriodo = document.getElementById('periodo-reserva');
  if (campoPeriodo && periodoValor) campoPeriodo.value = periodoValor;

  abrirModal('modal-reservar');
}

// Compatibilidade com chamadas antigas
function definirAreaReserva(nomeArea) {
  const seletor = document.getElementById('selecionar-area-reserva');
  if (!seletor) return;
  for (let i = 0; i < seletor.options.length; i++) {
    if (seletor.options[i].text === nomeArea) { seletor.selectedIndex = i; break; }
  }
}

// Confirma reserva, envia para API e exibe código
async function confirmarReserva() {
  const idArea        = document.getElementById('selecionar-area-reserva').value;
  const dataStr       = document.getElementById('data-reserva').value;
  const periodoValor  = document.getElementById('periodo-reserva').value;

  if (!idArea || !dataStr || !periodoValor) {
    mostrarToast('Preencha todos os campos da reserva');
    return;
  }

  // Monta dataInicio e dataFim com base no período
  const [horaInicio, horaFim] = periodoValor.split('-');
  const dataInicio = `${dataStr}T${horaInicio}:00`;
  const dataFim    = `${dataStr}T${horaFim}:00`;

  // Valida que a reserva está dentro dos próximos 7 dias
  const hoje            = new Date();
  const dataSelecionada = new Date(dataInicio);
  const diferencaDias   = (dataSelecionada - hoje) / (1000 * 60 * 60 * 24);

  if (diferencaDias > 7 || diferencaDias < -1) {
    mostrarToast('Só é possível reservar dentro dos próximos 7 dias');
    return;
  }

  const dados = {
    usuario:   { id: usuarioAtual.id },
    areaComum: { id: Number(idArea) },
    dataInicio,
    dataFim,
  };

  try {
    await reservaApi.criar(dados);
    fecharModal('modal-reservar');

    // Gera código de acesso aleatório (visual — backend não retorna código ainda)
    const caracteres = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) codigo += '-';
      codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    document.getElementById('codigo-gerado').textContent = codigo;
    abrirModal('modal-codigo');

    await carregarAreasComuns();
    await carregarReservasSemana();
  } catch (erro) {
    console.error('Erro ao criar reserva:', erro);
    mostrarToast('Erro ao confirmar reserva: ' + erro.message);
  }
}

// Carrega e renderiza a tabela de reservas dos próximos dias
async function carregarReservasSemana() {
  const container = document.getElementById('container-grade-reservas');
  if (!container) return;

  try {
    const reservas = await reservaApi.listar();
    reservasSemanaCache = reservas;
    renderizarGradeReservas(reservas);
  } catch (erro) {
    console.error('Erro ao carregar reservas:', erro);
  }
}

// Renderiza a grade de reservas a partir de hoje (próximos 7 dias)
function renderizarGradeReservas(reservas) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    dias.push(d);
  }

  const nomeDiasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const periodos       = [
    { rotulo: '08h–12h', inicio: 8,  fim: 12, valor: '08:00-12:00' },
    { rotulo: '13h–18h', inicio: 13, fim: 18, valor: '13:00-18:00' },
    { rotulo: '19h–23h', inicio: 19, fim: 23, valor: '19:00-23:00' },
  ];

  // Filtra pela área selecionada no <select> de filtro (quando aplicável)
  const reservasFiltradas = areaFiltroReservas === 'todas'
    ? reservas
    : reservas.filter(r => String(r.areaComum?.id) === String(areaFiltroReservas));

  // Monta índice de reservas por dia+período
  const reservasPorCelula = {};
  reservasFiltradas.forEach(r => {
    const dataInicio = new Date(r.dataInicio);
    const chave      = `${dataInicio.toDateString()}-${dataInicio.getHours()}`;
    reservasPorCelula[chave] = r;
  });

  let html = '<div class="grade-reservas" style="min-width:560px;">';

  // Cabeçalho
  html += '<div class="celula-reserva cabecalho"></div>';
  dias.forEach(dia => {
    const diaNum = String(dia.getDate()).padStart(2, '0');
    const mesNum = String(dia.getMonth() + 1).padStart(2, '0');
    html += `<div class="celula-reserva cabecalho">${nomeDiasSemana[dia.getDay()]} ${diaNum}/${mesNum}</div>`;
  });

  // Linhas por período
  periodos.forEach(periodo => {
    html += `<div class="celula-reserva rotulo-hora">${periodo.rotulo}</div>`;
    dias.forEach(dia => {
      const chave   = `${dia.toDateString()}-${periodo.inicio}`;
      const reserva = reservasPorCelula[chave];

      if (reserva) {
        const nomeUsuario = reserva.usuario?.nome || 'Reservado';
        const nomeArea    = reserva.areaComum?.nome || '';
        html += `<div class="celula-reserva ocupada" title="${nomeUsuario} — ${nomeArea}">
                   ${nomeUsuario.split(' ')[0]}<br/>${nomeArea}
                 </div>`;
      } else {
        // Pré-preenche data e período do slot clicado; mantém a área filtrada, se houver
        const dataStr     = formatarDataISO(dia);
        const idAreaAtual = areaFiltroReservas !== 'todas' ? `'${areaFiltroReservas}'` : 'null';
        html += `<div class="celula-reserva disponivel"
                      onclick="abrirModalReserva(${idAreaAtual}, null, '${dataStr}', '${periodo.valor}')">+</div>`;
      }
    });
  });

  html += '</div>';
  document.getElementById('container-grade-reservas').innerHTML = html;
}

// Aplica o filtro de área selecionado na grade de "Reservas da semana"
function filtrarAreaReservas(valor) {
  areaFiltroReservas = valor;
  renderizarGradeReservas(reservasSemanaCache);
}

// ═══════════════════════════════════════════════
// LABEL DO PERÍODO E LIMITES DO INPUT DE DATA
// ═══════════════════════════════════════════════

// Formata uma data como YYYY-MM-DD respeitando o horário local (evita
// deslocamento de dia causado por toISOString(), que usa UTC)
function formatarDataISO(d) {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Define o rótulo do período (hoje até hoje+6) e os limites do input de data
function definirLimitesDataReserva() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const fim = new Date(hoje);
  fim.setDate(hoje.getDate() + 6);

  const formatar = d =>
    `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;

  const elRotulo = document.getElementById('rotulo-semana');
  if (elRotulo) elRotulo.textContent = `${formatar(hoje)} a ${formatar(fim)}`;

  const campoData = document.getElementById('data-reserva');
  if (campoData) {
    const hojeStr = formatarDataISO(hoje);
    const fimStr  = formatarDataISO(fim);
    campoData.min   = hojeStr;
    campoData.max   = fimStr;
    campoData.value = hojeStr;
  }
}

// Compatibilidade com chamadas antigas
function definirLabelSemana() {
  definirLimitesDataReserva();
}

// ═══════════════════════════════════════════════
// EXPOSIÇÃO GLOBAL (chamadas via onclick no HTML)
// ═══════════════════════════════════════════════
Object.assign(window, {
  // Auth
  aplicarMascaraCPF,
  realizarLogin,
  entrarComo,
  realizarLogout,
  abrirModalEsqueciSenha,
  // Navegação
  mostrarPagina,
  trocarAba,
  // Modais
  abrirModal,
  fecharModal,
  fecharModalFora,
  // Drawer
  abrirDrawerPerfil,
  fecharDrawerPerfil,
  // Fórum
  abrirModalCriarAviso,
  fecharModalAviso,
  handleNovaPostagemForum,
  editarPost,
  excluirPost,
  alternarPin,
  // Ocorrências
  abrirModalCriarOcorrencia,
  fecharModalOcorrencia,
  abrirEdicaoOcorrencia,
  handleNovaOcorrencia,
  excluirOcorrencia,
  alternarVoto,
  filtrarEtiqueta,
  // Wiki
  abrirModalEditarWiki,
  handleSalvarWiki,
  // Áreas comuns
  abrirModalCriarArea,
  fecharModalArea,
  abrirEdicaoArea,
  handleSalvarArea,
  excluirAreaComum,
  suspenderAreaComum,
  reativarAreaComum,
  // Reservas
  abrirModalReserva,
  definirAreaReserva,
  confirmarReserva,
  definirLabelSemana,
  definirLimitesDataReserva,
  filtrarAreaReservas,
});

// ═══════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════
definirLabelSemana();
