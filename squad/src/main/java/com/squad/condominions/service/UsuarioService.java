package com.squad.condominions.service;

import com.squad.condominions.model.Usuario;
import com.squad.condominions.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;

import java.util.List;


public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<?> criar(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getSobrenome() == null || usuario.getTipo() == null) {
            return ResponseEntity.badRequest().body("Campos obrigatórios não preenchidos");
        }

        Usuario usuarioSalvo = repository.save(usuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    public ResponseEntity<Usuario> atualizar(Long id, Usuario usuario){
        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrada!"));

        existente.setNome(usuario.getNome());
        existente.setSobrenome(usuario.getSobrenome());

        return ResponseEntity.ok(existente);
    }

    public ResponseEntity<Usuario> deletar(Long id){
        Usuario deletado = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
                repository.delete(deletado);
        return ResponseEntity.ok(deletado);
    }

    public ResponseEntity<Usuario> acharPorId(Long id){
        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        return ResponseEntity.ok(existente);
    }

    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

}
