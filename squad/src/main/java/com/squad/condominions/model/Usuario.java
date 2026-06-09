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
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;

    @Column(name = "cpf", nullable = false)
    private String cpf;

    @Column(name = "senha", nullable = false)
    private String senha;

    public Usuario() {}

    public Usuario(String nome, String sobrenome, TipoUsuario tipo, String cpf, String senha) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.tipo = tipo;
        this.cpf = cpf;
        this.senha = senha;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
