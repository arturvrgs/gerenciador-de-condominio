package com.squad.condominions.model;

import com.squad.condominions.enums.EstadoAreaComum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "areas_comuns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AreaComum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoAreaComum estado;

    @Column(name = "url_imagem")
    private String urlImagem;
}