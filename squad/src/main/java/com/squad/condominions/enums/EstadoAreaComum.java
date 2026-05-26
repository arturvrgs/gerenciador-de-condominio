package com.squad.condominions.enums;

public enum EstadoAreaComum {
    DISPONIVEL('D'),
    RESERVADA('R'),
    SUSPENSA('S');

    private final Character codigo;

    EstadoAreaComum(Character codigo) {
        this.codigo = codigo;
    }

    public Character getCodigo() {
        return codigo;
    }
}
