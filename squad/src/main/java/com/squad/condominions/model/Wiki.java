package com.squad.condominions.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wikis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Wiki {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_condominio", nullable = false)
    private String nome;

    @Column(name = "descricao", nullable = false)
    private String descricao;
}