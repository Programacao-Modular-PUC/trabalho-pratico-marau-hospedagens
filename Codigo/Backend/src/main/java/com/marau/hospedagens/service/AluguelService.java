package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.AluguelRequest;
import com.marau.hospedagens.dto.AluguelResponse;
import com.marau.hospedagens.exception.DataInvalidaException;
import com.marau.hospedagens.exception.QuartoIndisponivelException;
import com.marau.hospedagens.exception.ResourceNotFoundException;
import com.marau.hospedagens.model.Aluguel;
import com.marau.hospedagens.model.Cliente;
import com.marau.hospedagens.model.Quarto;
import com.marau.hospedagens.model.Residencia;
import com.marau.hospedagens.model.enums.StatusAluguel;
import com.marau.hospedagens.model.enums.StatusQuarto;
import com.marau.hospedagens.repository.AluguelRepository;
import com.marau.hospedagens.repository.ClienteRepository;
import com.marau.hospedagens.util.CurrencyUtil;
import com.marau.hospedagens.util.DateUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AluguelService {

    private final AluguelRepository aluguelRepository;
    private final ClienteRepository clienteRepository;
    private final QuartoService quartoService;

    public AluguelService(AluguelRepository aluguelRepository,
                          ClienteRepository clienteRepository,
                          QuartoService quartoService) {
        this.aluguelRepository = aluguelRepository;
        this.clienteRepository = clienteRepository;
        this.quartoService = quartoService;
    }

    /** Lista, com filtro opcional por residencia (nome). */
    public List<AluguelResponse> listar(String residencia) {
        List<Aluguel> alugueis;
        if (residencia != null && !residencia.isBlank() && !residencia.equalsIgnoreCase("Todas")) {
            alugueis = aluguelRepository.findByQuartoResidenciaNome(residencia);
        } else {
            alugueis = aluguelRepository.findAll();
        }
        return alugueis.stream().map(this::toResponse).toList();
    }

    public AluguelResponse buscar(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public Aluguel buscarEntidade(Long id) {
        return aluguelRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Aluguel", id));
    }

    @Transactional
    public AluguelResponse criar(AluguelRequest req) {
        validarPeriodo(req);

        Cliente cliente = clienteRepository.findById(req.clienteId())
                .orElseThrow(() -> ResourceNotFoundException.of("Cliente", req.clienteId()));
        Quarto quarto = quartoService.buscarEntidade(req.quartoId());
        validarDisponibilidade(quarto.getId(), req);

        int diarias = calcularDiarias(req);
        BigDecimal precoDiaria = quarto.getPreco();
        BigDecimal valorFinal = precoDiaria.multiply(BigDecimal.valueOf(diarias));
        StatusAluguel status = StatusAluguel.fromLabel(req.status());

        Aluguel aluguel = Aluguel.builder()
                .cliente(cliente)
                .quarto(quarto)
                .entrada(req.entrada())
                .saida(req.saida())
                .diarias(diarias)
                .precoDiaria(precoDiaria)
                .valorFinal(valorFinal)
                .status(status)
                .build();

        sincronizarQuarto(quarto, status);
        return toResponse(aluguelRepository.save(aluguel));
    }

    @Transactional
    public AluguelResponse atualizar(Long id, AluguelRequest req) {
        validarPeriodo(req);

        Aluguel aluguel = buscarEntidade(id);
        Quarto quarto = quartoService.buscarEntidade(req.quartoId());
        validarDisponibilidade(quarto.getId(), req, id);
        Cliente cliente = clienteRepository.findById(req.clienteId())
                .orElseThrow(() -> ResourceNotFoundException.of("Cliente", req.clienteId()));

        int diarias = calcularDiarias(req);
        BigDecimal precoDiaria = quarto.getPreco();

        aluguel.setCliente(cliente);
        aluguel.setQuarto(quarto);
        aluguel.setEntrada(req.entrada());
        aluguel.setSaida(req.saida());
        aluguel.setDiarias(diarias);
        aluguel.setPrecoDiaria(precoDiaria);
        aluguel.setValorFinal(precoDiaria.multiply(BigDecimal.valueOf(diarias)));
        if (req.status() != null) {
            StatusAluguel status = StatusAluguel.fromLabel(req.status());
            aluguel.setStatus(status);
            sincronizarQuarto(quarto, status);
        }
        return toResponse(aluguelRepository.save(aluguel));
    }

    /** Troca de status (RESERVA -> OCUPADO -> CONCLUIDO) e ajusta o quarto. */
    @Transactional
    public AluguelResponse atualizarStatus(Long id, String novoStatus) {
        Aluguel aluguel = buscarEntidade(id);
        StatusAluguel status = StatusAluguel.fromLabel(novoStatus);
        aluguel.setStatus(status);
        sincronizarQuarto(aluguel.getQuarto(), status);
        return toResponse(aluguelRepository.save(aluguel));
    }

    /** Botao "Cancelar" do modal de detalhes: remove a reserva e libera o quarto. */
    @Transactional
    public void cancelar(Long id) {
        Aluguel aluguel = buscarEntidade(id);
        Quarto quarto = aluguel.getQuarto();
        if (quarto != null && quarto.getStatus() == StatusQuarto.OCUPADO) {
            quarto.setStatus(StatusQuarto.DISPONIVEL);
        }
        aluguelRepository.delete(aluguel);
    }

    private void validarPeriodo(AluguelRequest req) {
        if (req.entrada() == null || req.saida() == null) {
            throw new DataInvalidaException("As datas de entrada e saída são obrigatórias");
        }
        if (!req.saida().isAfter(req.entrada())) {
            throw new DataInvalidaException("A data de saída deve ser posterior à data de entrada");
        }
    }

    private void validarDisponibilidade(Long quartoId, AluguelRequest req) {
        validarDisponibilidade(quartoId, req, null);
    }

    private void validarDisponibilidade(Long quartoId, AluguelRequest req, Long idIgnorar) {
        List<Aluguel> conflitos = aluguelRepository.findOverlappingByQuartoIdAndPeriod(quartoId, req.entrada(), req.saida());
        boolean existeConflito = conflitos.stream().anyMatch(aluguel -> idIgnorar == null || !idIgnorar.equals(aluguel.getId()));
        if (existeConflito) {
            throw new QuartoIndisponivelException("O quarto já está reservado para parte do período informado");
        }
    }

    private int calcularDiarias(AluguelRequest req) {
        long dias = ChronoUnit.DAYS.between(req.entrada(), req.saida());
        return dias <= 0 ? 1 : (int) dias;
    }

    private void sincronizarQuarto(Quarto quarto, StatusAluguel status) {
        if (quarto == null) return;
        if (status == StatusAluguel.OCUPADO) {
            quarto.setStatus(StatusQuarto.OCUPADO);
        } else if (status == StatusAluguel.CONCLUIDO) {
            quarto.setStatus(StatusQuarto.DISPONIVEL);
        }
    }

    AluguelResponse toResponse(Aluguel a) {
        Quarto quarto = a.getQuarto();
        Residencia residencia = quarto != null ? quarto.getResidencia() : null;
        String acaoLabel = a.getStatus() == StatusAluguel.CONCLUIDO ? "Recibo" : "Ver";
        return new AluguelResponse(
                a.getId(),
                a.getCliente() != null ? a.getCliente().getId() : null,
                a.getCliente() != null ? a.getCliente().getNome() : null,
                residencia != null ? residencia.getId() : null,
                residencia != null ? residencia.getNome() : null,
                quarto != null ? quarto.getId() : null,
                quarto != null ? quarto.getNome() : null,
                DateUtil.tabela(a.getEntrada()),
                DateUtil.tabela(a.getSaida()),
                a.getDiarias() != null ? a.getDiarias() : 0,
                CurrencyUtil.formatBRL(a.getValorFinal()),
                a.getStatus().name().toLowerCase(),
                acaoLabel
        );
    }
}
