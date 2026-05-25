package com.squad.condominions.controller;

import com.squad.condominions.model.Usuario;
import com.squad.condominions.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("condominions/usuarios")
public class UsuarioController {
    private final UsuarioService service;

    private UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        return service.criar(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario){
        return service.atualizar(id, usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> deletar(@PathVariable Long id) {
        return service.deletar(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> acharPorId(@PathVariable Long id) {
        return service.acharPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return service.listar();
    }
}
