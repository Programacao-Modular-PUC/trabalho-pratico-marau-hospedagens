package com.marau.hospedagens.service;

import com.marau.hospedagens.model.Recibo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Stub de envio de e-mail. Em producao, plugar um JavaMailSender / provedor
 * SMTP.
 * Por ora apenas registra a acao em log para que o botao "Enviar por Email"
 * funcione.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public void enviarRecibo(Recibo recibo) {
        String destino = recibo.getAluguel() != null && recibo.getAluguel().getCliente() != null
                ? recibo.getAluguel().getCliente().getEmail()
                : "(sem e-mail)";
        log.info("Enviando recibo Nº {} para {} (total {})",
                recibo.getNumero(), destino, recibo.getTotalFinal());
        // TODO: integrar provedor de e-mail real aqui.
    }
}
