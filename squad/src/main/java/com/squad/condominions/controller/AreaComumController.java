package com.squad.condominions.controller;

import com.squad.condominions.model.AreaComum;
import com.squad.condominions.service.AreaComumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("condominions/areas-comuns")
public class AreaComumController {
    private final AreaComumService service;

    public AreaComumController(AreaComumService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody AreaComum areaComum) {
        return service.criar(areaComum);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AreaComum> atualizar(@PathVariable Long id, @RequestBody AreaComum areaComum){
        return service.atualizar(id, areaComum);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AreaComum> deletar(@PathVariable Long id) {
        return service.deletar(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaComum> acharPorId(@PathVariable Long id) {
        return service.acharPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<AreaComum>> listar() {
        return service.listar();
    }
}
