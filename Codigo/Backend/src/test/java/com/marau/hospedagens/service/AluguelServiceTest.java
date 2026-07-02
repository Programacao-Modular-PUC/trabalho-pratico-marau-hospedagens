package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.AluguelRequest;
import com.marau.hospedagens.exception.QuartoIndisponivelException;
import com.marau.hospedagens.model.Aluguel;
import com.marau.hospedagens.model.Cliente;
import com.marau.hospedagens.model.Comodidade;
import com.marau.hospedagens.model.Quarto;
import com.marau.hospedagens.model.enums.TipoQuarto;
import com.marau.hospedagens.repository.AluguelRepository;
import com.marau.hospedagens.repository.ClienteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Calculo de valor final da estadia por tipo de quarto")
class AluguelServiceTest {

    private static final Comodidade AR_CONDICIONADO = Comodidade.builder()
            .nome("Ar-Condicionado")
            .preco(new BigDecimal("10.00"))
            .build();

    private static final Comodidade HIDROMASSAGEM = Comodidade.builder()
            .nome("Hidromassagem")
            .preco(new BigDecimal("30.00"))
            .build();

    @Mock
    private AluguelRepository aluguelRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private QuartoService quartoService;

    @InjectMocks
    private AluguelService aluguelService;

    static Stream<Arguments> cenariosPorTipoDeQuarto() {
        return Stream.of(
                Arguments.of(
                        TipoQuarto.INDIVIDUAL,
                        new BigDecimal("110.00"),
                        Set.of(AR_CONDICIONADO),
                        new BigDecimal("120.00"),
                        new BigDecimal("480.00")
                ),
                Arguments.of(
                        TipoQuarto.DUPLO,
                        new BigDecimal("160.00"),
                        Set.of(AR_CONDICIONADO, HIDROMASSAGEM),
                        new BigDecimal("200.00"),
                        new BigDecimal("800.00")
                ),
                Arguments.of(
                        TipoQuarto.FAMILIA,
                        new BigDecimal("250.00"),
                        Set.of(AR_CONDICIONADO),
                        new BigDecimal("260.00"),
                        new BigDecimal("1040.00")
                )
        );
    }

    @ParameterizedTest(name = "tipo={0}, precoDiaria={3}, valorFinal={4}")
    @MethodSource("cenariosPorTipoDeQuarto")
    @DisplayName("Criar reserva calcula diarias, preco congelado e valor final")
    void criarReserva_calculaValorPorTipoDeQuarto(
            TipoQuarto tipo,
            BigDecimal valorBase,
            Set<Comodidade> comodidades,
            BigDecimal precoDiariaEsperado,
            BigDecimal valorFinalEsperado
    ) {
        Cliente cliente = Cliente.builder().id(1L).nome("Ana Lima").cpf("12345678901").build();
        Quarto quarto = Quarto.builder()
                .id(1L)
                .nome("Qto 01")
                .tipo(tipo)
                .valorBase(valorBase)
                .comodidades(comodidades)
                .build();

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(quartoService.buscarEntidade(1L)).thenReturn(quarto);
        when(aluguelRepository.save(any(Aluguel.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AluguelRequest request = new AluguelRequest(
                1L,
                1L,
                LocalDateTime.of(2025, 4, 17, 12, 0),
                LocalDateTime.of(2025, 4, 21, 12, 0),
                "reserva"
        );

        aluguelService.criar(request);

        ArgumentCaptor<Aluguel> captor = ArgumentCaptor.forClass(Aluguel.class);
        verify(aluguelRepository).save(captor.capture());
        Aluguel aluguelSalvo = captor.getValue();

        assertEquals(4, aluguelSalvo.getDiarias());
        assertEquals(0, precoDiariaEsperado.compareTo(aluguelSalvo.getPrecoDiaria()));
        assertEquals(0, valorFinalEsperado.compareTo(aluguelSalvo.getValorFinal()));
    }

    @Test
    @DisplayName("Estadia de um dia quando entrada e saida sao no mesmo dia")
    void criarReserva_mesmoDia_cobraMinimoDeUmaDiaria() {
        Cliente cliente = Cliente.builder().id(1L).nome("Joao Santos").cpf("98765432100").build();
        Quarto quarto = Quarto.builder()
                .id(2L)
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("95.00"))
                .build();

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(quartoService.buscarEntidade(2L)).thenReturn(quarto);
        when(aluguelRepository.save(any(Aluguel.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AluguelRequest request = new AluguelRequest(
                1L,
                2L,
                LocalDateTime.of(2025, 5, 10, 12, 0),
                LocalDateTime.of(2025, 5, 10, 18, 0),
                "reserva"
        );

        aluguelService.criar(request);

        ArgumentCaptor<Aluguel> captor = ArgumentCaptor.forClass(Aluguel.class);
        verify(aluguelRepository).save(captor.capture());
        Aluguel aluguelSalvo = captor.getValue();

        assertEquals(1, aluguelSalvo.getDiarias());
        assertEquals(0, new BigDecimal("95.00").compareTo(aluguelSalvo.getPrecoDiaria()));
        assertEquals(0, new BigDecimal("95.00").compareTo(aluguelSalvo.getValorFinal()));
    }

    @Test
    @DisplayName("Criar reserva com periodo sobreposto lança exceção de quarto indisponível")
    void criarReserva_periodoSobreposto_lancaExcecaoDeQuartoIndisponivel() {
        Cliente cliente = Cliente.builder().id(1L).nome("Ana Lima").cpf("12345678901").build();
        Quarto quarto = Quarto.builder()
                .id(3L)
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("100.00"))
                .build();

        Aluguel aluguelExistente = Aluguel.builder()
                .id(10L)
                .quarto(quarto)
                .entrada(LocalDateTime.of(2025, 6, 1, 12, 0))
                .saida(LocalDateTime.of(2025, 6, 5, 12, 0))
                .status(com.marau.hospedagens.model.enums.StatusAluguel.RESERVA)
                .build();

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(quartoService.buscarEntidade(3L)).thenReturn(quarto);
        when(aluguelRepository.findOverlappingByQuartoIdAndPeriod(3L,
                LocalDateTime.of(2025, 6, 3, 12, 0),
                LocalDateTime.of(2025, 6, 7, 12, 0))).thenReturn(java.util.List.of(aluguelExistente));

        AluguelRequest request = new AluguelRequest(
                1L,
                3L,
                LocalDateTime.of(2025, 6, 3, 12, 0),
                LocalDateTime.of(2025, 6, 7, 12, 0),
                "reserva"
        );

        assertThrows(QuartoIndisponivelException.class, () -> aluguelService.criar(request));
    }

    @Test
    @DisplayName("Quarto individual com cama extra aplica adicional por cama extra")
    void quartoIndividual_comCamaExtra_aplicaAdicionalPorCamaExtra() {
        Quarto quarto = Quarto.builder()
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("100.00"))
                .numCamas(3)
                .adicionalCamaExtra(new BigDecimal("20.00"))
                .build();

        assertEquals(0, new BigDecimal("140.00").compareTo(quarto.getPreco()));
    }
}
