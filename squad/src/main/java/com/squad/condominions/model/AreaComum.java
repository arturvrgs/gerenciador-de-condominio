package com.squad.condominions.model;

import com.squad.condominions.enums.EstadoAreaComum;
import jakarta.persistence.*;

@Entity
@Table(name = "areas_comuns")
public class AreaComum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "estado", nullable = false)
    private EstadoAreaComum estado;

    @Column(name = "url_imagem", nullable = true)
    private String urlImagem;

    public AreaComum(String nome, EstadoAreaComum estado, String urlImagem) {
        this.nome = nome;
        this.estado = estado;
        this.urlImagem = urlImagem;
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

    public EstadoAreaComum getEstado() {
        return estado;
    }

    public void setEstado(EstadoAreaComum estado) {
        this.estado = estado;
    }

    public String getUrlImagem() {
        return urlImagem;
    }

    public void setUrlImagem(String urlImagem) {
        this.urlImagem = urlImagem;
    }
}
