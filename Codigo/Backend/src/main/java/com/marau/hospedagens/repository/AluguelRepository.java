package com.marau.hospedagens.repository;

import com.marau.hospedagens.model.Aluguel;
import com.marau.hospedagens.model.enums.StatusAluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findByQuartoResidenciaNome(String nome);
    List<Aluguel> findByClienteIdOrderByEntradaDesc(Long clienteId);
    List<Aluguel> findByStatus(StatusAluguel status);
    long countByStatus(StatusAluguel status);

    @Query("select a from Aluguel a where a.quarto.id = :quartoId and a.status <> 'CONCLUIDO' and " +
            "((a.entrada < :saida and a.saida > :entrada))")
    List<Aluguel> findOverlappingByQuartoIdAndPeriod(@Param("quartoId") Long quartoId,
                                                     @Param("entrada") LocalDateTime entrada,
                                                     @Param("saida") LocalDateTime saida);
}
