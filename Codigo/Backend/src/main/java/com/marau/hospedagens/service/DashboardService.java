package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.AluguelResponse;
import com.marau.hospedagens.dto.DashboardResponse;
import com.marau.hospedagens.model.Aluguel;
import com.marau.hospedagens.model.Quarto;
import com.marau.hospedagens.model.enums.StatusAluguel;
import com.marau.hospedagens.model.enums.StatusQuarto;
import com.marau.hospedagens.repository.AluguelRepository;
import com.marau.hospedagens.repository.ClienteRepository;
import com.marau.hospedagens.repository.QuartoRepository;
import com.marau.hospedagens.repository.ResidenciaRepository;
import com.marau.hospedagens.util.CurrencyUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

/**
 * Reúne os indicadores exibidos no Dashboard (cards de resumo e
 * lista das últimas reservas). Apenas leitura.
 */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final int LIMITE_ULTIMAS_RESERVAS = 5;

    private final ResidenciaRepository residenciaRepository;
    private final QuartoRepository quartoRepository;
    private final ClienteRepository clienteRepository;
    private final AluguelRepository aluguelRepository;
    private final AluguelService aluguelService;

    public DashboardService(ResidenciaRepository residenciaRepository,
                            QuartoRepository quartoRepository,
                            ClienteRepository clienteRepository,
                            AluguelRepository aluguelRepository,
                            AluguelService aluguelService) {
        this.residenciaRepository = residenciaRepository;
        this.quartoRepository = quartoRepository;
        this.clienteRepository = clienteRepository;
        this.aluguelRepository = aluguelRepository;
        this.aluguelService = aluguelService;
    }

    public DashboardResponse resumo() {
        List<Quarto> quartos = quartoRepository.findAll();
        long quartosDisponiveis = quartos.stream()
                .filter(q -> q.getStatus() == StatusQuarto.DISPONIVEL)
                .count();
        long quartosOcupados = quartos.stream()
                .filter(q -> q.getStatus() == StatusQuarto.OCUPADO)
                .count();

        long reservasAtivas = aluguelRepository.countByStatus(StatusAluguel.RESERVA);
        long estadiasEmAndamento = aluguelRepository.countByStatus(StatusAluguel.OCUPADO);
        long estadiasConcluidas = aluguelRepository.countByStatus(StatusAluguel.CONCLUIDO);

        BigDecimal receitaConcluida = somarValores(
                aluguelRepository.findByStatus(StatusAluguel.CONCLUIDO));
        BigDecimal receitaPrevista = somarValores(
                aluguelRepository.findByStatus(StatusAluguel.OCUPADO))
                .add(somarValores(aluguelRepository.findByStatus(StatusAluguel.RESERVA)));

        List<AluguelResponse> ultimasReservas = aluguelRepository.findAll().stream()
                .sorted(Comparator.comparing(Aluguel::getId,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(LIMITE_ULTIMAS_RESERVAS)
                .map(aluguelService::toResponse)
                .toList();

        return new DashboardResponse(
                residenciaRepository.count(),
                quartos.size(),
                quartosDisponiveis,
                quartosOcupados,
                clienteRepository.count(),
                reservasAtivas,
                estadiasEmAndamento,
                estadiasConcluidas,
                CurrencyUtil.formatBRL(receitaConcluida),
                CurrencyUtil.formatBRL(receitaPrevista),
                ultimasReservas
        );
    }

    private BigDecimal somarValores(List<Aluguel> alugueis) {
        return alugueis.stream()
                .map(Aluguel::getValorFinal)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
