package com.squad.condominions.repository;

import com.squad.condominions.enums.TipoPost;
import com.squad.condominions.model.Postagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostagemRepository extends JpaRepository<Postagem, Long> {
    List<Postagem> findAllByTipoPost(TipoPost tipoPost);

    @Modifying
    @Query("UPDATE Postagem p SET p.qtdeUpvotes = p.qtdeUpvotes + 1 WHERE p.id = :id")
    void incrementarUpvote(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Postagem p SET p.qtdeUpvotes = GREATEST(0, p.qtdeUpvotes - 1) WHERE p.id = :id")
    void decrementarUpvote(@Param("id") Long id);
}
