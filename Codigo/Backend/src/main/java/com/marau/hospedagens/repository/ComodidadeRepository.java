package com.marau.hospedagens.repository;

import com.marau.hospedagens.model.Comodidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComodidadeRepository extends JpaRepository<Comodidade, Long> {
    Optional<Comodidade> findByNome(String nome);
    boolean existsByNome(String nome);
}
