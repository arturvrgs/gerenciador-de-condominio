package com.squad.condominions.controller;

import com.squad.condominions.model.AreaComum;
import com.squad.condominions.model.Wiki;
import com.squad.condominions.service.WikiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("condominions/wiki")
public class WikiController {
    private final WikiService service;

    public WikiController(WikiService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Wiki wiki) {
        return service.criar(wiki);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Wiki> atualizar(@PathVariable Long id, @RequestBody Wiki wiki){
        return service.atualizar(id, wiki);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Wiki> acharPorId(@PathVariable Long id) {
        return service.acharPorId(id);
    }
}
