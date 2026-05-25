package com.squad.condominions.service;

import com.squad.condominions.enums.TipoTag;
import com.squad.condominions.model.Postagem;
import com.squad.condominions.repository.PostagemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class PostagemService {
    private final PostagemRepository repository;

    public PostagemService(PostagemRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<Postagem> criar(Postagem postagem) {
        if(postagem.getTag() == null) {
            postagem.setTag(TipoTag.NULA);
        }
        Postagem postagemSalva = repository.save(postagem);
        return ResponseEntity.ok(postagemSalva);
    }

    public ResponseEntity<Postagem> atualizar(@PathVariable Long id, @RequestBody Postagem postagem) {
        Postagem existente = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Postagem não encontrada!")); // Criar erro de NOT FOUND

        existente.setTitulo(postagem.getTitulo());
        existente.setDescricao(postagem.getDescricao());
        existente.setUrlImagem(postagem.getUrlImagem());
        existente.setTag(postagem.getTag());

        return ResponseEntity.ok(existente);
    }

    public ResponseEntity<Postagem> deletar(@PathVariable Long id) {
        Postagem deletada = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postagem não encontrada!"));

        return ResponseEntity.status(HttpStatus.OK).body(deletada);
    }

    public ResponseEntity<Postagem> acharPorId(@PathVariable Long id) {
        Postagem achado = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postagem não encontrada!"));

        return ResponseEntity.status(HttpStatus.OK).body(achado);
    }

    public ResponseEntity<List<Postagem>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }


}
