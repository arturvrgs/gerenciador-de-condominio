package com.squad.condominions.enums;

public enum TipoUsuario {
    MORADOR("M"),
    ADMINISTRADOR("A");

    private final String codigo;

    TipoUsuario(String codigo) {
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }
}
