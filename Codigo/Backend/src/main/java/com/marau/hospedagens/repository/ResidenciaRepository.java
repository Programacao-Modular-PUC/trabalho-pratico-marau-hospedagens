package com.marau.hospedagens.repository;

import com.marau.hospedagens.model.Residencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResidenciaRepository extends JpaRepository<Residencia, Long> {
    Optional<Residencia> findByNome(String nome);
    boolean existsByNome(String nome);
}
