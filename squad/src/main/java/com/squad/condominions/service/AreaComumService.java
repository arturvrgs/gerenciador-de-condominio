package com.squad.condominions.service;

import com.squad.condominions.model.AreaComum;
import com.squad.condominions.repository.AreaComumRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AreaComumService {
    private final AreaComumRepository repository;
    private final ReservaService reservaService;

    public AreaComumService(AreaComumRepository repository, ReservaService reservaService) {
        this.repository = repository;
        this.reservaService = reservaService;
    }

    @Transactional
    public ResponseEntity<?> criar(AreaComum areaComum) {
        if (!validarCamposObrigatorios(areaComum)) {
            return ResponseEntity.badRequest().body("Campos obrigatórios não preenchidos");
        }

        AreaComum areaSalva = repository.save(areaComum);
        return ResponseEntity.ok(areaSalva);
    }

    @Transactional
    public ResponseEntity<AreaComum> atualizar(Long id, AreaComum areaComum){
        AreaComum existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Área comum não encontrada!"));

        existente.setNome(areaComum.getNome());
        existente.setEstado(areaComum.getEstado());
        existente.setUrlImagem(areaComum.getUrlImagem());

        repository.save(existente);

        return ResponseEntity.ok(existente);
    }

    @Transactional
    public ResponseEntity<AreaComum> deletar(Long id){
        AreaComum deletado = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Área comum não encontrada!"));

        reservaService.deletarReservasPorAreaComumId(id);


        repository.delete(deletado);
        return ResponseEntity.ok(deletado);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<AreaComum> acharPorId(Long id){
        AreaComum existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Área comum não encontrada!"));

        return ResponseEntity.ok(existente);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<AreaComum>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    private boolean validarCamposObrigatorios(AreaComum areaComum) {
        return areaComum.getNome() != null &&
                areaComum.getEstado() != null &&
                 !areaComum.getNome().isEmpty();
    }
}
