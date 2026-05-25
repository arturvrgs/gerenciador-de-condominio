package com.squad.condominions.repository;

import com.squad.condominions.enums.TipoPost;
import com.squad.condominions.model.Postagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostagemRepository extends JpaRepository<Postagem, Long> {
    List<Postagem> findAllByTipoPost(TipoPost tipoPost);
}
