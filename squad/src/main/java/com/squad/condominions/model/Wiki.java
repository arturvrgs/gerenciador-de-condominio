package com.squad.condominions.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wikis")
public class Wiki {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_condominio", nullable = false)
    private String nome;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    public Wiki(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
