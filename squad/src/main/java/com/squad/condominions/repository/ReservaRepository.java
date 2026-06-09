package com.squad.condominions.repository;

import com.squad.condominions.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> { 
    void deleteByAreaComum_Id(Long areaComumId);
    List<Reserva> findAllByAreaComum_Id(Long areaComumId);
}
