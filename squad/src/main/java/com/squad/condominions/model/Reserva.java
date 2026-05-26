package com.squad.condominions.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_areacomum", nullable = false)
    private AreaComum areaComum;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDateTime dataFim;

    public Reserva() {}

    public Reserva(Usuario usuario, AreaComum areaComum,
                   LocalDateTime dataInicio, LocalDateTime dataFim) {
        this.usuario   = usuario;
        this.areaComum = areaComum;
        this.dataInicio    = dataInicio;
        this.dataFim       = dataFim;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public AreaComum getAreaComum() { return areaComum; }
    public void setAreaComum(AreaComum areaComum) { this.areaComum = areaComum; }

    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setInicio(LocalDateTime inicio) { this.dataInicio = inicio; }

    public LocalDateTime getDataFim() { return dataFim; }
    public void setFim(LocalDateTime fim) { this.dataFim = fim; }
}