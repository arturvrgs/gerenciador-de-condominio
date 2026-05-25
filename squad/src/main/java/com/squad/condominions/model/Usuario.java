package com.squad.condominions.model;

import com.squad.condominions.enums.TipoUsuario;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "sobrenome", nullable = false)
    private String sobrenome;

    @Column(name = "tipo", nullable = false)
    private TipoUsuario tipo;
}
