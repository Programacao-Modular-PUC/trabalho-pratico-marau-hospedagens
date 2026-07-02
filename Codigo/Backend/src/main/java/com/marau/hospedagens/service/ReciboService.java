package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.ReciboResponse;
import com.marau.hospedagens.exception.ResourceNotFoundException;
import com.marau.hospedagens.model.*;
import com.marau.hospedagens.model.enums.FormaPagamento;
import com.marau.hospedagens.repository.ReciboRepository;
import com.marau.hospedagens.util.CurrencyUtil;
import com.marau.hospedagens.util.DateUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReciboService {

        private static final int NUMERO_BASE = 33; // primeiro recibo emitido fica "0034"

        private final ReciboRepository reciboRepository;
        private final AluguelService aluguelService;
        private final EmailService emailService;

        public ReciboService(ReciboRepository reciboRepository,
                        AluguelService aluguelService,
                        EmailService emailService) {
                this.reciboRepository = reciboRepository;
                this.aluguelService = aluguelService;
                this.emailService = emailService;
        }

        public ReciboResponse buscar(Long id) {
                return toResponse(buscarEntidade(id));
        }

        public Recibo buscarEntidade(Long id) {
                return reciboRepository.findById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Recibo", id));
        }

        /**
         * Botao "Recibo" da tabela de alugueis: o frontend abre /recibo?id={aluguelId}.
         * Retorna o recibo do aluguel, gerando-o caso ainda nao exista.
         */
        @Transactional
        public ReciboResponse obterOuGerarPorAluguel(Long aluguelId, String formaPagamento) {
                Recibo recibo = reciboRepository.findByAluguelId(aluguelId)
                                .orElseGet(() -> gerar(aluguelId, formaPagamento));
                if (formaPagamento != null && !formaPagamento.isBlank()) {
                        recibo.setFormaPagamento(FormaPagamento.fromLabel(formaPagamento));
                        recibo = reciboRepository.save(recibo);
                }
                return toResponse(recibo);
        }

        private Recibo gerar(Long aluguelId, String formaPagamento) {
                Aluguel aluguel = aluguelService.buscarEntidade(aluguelId);
                Quarto quarto = aluguel.getQuarto();

                List<ItemRecibo> itens = new ArrayList<>();
                itens.add(ItemRecibo.builder()
                                .descricao("Valor base (" + quarto.getTipo().getLabel() + ")")
                                .valor(quarto.getValorBase())
                                .porDiaria(true)
                                .build());
                for (Comodidade c : quarto.getComodidades()) {
                        itens.add(ItemRecibo.builder()
                                        .descricao("+ " + c.getNome())
                                        .valor(c.getPreco())
                                        .porDiaria(true)
                                        .build());
                }
                itens.add(ItemRecibo.builder()
                                .descricao("Valor da diaria (final)")
                                .valor(aluguel.getPrecoDiaria())
                                .porDiaria(true)
                                .build());

                Recibo recibo = Recibo.builder()
                                .numero(proximoNumero())
                                .aluguel(aluguel)
                                .emitidoEm(LocalDateTime.now())
                                .formaPagamento(FormaPagamento.fromLabel(formaPagamento))
                                .itens(itens)
                                .totalFinal(aluguel.getValorFinal())
                                .build();

                return reciboRepository.save(recibo);
        }

        /** Atualiza a forma de pagamento exibida (select da tela de recibo). */
        @Transactional
        public ReciboResponse atualizarPagamento(Long reciboId, String formaPagamento) {
                Recibo recibo = buscarEntidade(reciboId);
                recibo.setFormaPagamento(FormaPagamento.fromLabel(formaPagamento));
                return toResponse(reciboRepository.save(recibo));
        }

        /** Botao "Enviar por Email". */
        @Transactional
        public void enviarPorEmail(Long reciboId) {
                Recibo recibo = buscarEntidade(reciboId);
                emailService.enviarRecibo(recibo);
        }

        private String proximoNumero() {
                long seq = reciboRepository.count() + 1;
                return String.format("%04d", NUMERO_BASE + seq);
        }

        private ReciboResponse toResponse(Recibo r) {
                Aluguel a = r.getAluguel();
                Cliente cliente = a.getCliente();
                Quarto quarto = a.getQuarto();
                Residencia residencia = quarto.getResidencia();

                ReciboResponse.Hospede hospede = new ReciboResponse.Hospede(
                                cliente.getNome(), cliente.getCpf(), cliente.getEmail());

                String acomodacaoNome = residencia.getNome() + " - " + quarto.getNome()
                                + " (" + quarto.getTipo().getLabel() + ")";
                ReciboResponse.Acomodacao acomodacao = new ReciboResponse.Acomodacao(
                                acomodacaoNome, residencia.getEndereco());

                List<ReciboResponse.Item> itens = r.getItens().stream()
                                .map(it -> new ReciboResponse.Item(
                                                it.getDescricao() + ":",
                                                it.isPorDiaria()
                                                                ? CurrencyUtil.formatBRLPorDia(it.getValor())
                                                                : CurrencyUtil.formatBRL(it.getValor())))
                                .toList();

                return new ReciboResponse(
                                r.getId(),
                                a.getId(),
                                r.getNumero(),
                                DateUtil.emissao(r.getEmitidoEm()),
                                hospede,
                                acomodacao,
                                DateUtil.data(a.getEntrada()),
                                DateUtil.hora(a.getEntrada()),
                                DateUtil.data(a.getSaida()),
                                DateUtil.hora(a.getSaida()),
                                a.getDiarias() != null ? a.getDiarias() : 0,
                                itens,
                                CurrencyUtil.formatBRL(r.getTotalFinal()),
                                r.getFormaPagamento().getLabel());
        }
}
