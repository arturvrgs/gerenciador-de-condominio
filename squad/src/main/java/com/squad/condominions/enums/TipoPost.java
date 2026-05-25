package com.squad.condominions.enums;

public enum TipoPost {
    FORUM('F'),
    OCORRENCIA('O');

    private final Character codigo;

    TipoPost(Character codigo) {
        this.codigo = codigo;
    }

    public Character getCodigo() {
        return codigo;
    }
}
