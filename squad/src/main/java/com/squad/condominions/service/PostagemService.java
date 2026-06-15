package com.squad.condominions.service;

import com.squad.condominions.enums.TipoPost;
import com.squad.condominions.enums.TipoTag;
import com.squad.condominions.enums.TipoUsuario;
import com.squad.condominions.model.Postagem;
import com.squad.condominions.model.Usuario;
import com.squad.condominions.repository.PostagemRepository;
import com.squad.condominions.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostagemService {
    private final PostagemRepository repository;

    private final UsuarioRepository usuarioRepository;

    public PostagemService(
            PostagemRepository repository,
            UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public ResponseEntity<Postagem> criar(Postagem postagem) {

        Long usuarioId = postagem.getUsuario().getId();

        postagem.setUsuario(buscarUsuario(usuarioId));

        if(!ehPermitidoPostar(postagem)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(postagem);
        }

        if(!validarCamposObrigatorios(postagem)) {
            return ResponseEntity.badRequest().body(postagem);
        }

        if(postagem.getTag() == null) {
            postagem.setTag(TipoTag.NULA);
        }

        Postagem postagemSalva = repository.save(postagem);
        return ResponseEntity.ok(postagemSalva);
    }

    @Transactional
    public ResponseEntity<Postagem> atualizar(Long id, Postagem postagem) {
        Postagem existente = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Postagem não encontrada!"));

        existente.setTitulo(postagem.getTitulo());
        existente.setDescricao(postagem.getDescricao());
        existente.setUrlImagem(postagem.getUrlImagem());
        existente.setTag(postagem.getTag());
        existente.setQtdeUpvotes(postagem.getQtdeUpvotes());

        repository.save(existente);

        return ResponseEntity.ok(existente);
    }

    @Transactional
    public ResponseEntity<Postagem> deletar(Long id) {
        Postagem deletada = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postagem não encontrada!"));

        repository.delete(deletada);
        return ResponseEntity.status(HttpStatus.OK).body(deletada);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Postagem> acharPorId(Long id) {
        Postagem achado = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postagem não encontrada!"));

        return ResponseEntity.status(HttpStatus.OK).body(achado);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<Postagem>> listarPorTipoPost(TipoPost tipoPost) {
        return ResponseEntity.ok(repository.findAllByTipoPost(tipoPost));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<Postagem>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    private boolean ehPermitidoPostar(Postagem postagem) {
        boolean ehMorador = postagem.getTipoUsuarioPostagem() == TipoUsuario.MORADOR.getCodigo();
        boolean ehForum = postagem.getTipoPost().getCodigo() == TipoPost.FORUM.getCodigo();
        return !(ehMorador && ehForum);
    }

    private boolean validarCamposObrigatorios(Postagem postagem) {
        return postagem.getTitulo() != null && !postagem.getTitulo().isBlank()
                && postagem.getDescricao() != null && !postagem.getDescricao().isBlank()
                && postagem.getTipoPost() != null
                && postagem.getUsuario() != null;
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
    }

    @Transactional
    public ResponseEntity<Postagem> alternarUpvote(Long id, boolean incrementar) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Postagem não encontrada!");
        }

        if (incrementar) {
            repository.incrementarUpvote(id);
        } else {
            repository.decrementarUpvote(id);
        }

        return ResponseEntity.ok(repository.findById(id).orElseThrow());
    }
}
