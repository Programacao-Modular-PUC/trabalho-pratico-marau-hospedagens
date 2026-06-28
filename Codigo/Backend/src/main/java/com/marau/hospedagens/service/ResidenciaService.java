package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.ResidenciaRequest;
import com.marau.hospedagens.dto.ResidenciaResponse;
import com.marau.hospedagens.exception.ConflictException;
import com.marau.hospedagens.exception.ResourceNotFoundException;
import com.marau.hospedagens.model.Quarto;
import com.marau.hospedagens.model.Residencia;
import com.marau.hospedagens.model.enums.StatusQuarto;
import com.marau.hospedagens.repository.ResidenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ResidenciaService {

    private final ResidenciaRepository repository;

    public ResidenciaService(ResidenciaRepository repository) {
        this.repository = repository;
    }

    public List<ResidenciaResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ResidenciaResponse buscar(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public Residencia buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Residencia", id));
    }

    @Transactional
    public ResidenciaResponse criar(ResidenciaRequest req) {
        if (repository.existsByNome(req.nome())) {
            throw new ConflictException("Ja existe uma residencia com o nome: " + req.nome());
        }
        Residencia r = Residencia.builder()
                .nome(req.nome())
                .endereco(req.endereco())
                .cep(req.cep())
                .telefone(req.telefone())
                .email(req.email())
                .cor(req.cor() != null ? req.cor() : "#1A4A5E")
                .build();
        return toResponse(repository.save(r));
    }

    @Transactional
    public ResidenciaResponse atualizar(Long id, ResidenciaRequest req) {
        Residencia r = buscarEntidade(id);
        r.setNome(req.nome());
        r.setEndereco(req.endereco());
        r.setCep(req.cep());
        r.setTelefone(req.telefone());
        r.setEmail(req.email());
        if (req.cor() != null) {
            r.setCor(req.cor());
        }
        return toResponse(repository.save(r));
    }

    @Transactional
    public void deletar(Long id) {
        Residencia r = buscarEntidade(id);
        repository.delete(r);
    }

    private ResidenciaResponse toResponse(Residencia r) {
        List<Quarto> quartos = r.getQuartos();
        int total = quartos.size();
        int ocupados = (int) quartos.stream()
                .filter(q -> q.getStatus() == StatusQuarto.OCUPADO)
                .count();
        int disponiveis = total - ocupados;
        return new ResidenciaResponse(
                r.getId(),
                r.getNome(),
                r.getEndereco(),
                r.getCep(),
                r.getTelefone(),
                r.getEmail(),
                r.getCor(),
                total,
                disponiveis,
                ocupados
        );
    }
}
