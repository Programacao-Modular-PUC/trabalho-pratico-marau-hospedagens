package com.marau.hospedagens.repository;

import com.marau.hospedagens.model.Quarto;
import com.marau.hospedagens.model.enums.TipoQuarto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuartoRepository extends JpaRepository<Quarto, Long> {
    List<Quarto> findByResidenciaId(Long residenciaId);
    List<Quarto> findByResidenciaNome(String nome);
    List<Quarto> findByResidenciaNomeAndTipo(String nome, TipoQuarto tipo);
    List<Quarto> findByTipo(TipoQuarto tipo);
}
