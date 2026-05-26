package com.squad.condominions.repository;

import com.squad.condominions.enums.TipoPost;
import com.squad.condominions.model.Postagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostagemRepository extends JpaRepository<Postagem, Long> {
    List<Postagem> findAllByTipoPost(TipoPost tipoPost);
}
