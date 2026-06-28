package com.marau.hospedagens.repository;

import com.marau.hospedagens.model.Aluguel;
import com.marau.hospedagens.model.enums.StatusAluguel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findByQuartoResidenciaNome(String nome);
    List<Aluguel> findByClienteIdOrderByEntradaDesc(Long clienteId);
    List<Aluguel> findByStatus(StatusAluguel status);
    long countByStatus(StatusAluguel status);
}
