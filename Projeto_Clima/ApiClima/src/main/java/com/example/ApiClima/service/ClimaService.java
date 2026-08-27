package com.example.ApiClima.service;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@Service
public class ClimaService {

    private static final String BASE_URL_1 = "https://api.open-meteo.com/v1/forecast?latitude=-19.92&longitude=-43.94&current=temperature_2m";
    private static final String BASE_URL_2 = "https://geocoding-api.open-meteo.com/v1/search?name=";

    private String consultarURL(String apiUrl){
        String dados = "";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(apiUrl, String.class);
        if(responseEntity.getStatusCode().is2xxSuccessful()) {
            dados = responseEntity.getBody();
        } else {
            dados = "Falha ao obter dados, Código de status: " + responseEntity.getStatusCode();
        }
        return dados;
    }

    public String preverTempoBH(){
        return consultarURL(BASE_URL_1);
    }
    public String preverTempo(String cidade) {
        return consultarURL(BASE_URL_2 + cidade + "&count=1&language=pt&format=json");
    }

}
