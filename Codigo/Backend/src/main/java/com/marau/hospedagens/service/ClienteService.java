package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.AluguelResponse;
import com.marau.hospedagens.dto.ClienteRequest;
import com.marau.hospedagens.dto.ClienteResponse;
import com.marau.hospedagens.dto.HistoricoClienteResponse;
import com.marau.hospedagens.exception.ConflictException;
import com.marau.hospedagens.exception.ResourceNotFoundException;
import com.marau.hospedagens.model.Aluguel;
import com.marau.hospedagens.model.Cliente;
import com.marau.hospedagens.model.enums.StatusAluguel;
import com.marau.hospedagens.repository.ClienteRepository;
import com.marau.hospedagens.util.DateUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ClienteService {

    private final ClienteRepository repository;
    private final AluguelService aluguelService;

    public ClienteService(ClienteRepository repository, AluguelService aluguelService) {
        this.repository = repository;
        this.aluguelService = aluguelService;
    }

    public List<ClienteResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ClienteResponse buscar(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public Cliente buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Cliente", id));
    }

    /** Botao "Ver" do cliente: dados + historico de estadias. */
    public HistoricoClienteResponse historico(Long id) {
        Cliente cliente = buscarEntidade(id);
        List<AluguelResponse> historico = cliente.getAlugueis().stream()
                .sorted(Comparator.comparing(Aluguel::getEntrada,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(aluguelService::toResponse)
                .toList();
        return new HistoricoClienteResponse(toResponse(cliente), historico);
    }

    @Transactional
    public ClienteResponse criar(ClienteRequest req) {
        if (repository.existsByCpf(req.cpf())) {
            throw new ConflictException("Ja existe um cliente com o CPF: " + req.cpf());
        }
        Cliente c = Cliente.builder()
                .nome(req.nome())
                .cpf(req.cpf())
                .email(req.email())
                .telefone(req.telefone())
                .endereco(req.endereco())
                .build();
        return toResponse(repository.save(c));
    }

    @Transactional
    public ClienteResponse atualizar(Long id, ClienteRequest req) {
        Cliente c = buscarEntidade(id);
        if (!c.getCpf().equals(req.cpf()) && repository.existsByCpf(req.cpf())) {
            throw new ConflictException("Ja existe um cliente com o CPF: " + req.cpf());
        }
        c.setNome(req.nome());
        c.setCpf(req.cpf());
        c.setEmail(req.email());
        c.setTelefone(req.telefone());
        c.setEndereco(req.endereco());
        return toResponse(repository.save(c));
    }

    @Transactional
    public void deletar(Long id) {
        Cliente c = buscarEntidade(id);
        repository.delete(c);
    }

    private ClienteResponse toResponse(Cliente c) {
        List<Aluguel> alugueis = c.getAlugueis();

        String statusTipo;
        String ultimaHospedagem;

        Optional<Aluguel> ocupado = alugueis.stream()
                .filter(a -> a.getStatus() == StatusAluguel.OCUPADO)
                .findFirst();

        Optional<Aluguel> reserva = alugueis.stream()
                .filter(a -> a.getStatus() == StatusAluguel.RESERVA)
                .min(Comparator.comparing(Aluguel::getEntrada,
                        Comparator.nullsLast(Comparator.naturalOrder())));

        if (ocupado.isPresent()) {
            statusTipo = "ativo";
            ultimaHospedagem = "ATIVO";
        } else if (reserva.isPresent()) {
            statusTipo = "reserva";
            LocalDateTime entrada = reserva.get().getEntrada();
            ultimaHospedagem = "RESERVA " + (entrada != null ? entrada.format(DateUtil.TABELA).split(" ")[0] : "");
        } else {
            statusTipo = "data";
            ultimaHospedagem = alugueis.stream()
                    .map(Aluguel::getSaida)
                    .filter(java.util.Objects::nonNull)
                    .max(Comparator.naturalOrder())
                    .map(DateUtil::data)
                    .orElse("Sem registros");
        }

        return new ClienteResponse(
                c.getId(),
                c.getNome(),
                c.getCpf(),
                c.getEmail(),
                c.getTelefone(),
                c.getEndereco(),
                ultimaHospedagem,
                statusTipo);
    }
}
