package com.squad.condominions.controller;

import com.squad.condominions.model.Reserva;
import com.squad.condominions.model.Usuario;
import com.squad.condominions.service.ReservaService;
import com.squad.condominions.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("condominions/reservas")
@RestController
public class ReservaController {
    private final ReservaService service;

    public ReservaController(ReservaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Reserva reserva) {
        return service.criar(reserva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Reserva reserva){
        return service.atualizar(id, reserva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Reserva> deletar(@PathVariable Long id) {
        return service.deletar(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> acharPorId(@PathVariable Long id) {
        return service.acharPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<Reserva>> listar() {
        return service.listar();
    }
}
