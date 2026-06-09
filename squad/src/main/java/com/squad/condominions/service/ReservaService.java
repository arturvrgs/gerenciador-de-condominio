package com.squad.condominions.service;

import com.squad.condominions.model.AreaComum;
import com.squad.condominions.model.Reserva;
import com.squad.condominions.model.Usuario;
import com.squad.condominions.repository.AreaComumRepository;
import com.squad.condominions.repository.ReservaRepository;
import com.squad.condominions.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {
    private final ReservaRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final AreaComumRepository areaComumRepository;

    public ReservaService(ReservaRepository repository,
                          UsuarioRepository usuarioRepository,
                          AreaComumRepository areaComumRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.areaComumRepository = areaComumRepository;
    }

    @Transactional
    public ResponseEntity<?> criar(Reserva reserva) {
        reserva.setUsuario(buscarUsuario(reserva.getUsuario().getId()));
        reserva.setAreaComum(buscarAreaComum(reserva.getAreaComum().getId()));

        Optional<String> erroValidacao = validarDatasReserva(reserva);
        if (erroValidacao.isPresent()) {
            return ResponseEntity.badRequest().body(erroValidacao.get());
        }

        return ResponseEntity.ok(repository.save(reserva));
    }

    @Transactional
    public ResponseEntity<?> atualizar(Long id, Reserva reserva) {
        Reserva existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada!"));

        Optional<String> erroValidacao = validarDatasReserva(reserva);
        if (erroValidacao.isPresent()) {
            return ResponseEntity.badRequest().body(erroValidacao.get());
        }

        existente.setUsuario(buscarUsuario(reserva.getUsuario().getId()));
        existente.setAreaComum(buscarAreaComum(reserva.getAreaComum().getId()));
        existente.setDataInicio(reserva.getDataInicio());
        existente.setDataFim(reserva.getDataFim());

        return ResponseEntity.ok(repository.save(existente));
    }

    @Transactional
    public void deletarReservasPorAreaComumId(Long id) {
        List<Reserva> reservas = repository.findAllByAreaComum_Id(id);
        repository.deleteAll(reservas);
    }

    @Transactional
    public ResponseEntity<Reserva> deletar(Long id) {
        Reserva deletada = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada!"));

        repository.delete(deletada);
        return ResponseEntity.ok(deletada);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Reserva> acharPorId(Long id) {
        Reserva existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada!"));

        return ResponseEntity.ok(existente);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<Reserva>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
    }

    private AreaComum buscarAreaComum(Long id) {
        return areaComumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Área comum não encontrada!"));
    }

    private Optional<String> validarDatasReserva(Reserva reserva) {
        LocalDateTime agora = LocalDateTime.now();

        if (reserva.getDataInicio().isAfter(agora.plusWeeks(1))) {
            return Optional.of("Não é permitido reservar com mais de 1 semana de antecedência");
        }

        if (reserva.getDataInicio().isBefore(agora)) {
            return Optional.of("A data de início não pode ser no passado");
        }

        if (reserva.getDataFim().isBefore(reserva.getDataInicio())) {
            return Optional.of("A data de fim deve ser após a data de início");
        }

        if (Duration.between(reserva.getDataInicio(), reserva.getDataFim()).toHours() > 16) {
            return Optional.of("A reserva não pode ultrapassar 16 horas");
        }

        return Optional.empty();
    }
}