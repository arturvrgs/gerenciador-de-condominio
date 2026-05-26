package com.squad.condominions.service;

import com.squad.condominions.enums.TipoPost;
import com.squad.condominions.enums.TipoTag;
import com.squad.condominions.enums.TipoUsuario;
import com.squad.condominions.model.Postagem;
import com.squad.condominions.model.Usuario;
import com.squad.condominions.repository.PostagemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class PostagemService {
    private final PostagemRepository repository;

    public PostagemService(PostagemRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ResponseEntity<Postagem> criar(Postagem postagem) {

        if(verificarPermissaoPostagem(postagem)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(postagem);
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
                    .orElseThrow(() -> new RuntimeException("Postagem não encontrada!")); // Criar erro de NOT FOUND

        existente.setTitulo(postagem.getTitulo());
        existente.setDescricao(postagem.getDescricao());
        existente.setUrlImagem(postagem.getUrlImagem());
        existente.setTag(postagem.getTag());

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

    private boolean verificarPermissaoPostagem(Postagem postagem) {
        return postagem.getTipoUsuarioPostagem() == TipoUsuario.MORADOR.getCodigo()
                && postagem.getTipoPost().getCodigo() == TipoPost.FORUM.getCodigo();
    }

}
