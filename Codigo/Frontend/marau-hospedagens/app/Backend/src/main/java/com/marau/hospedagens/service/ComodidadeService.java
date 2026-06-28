package com.marau.hospedagens.service;

import com.marau.hospedagens.dto.ComodidadeRequest;
import com.marau.hospedagens.dto.ComodidadeResponse;
import com.marau.hospedagens.exception.ConflictException;
import com.marau.hospedagens.exception.ResourceNotFoundException;
import com.marau.hospedagens.model.Comodidade;
import com.marau.hospedagens.repository.ComodidadeRepository;
import com.marau.hospedagens.util.CurrencyUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ComodidadeService {

    private final ComodidadeRepository repository;

    public ComodidadeService(ComodidadeRepository repository) {
        this.repository = repository;
    }

    public List<ComodidadeResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ComodidadeResponse buscar(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public Comodidade buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Comodidade", id));
    }

    @Transactional
    public ComodidadeResponse criar(ComodidadeRequest req) {
        if (repository.existsByNome(req.nome())) {
            throw new ConflictException("Ja existe uma comodidade com o nome: " + req.nome());
        }
        Comodidade c = Comodidade.builder()
                .nome(req.nome())
                .preco(req.preco())
                .build();
        return toResponse(repository.save(c));
    }

    @Transactional
    public ComodidadeResponse atualizar(Long id, ComodidadeRequest req) {
        Comodidade c = buscarEntidade(id);
        c.setNome(req.nome());
        c.setPreco(req.preco());
        return toResponse(repository.save(c));
    }

    @Transactional
    public void deletar(Long id) {
        Comodidade c = buscarEntidade(id);
        repository.delete(c);
    }

    private ComodidadeResponse toResponse(Comodidade c) {
        return new ComodidadeResponse(
                c.getId(),
                c.getNome(),
                c.getPreco(),
                CurrencyUtil.formatBRL(c.getPreco())
        );
    }
}
