namespace FlytoHome.Models;

public enum TipoRegistroSaude { Vacina, Medicamento, Exame, Tratamento }
public enum StatusRegistroSaude { Concluido, Agendado }

public class RegistroSaude
{
    public int Id { get; set; }
    public int PomboId { get; set; }
    public Pombo Pombo { get; set; } = null!;

    public TipoRegistroSaude Tipo { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public DateTime? ProximaDose { get; set; }
    public StatusRegistroSaude Status { get; set; }
    public string? Observacoes { get; set; }
}
