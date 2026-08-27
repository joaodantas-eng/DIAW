package com.example.ApiClima.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.ApiClima.service.ClimaService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/clima")
public class Controller {
    private final ClimaService service;

    public Controller(ClimaService service) {
        this.service = service;
    }

    @GetMapping("/BH")
    public String preverTempoBH(){
        return service.preverTempoBH();
    }

    @GetMapping("/{cidade}")
    public String preverTempo(@PathVariable String cidade){
        return service.preverTempo(cidade);
    }

}