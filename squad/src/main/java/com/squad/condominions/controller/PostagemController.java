package com.squad.condominions.controller;

import com.squad.condominions.model.Postagem;
import com.squad.condominions.service.PostagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("condominions/postagens")
public class PostagemController {
    private final PostagemService service;

    public PostagemController(PostagemService service) {
        this.service = service;
    }

    @PostMapping
    ResponseEntity<Postagem> criar(@RequestBody Postagem postagem) {
        return service.criar(postagem);
    }

    @PutMapping("/{id}")
    ResponseEntity<Postagem> atualizar(@PathVariable Long id, @RequestBody Postagem postagem) {
        return service.atualizar(id, postagem);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Postagem> deletar(@PathVariable Long id) {
        return service.deletar(id);
    }

    @GetMapping("/{id}")
    ResponseEntity<Postagem> acharPorId(@PathVariable Long id) {
        return service.acharPorId(id);
    }

    @GetMapping
    ResponseEntity<List<Postagem>> listar() {
        return service.listar();
    }



}
