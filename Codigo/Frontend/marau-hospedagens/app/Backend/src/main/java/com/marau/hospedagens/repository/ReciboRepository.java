package com.marau.hospedagens.repository;

import com.marau.hospedagens.model.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReciboRepository extends JpaRepository<Recibo, Long> {
    Optional<Recibo> findByAluguelId(Long aluguelId);
    Optional<Recibo> findByNumero(String numero);
}
