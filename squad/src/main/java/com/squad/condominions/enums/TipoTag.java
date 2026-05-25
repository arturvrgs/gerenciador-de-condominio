package com.squad.condominions.enums;

public enum TipoTag {
    FIXADO("F"),
    ELOGIO("E"),
    RECLAMACAO("R"),
    ALERTA("A"),
    NULA("N");

    private final String codigo;

    TipoTag(String codigo) {
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }
}
