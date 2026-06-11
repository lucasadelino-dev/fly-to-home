namespace FlytoHome.Models;

public enum SexoPombo { Macho, Femea }
public enum StatusPombo { Ativo, Vendido, Falecido }

public class Pombo
{
    public int Id { get; set; }
    public string Anilha { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public SexoPombo Sexo { get; set; }
    public DateTime DataNascimento { get; set; }
    public string Cor { get; set; } = string.Empty;
    public string Origem { get; set; } = string.Empty;
    public StatusPombo Status { get; set; } = StatusPombo.Ativo;

    public int? PaiId { get; set; }
    public Pombo? Pai { get; set; }

    public int? MaeId { get; set; }
    public Pombo? Mae { get; set; }

    public ICollection<RegistroSaude> RegistrosSaude { get; set; } = [];
    public ICollection<ResultadoCompeticao> Resultados { get; set; } = [];
    public ICollection<Acasalamento> AcasalamentosComMacho { get; set; } = [];
    public ICollection<Acasalamento> AcasalamentosComFemea { get; set; } = [];
}
