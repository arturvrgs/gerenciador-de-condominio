package com.squad.condominions.controller;

import com.squad.condominions.model.Ocorrencia;
import com.squad.condominions.service.OcorrenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("condominions/ocorrencias")
public class OcorrenciaController {
    private final OcorrenciaService service;

    public OcorrenciaController(OcorrenciaService service) {
        this.service = service;
    }

    @PostMapping
    ResponseEntity<Ocorrencia> criar(@RequestBody Ocorrencia ocorrencia) {
        return service.criar(ocorrencia);
    }

    @PutMapping("/{id}")
    ResponseEntity<Ocorrencia> atualizar(@PathVariable Long id, @RequestBody Ocorrencia ocorrencia) {
        return service.atualizar(id, ocorrencia);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Ocorrencia> deletar(@PathVariable Long id) {
        return service.deletar(id);
    }

    @GetMapping("/{id}")
    ResponseEntity<Ocorrencia> acharPorId(@PathVariable Long id) {
        return service.acharPorId(id);
    }

    @GetMapping
    ResponseEntity<List<Ocorrencia>> listar() {
        return service.listar();
    }



}
