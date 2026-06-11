namespace FlytoHome.Models;

public enum StatusAcasalamento { Planejado, EmAndamento, Concluido }

public class Acasalamento
{
    public int Id { get; set; }
    public int MachoId { get; set; }
    public Pombo Macho { get; set; } = null!;

    public int FemeaId { get; set; }
    public Pombo Femea { get; set; } = null!;

    public DateTime DataUniao { get; set; }
    public int QuantidadeOvos { get; set; }
    public int FilhotesNascidos { get; set; }
    public DateTime? PrevisaoNascimento { get; set; }
    public StatusAcasalamento Status { get; set; } = StatusAcasalamento.Planejado;
    public string? Observacoes { get; set; }
}
