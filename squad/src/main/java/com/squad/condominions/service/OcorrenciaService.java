package com.squad.condominions.service;

import com.squad.condominions.enums.TipoTag;
import com.squad.condominions.model.Ocorrencia;
import com.squad.condominions.model.Usuario;
import com.squad.condominions.repository.OcorrenciaRepository;
import org.aspectj.util.Reflection;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class OcorrenciaService {
    private final OcorrenciaRepository repository;

    public OcorrenciaService(OcorrenciaRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<Ocorrencia> criar(Ocorrencia ocorrencia) {
        if(ocorrencia.getTag() == null) {
            ocorrencia.setTag(TipoTag.NULA);
        }
        Ocorrencia ocorrenciaSalva = repository.save(ocorrencia);
        return ResponseEntity.ok(ocorrenciaSalva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ocorrencia> atualizar(@PathVariable Long id, @RequestBody Ocorrencia ocorrencia) {
        Ocorrencia existente = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Ocorrência não encontrado!")); // Criar erro de NOT FOUND

        existente.setTitulo(ocorrencia.getTitulo());
        existente.setDescricao(ocorrencia.getDescricao());
        existente.setUrlImagem(ocorrencia.getUrlImagem());
        existente.setTag(ocorrencia.getTag());

        return ResponseEntity.ok(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Ocorrencia> deletar(@PathVariable Long id) {
        Ocorrencia deletada = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada!"));

        return ResponseEntity.status(HttpStatus.OK).body(deletada);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> acharPorId(@PathVariable Long id) {
        Ocorrencia achado = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada!"));

        return ResponseEntity.status(HttpStatus.OK).body(achado);
    }


    public ResponseEntity<List<Ocorrencia>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }


}
