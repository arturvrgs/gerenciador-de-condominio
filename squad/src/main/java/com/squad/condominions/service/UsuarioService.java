package com.squad.condominions.service;

import com.squad.condominions.model.Usuario;
import com.squad.condominions.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ResponseEntity<?> criar(Usuario usuario) {
        if (validarCamposObrigatorios(usuario)) {
            return ResponseEntity.badRequest().body("Campos obrigatórios não preenchidos");
        }

        Usuario usuarioSalvo = repository.save(usuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @Transactional
    public ResponseEntity<Usuario> atualizar(Long id, Usuario usuario){
        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrada!"));

        existente.setNome(usuario.getNome());
        existente.setSobrenome(usuario.getSobrenome());
        existente.setTipo(usuario.getTipo());
        repository.save(existente);

        return ResponseEntity.ok(existente);
    }

    @Transactional
    public ResponseEntity<Usuario> deletar(Long id){
        Usuario deletado = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
                repository.delete(deletado);
        return ResponseEntity.ok(deletado);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Usuario> acharPorId(Long id){
        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        return ResponseEntity.ok(existente);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    private boolean validarCamposObrigatorios(Usuario usuario) {
        return usuario.getNome() != null &&
                usuario.getSobrenome() != null &&
                 usuario.getTipo() != null &&
                  !usuario.getNome().isBlank() &&
                   !usuario.getSobrenome().isBlank();
    }
}
