package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.QuartoRequest;
import com.marau.hospedagens.dto.QuartoResponse;
import com.marau.hospedagens.exception.ResourceNotFoundException;
import com.marau.hospedagens.model.Comodidade;
import com.marau.hospedagens.model.Quarto;
import com.marau.hospedagens.model.Residencia;
import com.marau.hospedagens.model.enums.StatusQuarto;
import com.marau.hospedagens.model.enums.TipoQuarto;
import com.marau.hospedagens.repository.ComodidadeRepository;
import com.marau.hospedagens.repository.QuartoRepository;
import com.marau.hospedagens.util.CurrencyUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class QuartoService {

    private final QuartoRepository quartoRepository;
    private final ComodidadeRepository comodidadeRepository;
    private final ResidenciaService residenciaService;

    public QuartoService(QuartoRepository quartoRepository,
                         ComodidadeRepository comodidadeRepository,
                         ResidenciaService residenciaService) {
        this.quartoRepository = quartoRepository;
        this.comodidadeRepository = comodidadeRepository;
        this.residenciaService = residenciaService;
    }

    /** Lista com filtros opcionais por residencia (nome) e tipo. */
    public List<QuartoResponse> listar(String residencia, String tipo) {
        List<Quarto> quartos;
        boolean temResidencia = residencia != null && !residencia.isBlank() && !residencia.equalsIgnoreCase("Todas");
        boolean temTipo = tipo != null && !tipo.isBlank() && !tipo.equalsIgnoreCase("Todos");

        if (temResidencia && temTipo) {
            quartos = quartoRepository.findByResidenciaNomeAndTipo(residencia, TipoQuarto.fromLabel(tipo));
        } else if (temResidencia) {
            quartos = quartoRepository.findByResidenciaNome(residencia);
        } else if (temTipo) {
            quartos = quartoRepository.findByTipo(TipoQuarto.fromLabel(tipo));
        } else {
            quartos = quartoRepository.findAll();
        }
        return quartos.stream().map(this::toResponse).toList();
    }

    public QuartoResponse buscar(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public Quarto buscarEntidade(Long id) {
        return quartoRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Quarto", id));
    }

    @Transactional
    public QuartoResponse criar(QuartoRequest req) {
        Residencia residencia = residenciaService.buscarEntidade(req.residenciaId());
        Quarto q = Quarto.builder()
                .nome(req.nome())
                .tipo(TipoQuarto.fromLabel(req.tipo()))
                .valorBase(req.valorBase())
                .status(StatusQuarto.fromLabel(req.status()))
                .cor(req.cor() != null ? req.cor() : "#1A4A5E")
                .residencia(residencia)
                .comodidades(resolverComodidades(req.comodidadeIds()))
                .numCamas(req.numCamas() != null ? req.numCamas() : 1)
                .temBerco(req.temBerco() != null ? req.temBerco() : false)
                .taxaBerco(req.taxaBerco())
                .adicionalCamaExtra(req.adicionalCamaExtra() != null ? req.adicionalCamaExtra() : BigDecimal.ZERO)
                .percentualHospede(req.percentualHospede() != null ? req.percentualHospede() : BigDecimal.ZERO)
                .numeroHospedes(req.numeroHospedes() != null ? req.numeroHospedes() : 1)
                .build();
        return toResponse(quartoRepository.save(q));
    }

    @Transactional
    public QuartoResponse atualizar(Long id, QuartoRequest req) {
        Quarto q = buscarEntidade(id);
        q.setNome(req.nome());
        q.setTipo(TipoQuarto.fromLabel(req.tipo()));
        q.setValorBase(req.valorBase());
        if (req.status() != null) {
            q.setStatus(StatusQuarto.fromLabel(req.status()));
        }
        if (req.cor() != null) {
            q.setCor(req.cor());
        }
        if (req.residenciaId() != null) {
            q.setResidencia(residenciaService.buscarEntidade(req.residenciaId()));
        }
        if (req.comodidadeIds() != null) {
            q.setComodidades(resolverComodidades(req.comodidadeIds()));
        }
        if (req.numCamas() != null) {
            q.setNumCamas(req.numCamas());
        }
        if (req.temBerco() != null) {
            q.setTemBerco(req.temBerco());
        }
        if (req.taxaBerco() != null) {
            q.setTaxaBerco(req.taxaBerco());
        }
        if (req.adicionalCamaExtra() != null) {
            q.setAdicionalCamaExtra(req.adicionalCamaExtra());
        }
        if (req.percentualHospede() != null) {
            q.setPercentualHospede(req.percentualHospede());
        }
        if (req.numeroHospedes() != null) {
            q.setNumeroHospedes(req.numeroHospedes());
        }
        return toResponse(quartoRepository.save(q));
    }

    @Transactional
    public void deletar(Long id) {
        Quarto q = buscarEntidade(id);
        quartoRepository.delete(q);
    }

    private Set<Comodidade> resolverComodidades(List<Long> ids) {
        Set<Comodidade> set = new HashSet<>();
        if (ids != null) {
            for (Long cid : ids) {
                set.add(comodidadeRepository.findById(cid)
                        .orElseThrow(() -> ResourceNotFoundException.of("Comodidade", cid)));
            }
        }
        return set;
    }

    /** Gera a descricao do tipo "Valor base: R$ 110,00 + Ar-Condicionado: R$ 10,00 = R$ 120,00/diaria". */
    private String montarDescricao(Quarto q) {
        StringBuilder sb = new StringBuilder("Valor base: ").append(CurrencyUtil.formatBRL(q.getValorBase()));
        for (Comodidade c : q.getComodidades()) {
            sb.append(" + ").append(c.getNome()).append(": ").append(CurrencyUtil.formatBRL(c.getPreco()));
        }
        sb.append(" = ").append(CurrencyUtil.formatBRL(q.getPreco())).append("/diaria");
        return sb.toString();
    }

    private QuartoResponse toResponse(Quarto q) {
        List<QuartoResponse.ComodidadeQuarto> comodidades = new ArrayList<>();
        for (Comodidade c : q.getComodidades()) {
            comodidades.add(new QuartoResponse.ComodidadeQuarto(c.getNome(), true));
        }
        BigDecimal preco = q.getPreco();
        return new QuartoResponse(
                q.getId(),
                q.getNome(),
                q.getTipo().getLabel(),
                q.getResidencia() != null ? q.getResidencia().getId() : null,
                q.getResidencia() != null ? q.getResidencia().getNome() : null,
                q.getValorBase(),
                preco,
                CurrencyUtil.formatBRL(preco),
                q.getStatus().name().toLowerCase(),
                comodidades,
                montarDescricao(q),
                q.getCor()
        );
    }
}
