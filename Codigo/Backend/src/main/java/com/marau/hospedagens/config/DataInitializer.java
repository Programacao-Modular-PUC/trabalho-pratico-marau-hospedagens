package com.marau.hospedagens.config;

import com.marau.hospedagens.model.Aluguel;
import com.marau.hospedagens.model.Cliente;
import com.marau.hospedagens.model.Comodidade;
import com.marau.hospedagens.model.Quarto;
import com.marau.hospedagens.model.Residencia;
import com.marau.hospedagens.model.enums.StatusAluguel;
import com.marau.hospedagens.model.enums.StatusQuarto;
import com.marau.hospedagens.model.enums.TipoQuarto;
import com.marau.hospedagens.repository.ClienteRepository;
import com.marau.hospedagens.repository.ComodidadeRepository;
import com.marau.hospedagens.repository.ResidenciaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Popula o banco com os dados de exemplo do frontend (duas residências,
 * comodidades, quartos, clientes e aluguéis) na primeira inicialização.
 *
 * Só roda quando {@code app.seed-data=true} (ligado no docker-compose) e
 * apenas se o banco ainda estiver vazio, para não duplicar registros.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String BRAND = "#1A4A5E";
    private static final String TERRACOTA = "#C0624A";

    private final boolean seedEnabled;
    private final ResidenciaRepository residenciaRepository;
    private final ComodidadeRepository comodidadeRepository;
    private final ClienteRepository clienteRepository;

    public DataInitializer(@Value("${app.seed-data:false}") boolean seedEnabled,
                           ResidenciaRepository residenciaRepository,
                           ComodidadeRepository comodidadeRepository,
                           ClienteRepository clienteRepository) {
        this.seedEnabled = seedEnabled;
        this.residenciaRepository = residenciaRepository;
        this.comodidadeRepository = comodidadeRepository;
        this.clienteRepository = clienteRepository;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }
        if (residenciaRepository.count() > 0 || clienteRepository.count() > 0) {
            log.info("Seed ignorado: banco já contém dados.");
            return;
        }

        log.info("Populando banco com dados de exemplo...");

        // Etapa 1: Comodidades - catalogo usado no calculo do preco dos quartos
        Comodidade ar = comodidadeRepository.save(Comodidade.builder()
                .nome("Ar-Condicionado")
                .preco(new BigDecimal("10.00"))
                .build());
        Comodidade hidro = comodidadeRepository.save(Comodidade.builder()
                .nome("Hidromassagem")
                .preco(new BigDecimal("30.00"))
                .build());

        // Etapa 2: Casa Praiana + quartos
        Residencia casaPraiana = Residencia.builder()
                .nome("Casa Praiana")
                .endereco("Rua das Amendoeiras, 42 · Barra Grande")
                .cep("45520-000")
                .telefone("(73) 98876-1234")
                .email("casapraiana@email.com")
                .cor(BRAND)
                .build();

        Quarto cpQto01 = Quarto.builder()
                .nome("Qto 01")
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("110.00"))
                .status(StatusQuarto.DISPONIVEL)
                .cor(BRAND)
                .residencia(casaPraiana)
                .comodidades(Set.of(ar))
                .build();
        Quarto cpQto02 = Quarto.builder()
                .nome("Qto 02")
                .tipo(TipoQuarto.DUPLO)
                .valorBase(new BigDecimal("160.00"))
                .status(StatusQuarto.OCUPADO) // Ana Lima está hospedada
                .cor(BRAND)
                .residencia(casaPraiana)
                .comodidades(Set.of(ar, hidro))
                .build();
        casaPraiana.getQuartos().add(cpQto01);
        casaPraiana.getQuartos().add(cpQto02);
        casaPraiana = residenciaRepository.save(casaPraiana); // cascata -> quartos
        cpQto01 = casaPraiana.getQuartos().get(0);
        cpQto02 = casaPraiana.getQuartos().get(1);

        // Etapa 3: Pousada do Mato + quartos
        Residencia pousadaMato = Residencia.builder()
                .nome("Pousada do Mato")
                .endereco("Alameda das Bromélias, 8 · Algodões")
                .cep("45520-100")
                .telefone("(73) 99001-5566")
                .email("pousadamato@email.com")
                .cor(TERRACOTA)
                .build();

        Quarto pmQto01 = Quarto.builder()
                .nome("Qto 01")
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("95.00"))
                .status(StatusQuarto.DISPONIVEL)
                .cor(TERRACOTA)
                .residencia(pousadaMato)
                .build();
        Quarto pmQto02 = Quarto.builder()
                .nome("Qto 02")
                .tipo(TipoQuarto.INDIVIDUAL)
                .valorBase(new BigDecimal("80.00"))
                .status(StatusQuarto.DISPONIVEL)
                .cor(TERRACOTA)
                .residencia(pousadaMato)
                .comodidades(Set.of(ar))
                .build();
        pousadaMato.getQuartos().add(pmQto01);
        pousadaMato.getQuartos().add(pmQto02);
        pousadaMato = residenciaRepository.save(pousadaMato);
        pmQto01 = pousadaMato.getQuartos().get(0);
        pmQto02 = pousadaMato.getQuartos().get(1);

        // Etapa 4: Clientes + alugueis - cascata Cliente para Aluguel
        Cliente ana = Cliente.builder()
                .nome("Ana Lima")
                .cpf("032.456.789-01")
                .email("ana.lima@email.com")
                .telefone("(11) 98765-4321")
                .endereco("São Paulo, SP")
                .build();
        vincular(ana, Aluguel.builder()
                .quarto(cpQto02)
                .entrada(LocalDateTime.of(2025, 4, 17, 12, 0))
                .saida(LocalDateTime.of(2025, 4, 21, 12, 0))
                .diarias(4)
                .precoDiaria(new BigDecimal("200.00"))
                .valorFinal(new BigDecimal("800.00"))
                .status(StatusAluguel.OCUPADO)
                .build());
        clienteRepository.save(ana);

        Cliente joao = Cliente.builder()
                .nome("João Santos")
                .cpf("045.678.912-23")
                .email("joao.santos@email.com")
                .telefone("(21) 97654-3210")
                .endereco("Rio de Janeiro, RJ")
                .build();
        vincular(joao, Aluguel.builder()
                .quarto(cpQto01)
                .entrada(LocalDateTime.of(2025, 4, 12, 12, 0))
                .saida(LocalDateTime.of(2025, 4, 16, 12, 0))
                .diarias(4)
                .precoDiaria(new BigDecimal("120.00"))
                .valorFinal(new BigDecimal("480.00"))
                .status(StatusAluguel.CONCLUIDO)
                .build());
        clienteRepository.save(joao);

        Cliente carlos = Cliente.builder()
                .nome("Carlos Mendes")
                .cpf("078.901.234-56")
                .email("carlos.m@email.com")
                .telefone("(31) 96543-2109")
                .endereco("Belo Horizonte, MG")
                .build();
        vincular(carlos, Aluguel.builder()
                .quarto(pmQto02)
                .entrada(LocalDateTime.of(2025, 4, 10, 12, 0))
                .saida(LocalDateTime.of(2025, 4, 14, 12, 0))
                .diarias(4)
                .precoDiaria(new BigDecimal("90.00"))
                .valorFinal(new BigDecimal("360.00"))
                .status(StatusAluguel.CONCLUIDO)
                .build());
        clienteRepository.save(carlos);

        Cliente marina = Cliente.builder()
                .nome("Marina Faria")
                .cpf("089.123.456-78")
                .email("marina.faria@email.com")
                .telefone("(41) 95432-1098")
                .endereco("Curitiba, PR")
                .build();
        vincular(marina, Aluguel.builder()
                .quarto(pmQto01)
                .entrada(LocalDateTime.of(2025, 4, 20, 12, 0))
                .saida(LocalDateTime.of(2025, 4, 25, 12, 0))
                .diarias(5)
                .precoDiaria(new BigDecimal("95.00"))
                .valorFinal(new BigDecimal("475.00"))
                .status(StatusAluguel.RESERVA)
                .build());
        clienteRepository.save(marina);

        log.info("Seed concluído: {} residências, {} clientes.",
                residenciaRepository.count(), clienteRepository.count());
    }

    /** Liga os dois lados da relação Cliente <-> Aluguel. */
    private void vincular(Cliente cliente, Aluguel aluguel) {
        aluguel.setCliente(cliente);
        cliente.getAlugueis().add(aluguel);
    }
}
