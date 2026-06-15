package com.squad.condominions.repository;

import com.squad.condominions.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> { 
    void deleteByAreaComum_Id(Long areaComumId);
    List<Reserva> findAllByAreaComum_Id(Long areaComumId);
    @Query("""
        SELECT COUNT(r) > 0 FROM Reserva r
        WHERE r.areaComum.id = :idArea
        AND r.id <> :idExcluir
        AND r.dataInicio < :dataFim
        AND r.dataFim > :dataInicio
    """)
    boolean existeConflito(
            @Param("idArea") Long idArea,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            @Param("idExcluir") Long idExcluir
    );
}
