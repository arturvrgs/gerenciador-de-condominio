package com.squad.condominions.repository;

import com.squad.condominions.model.AreaComum;
import com.squad.condominions.model.Wiki;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WikiRepository extends JpaRepository<Wiki, Long> { }