package com.squad.condominions.service;

import com.squad.condominions.model.AreaComum;
import com.squad.condominions.model.Postagem;
import com.squad.condominions.model.Usuario;
import com.squad.condominions.model.Wiki;
import com.squad.condominions.repository.WikiRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class WikiService {
    private final WikiRepository repository;

    public WikiService(WikiRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ResponseEntity<?> criar(Wiki wiki) {
        if (wiki.getNome().isEmpty() || wiki.getDescricao().isEmpty()) {
            return ResponseEntity.badRequest().body("Campos obrigatórios não preenchidos");
        }

        Wiki wikiSalva = repository.save(wiki);
        return ResponseEntity.ok(wikiSalva);
    }

    @Transactional
    public ResponseEntity<Wiki> atualizar(Long id, Wiki wiki){
        Wiki existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wiki não encontrada!"));

        existente.setNome(wiki.getNome());
        existente.setNome(wiki.getNome());
        repository.save(existente);

        return ResponseEntity.ok(existente);
    }

    @Transactional
    public ResponseEntity<Wiki> acharPorId(Long id) {
        Wiki achado = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wiki não encontrada!"));

        return ResponseEntity.status(HttpStatus.OK).body(achado);
    }
}
