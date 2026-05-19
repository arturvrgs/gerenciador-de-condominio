package com.squad.condominions.controller;

import com.squad.condominions.model.Ocorrencia;
import com.squad.condominions.service.OcorrenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("condominions/ocorrencias")
public class OcorrenciaController {
    private final OcorrenciaService service;

    public OcorrenciaController(OcorrenciaService service) {
        this.service = service;
    }

    ResponseEntity<Ocorrencia> criar(@RequestBody Ocorrencia ocorrencia) {
        return service.criar(ocorrencia);
    }
}
