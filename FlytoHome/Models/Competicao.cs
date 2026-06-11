namespace FlytoHome.Models;

public class Competicao
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public string Local { get; set; } = string.Empty;
    public double Distancia { get; set; }
    public string? Observacoes { get; set; }

    public ICollection<ResultadoCompeticao> Resultados { get; set; } = [];
}
