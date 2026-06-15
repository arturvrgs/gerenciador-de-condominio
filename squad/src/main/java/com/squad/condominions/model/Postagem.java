package com.squad.condominions.model;

import com.squad.condominions.enums.TipoPost;
import com.squad.condominions.enums.TipoTag;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "postagens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postagem")
    private Long id;

    @Column(name = "url_imagem")
    private String urlImagem;

    @Column(name = "titulo", nullable = false, length = 50)
    private String titulo;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "qtde_upvotes", nullable = false)
    private int qtdeUpvotes;

    @Column(name = "tag")
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

    public Character getTagCodigo() {
        return tag != null ? tag.getCodigo() : null;
    }

    public Character getTipoUsuarioPostagem() {
        return usuario.getTipo().getCodigo();
    }
}