package com.squad.condominions.model;

import com.squad.condominions.enums.TipoPost;
import com.squad.condominions.enums.TipoTag;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "postagens")
public class Postagem {

    public Postagem() { }

    public Postagem(String urlImagem, String titulo, String descricao, TipoTag tag, Usuario usuario) {
        this.urlImagem = urlImagem;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tag = tag;
        this.usuario = usuario;
        this.qtdeUpvotes = 0;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postagem")
    private Long id;

    @Column(name = "url_imagem", nullable = true)
    private String urlImagem;

    @Column(name = "titulo", nullable = false, length = 50)
    private String titulo;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "qtde_upvotes", nullable = false)
    private int qtdeUpvotes;

    @Column(name = "tag", nullable = true)
    @Enumerated(EnumType.STRING)
    private TipoTag tag;

    @CreationTimestamp
    @Column(name = "data_publicacao", insertable = false, updatable = false)
    private LocalDateTime dataPublicacao;

    @Column(name = "tipo_post", insertable = true, updatable = false, nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoPost tipoPost;

    @UpdateTimestamp
    @Column(name = "ult_atualizacao", insertable = false)
    private LocalDateTime ultAtualizacao;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public Long getId() {
        return id;
    }

    public String getUrlImagem() {
        return urlImagem;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public int getQtdeUpvotes() {
        return qtdeUpvotes;
    }

    public TipoTag getTag() {
        return tag;
    }

    public Character getTagString() {
        return tag.getCodigo();
    }

    public LocalDateTime getDataPublicacao() {
        return dataPublicacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Postagem(String urlImagem, String titulo, String descricao, int qtdeUpvotes, TipoTag tag, Usuario usuario) {
        this.urlImagem = urlImagem;
        this.titulo = titulo;
        this.descricao = descricao;
        this.qtdeUpvotes = qtdeUpvotes;
        this.tag = tag;
        this.usuario = usuario;
    }

    public void setUrlImagem(String urlImagem) {
        this.urlImagem = urlImagem;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setTag(TipoTag tag) {
        this.tag = tag;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getUltAtualizacao() {
        return ultAtualizacao;
    }

    public Character getTipoUsuarioPostagem() {
        return usuario.getTipo().getCodigo();
    }

    public TipoPost getTipoPost() {
        return tipoPost;
    }

    public void setTipoPost(TipoPost tipoPost) {
        this.tipoPost = tipoPost;
    }
}
