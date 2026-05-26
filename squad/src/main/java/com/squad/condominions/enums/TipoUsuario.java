package com.squad.condominions.enums;

public enum TipoUsuario {
    MORADOR('M'),
    ADMINISTRADOR('A');

    private final Character codigo;

    TipoUsuario(Character codigo) {
        this.codigo = codigo;
    }

    public Character getCodigo() {
        return codigo;
    }
}
