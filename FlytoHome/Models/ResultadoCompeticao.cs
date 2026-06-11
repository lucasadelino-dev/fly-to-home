namespace FlytoHome.Models;

public class ResultadoCompeticao
{
    public int Id { get; set; }
    public int CompeticaoId { get; set; }
    public Competicao Competicao { get; set; } = null!;

    public int PomboId { get; set; }
    public Pombo Pombo { get; set; } = null!;

    public int? Posicao { get; set; }
    public TimeSpan? Tempo { get; set; }
    public string? Observacoes { get; set; }
}
