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
 * Popula o banco com dados de exemplo (três residências, comodidades,
 * quartos, clientes e aluguéis) na primeira inicialização.
 *
 * As datas dos aluguéis são geradas em relação ao momento em que o backend
 * sobe (LocalDateTime.now()), não em datas fixas de calendário. Isso evita
 * que a demonstração fique com dados "no passado" dependendo de quando o
 * sistema é executado (ex: um aluguel OCUPADO com data de abril, mesmo
 * rodando em julho).
 *
 * Só roda quando {@code app.seed-data=true} (ligado no docker-compose e no
 * profile dev) e apenas se o banco ainda estiver vazio, para não duplicar
 * registros.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String BRAND = "#1A4A5E";
    private static final String TERRACOTA = "#C0624A";
    private static final String VERDE = "#47977B";

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

        // As diárias sempre começam às 12h (regra de negócio do sistema).
        LocalDateTime hoje = LocalDateTime.now().withHour(12).withMinute(0).withSecond(0).withNano(0);

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
                .status(StatusQuarto.OCUPADO) // Ana Lima está hospedada agora
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

        // Etapa 4: Vila das Dunas + quartos (terceira residência, dá mais massa
        // de dados para testar paginação e o gráfico de receita por mês)
        Residencia vilaDasDunas = Residencia.builder()
                .nome("Vila das Dunas")
                .endereco("Travessa das Vitórias-Régias, 15 · Ponta do Mutá")
                .cep("45520-200")
                .telefone("(73) 99112-3344")
                .email("viladasdunas@email.com")
                .cor(VERDE)
                .build();

        Quarto vdQto01 = Quarto.builder()
                .nome("Qto 01")
                .tipo(TipoQuarto.DUPLO)
                .valorBase(new BigDecimal("140.00"))
                .status(StatusQuarto.DISPONIVEL)
                .cor(VERDE)
                .residencia(vilaDasDunas)
                .comodidades(Set.of(hidro))
                .build();
        Quarto vdQto02 = Quarto.builder()
                .nome("Qto 02")
                .tipo(TipoQuarto.FAMILIA)
                .valorBase(new BigDecimal("220.00"))
                .status(StatusQuarto.DISPONIVEL)
                .cor(VERDE)
                .residencia(vilaDasDunas)
                .build();
        vilaDasDunas.getQuartos().add(vdQto01);
        vilaDasDunas.getQuartos().add(vdQto02);
        vilaDasDunas = residenciaRepository.save(vilaDasDunas);
        vdQto01 = vilaDasDunas.getQuartos().get(0);
        vdQto02 = vilaDasDunas.getQuartos().get(1);

        // Etapa 5: Clientes + aluguéis - cascata Cliente para Aluguel.
        // Datas espalhadas nos últimos ~3 meses e nas próximas semanas, sempre
        // relativas a "hoje", para a demonstração nunca ficar desatualizada.

        Cliente ana = Cliente.builder()
                .nome("Ana Lima")
                .cpf("032.456.789-01")
                .email("ana.lima@email.com")
                .telefone("(11) 98765-4321")
                .endereco("Rua das Acácias, 45, São Paulo - SP")
                .build();
        vincular(ana, Aluguel.builder() // hospedada agora
                .quarto(cpQto02)
                .entrada(hoje.minusDays(2))
                .saida(hoje.plusDays(2))
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
                .endereco("Avenida Atlântica, 210, Rio de Janeiro - RJ")
                .build();
        vincular(joao, Aluguel.builder() // concluído há ~2 meses
                .quarto(cpQto01)
                .entrada(hoje.minusDays(65))
                .saida(hoje.minusDays(61))
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
                .endereco("Rua da Bahia, 780, Belo Horizonte - MG")
                .build();
        vincular(carlos, Aluguel.builder() // concluído há ~1 mês
                .quarto(pmQto02)
                .entrada(hoje.minusDays(35))
                .saida(hoje.minusDays(31))
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
                .endereco("Rua XV de Novembro, 320, Curitiba - PR")
                .build();
        vincular(marina, Aluguel.builder() // reserva futura
                .quarto(pmQto01)
                .entrada(hoje.plusDays(20))
                .saida(hoje.plusDays(25))
                .diarias(5)
                .precoDiaria(new BigDecimal("95.00"))
                .valorFinal(new BigDecimal("475.00"))
                .status(StatusAluguel.RESERVA)
                .build());
        clienteRepository.save(marina);

        Cliente beatriz = Cliente.builder()
                .nome("Beatriz Rocha")
                .cpf("091.234.567-89")
                .email("beatriz.rocha@email.com")
                .telefone("(51) 94321-0987")
                .endereco("Avenida Ipiranga, 1500, Porto Alegre - RS")
                .build();
        vincular(beatriz, Aluguel.builder() // concluído há ~3 meses
                .quarto(vdQto01)
                .entrada(hoje.minusDays(95))
                .saida(hoje.minusDays(90))
                .diarias(5)
                .precoDiaria(new BigDecimal("170.00"))
                .valorFinal(new BigDecimal("850.00"))
                .status(StatusAluguel.CONCLUIDO)
                .build());
        clienteRepository.save(beatriz);

        Cliente rafael = Cliente.builder()
                .nome("Rafael Souza")
                .cpf("102.345.678-90")
                .email("rafael.souza@email.com")
                .telefone("(61) 93210-9876")
                .endereco("Quadra 108, 12, Brasília - DF")
                .build();
        vincular(rafael, Aluguel.builder() // concluído recentemente (mesmo mês)
                .quarto(vdQto02)
                .entrada(hoje.minusDays(10))
                .saida(hoje.minusDays(7))
                .diarias(3)
                .precoDiaria(new BigDecimal("220.00"))
                .valorFinal(new BigDecimal("660.00"))
                .status(StatusAluguel.CONCLUIDO)
                .build());
        clienteRepository.save(rafael);

        Cliente fernanda = Cliente.builder()
                .nome("Fernanda Alves")
                .cpf("113.456.789-01")
                .email("fernanda.alves@email.com")
                .telefone("(71) 92109-8765")
                .endereco("Rua Chile, 88, Salvador - BA")
                .build();
        vincular(fernanda, Aluguel.builder() // reserva próxima
                .quarto(pmQto02)
                .entrada(hoje.plusDays(3))
                .saida(hoje.plusDays(6))
                .diarias(3)
                .precoDiaria(new BigDecimal("90.00"))
                .valorFinal(new BigDecimal("270.00"))
                .status(StatusAluguel.RESERVA)
                .build());
        clienteRepository.save(fernanda);

        // Cliente sem hospedagem ainda — útil para testar o estado "sem histórico"
        Cliente bruno = Cliente.builder()
                .nome("Bruno Castro")
                .cpf("124.567.890-12")
                .email("bruno.castro@email.com")
                .telefone("(81) 91098-7654")
                .endereco("Rua da Aurora, 230, Recife - PE")
                .build();
        clienteRepository.save(bruno);

        Cliente gabriel = Cliente.builder()
                .nome("Gabriel Nunes")
                .cpf("135.678.901-23")
                .email("gabriel.nunes@email.com")
                .telefone("(85) 90987-6543")
                .endereco("Avenida Beira Mar, 500, Fortaleza - CE")
                .build();
        vincular(gabriel, Aluguel.builder() // reserva futura
                .quarto(cpQto01)
                .entrada(hoje.plusDays(8))
                .saida(hoje.plusDays(11))
                .diarias(3)
                .precoDiaria(new BigDecimal("120.00"))
                .valorFinal(new BigDecimal("360.00"))
                .status(StatusAluguel.RESERVA)
                .build());
        clienteRepository.save(gabriel);

        Cliente larissa = Cliente.builder()
                .nome("Larissa Dias")
                .cpf("146.789.012-34")
                .email("larissa.dias@email.com")
                .telefone("(19) 98765-1234")
                .endereco("Rua Barão de Jaguara, 150, Campinas - SP")
                .build();
        vincular(larissa, Aluguel.builder() // reserva futura
                .quarto(vdQto02)
                .entrada(hoje.plusDays(15))
                .saida(hoje.plusDays(19))
                .diarias(4)
                .precoDiaria(new BigDecimal("220.00"))
                .valorFinal(new BigDecimal("880.00"))
                .status(StatusAluguel.RESERVA)
                .build());
        clienteRepository.save(larissa);

        Cliente thiago = Cliente.builder()
                .nome("Thiago Barbosa")
                .cpf("157.890.123-45")
                .email("thiago.barbosa@email.com")
                .telefone("(27) 97654-2345")
                .endereco("Avenida Jerônimo Monteiro, 90, Vitória - ES")
                .build();
        vincular(thiago, Aluguel.builder() // reserva futura
                .quarto(vdQto01)
                .entrada(hoje.plusDays(30))
                .saida(hoje.plusDays(33))
                .diarias(3)
                .precoDiaria(new BigDecimal("170.00"))
                .valorFinal(new BigDecimal("510.00"))
                .status(StatusAluguel.RESERVA)
                .build());
        clienteRepository.save(thiago);

        Cliente camila = Cliente.builder()
                .nome("Camila Freitas")
                .cpf("168.901.234-56")
                .email("camila.freitas@email.com")
                .telefone("(48) 96543-3456")
                .endereco("Avenida Beira Mar Norte, 620, Florianópolis - SC")
                .build();
        vincular(camila, Aluguel.builder() // reserva futura (mais distante)
                .quarto(cpQto01)
                .entrada(hoje.plusDays(45))
                .saida(hoje.plusDays(50))
                .diarias(5)
                .precoDiaria(new BigDecimal("120.00"))
                .valorFinal(new BigDecimal("600.00"))
                .status(StatusAluguel.RESERVA)
                .build());
        clienteRepository.save(camila);

        log.info("Seed concluído: {} residências, {} clientes.",
                residenciaRepository.count(), clienteRepository.count());
    }

    /** Liga os dois lados da relação Cliente <-> Aluguel. */
    private void vincular(Cliente cliente, Aluguel aluguel) {
        aluguel.setCliente(cliente);
        cliente.getAlugueis().add(aluguel);
    }
}
