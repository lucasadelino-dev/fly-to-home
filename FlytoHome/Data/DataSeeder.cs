using FlytoHome.Models;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Limpa tudo na ordem correta (respeita FKs)
        db.ResultadosCompeticao.RemoveRange(db.ResultadosCompeticao);
        db.RegistrosSaude.RemoveRange(db.RegistrosSaude);
        db.Acasalamentos.RemoveRange(db.Acasalamentos);
        db.Competicoes.RemoveRange(db.Competicoes);

        // Pombos: anular PaiId/MaeId antes de deletar (FK Restrict self-reference)
        await db.Pombos.ExecuteUpdateAsync(s => s
            .SetProperty(p => p.PaiId, (int?)null)
            .SetProperty(p => p.MaeId, (int?)null));
        db.Pombos.RemoveRange(db.Pombos);
        await db.SaveChangesAsync();

        var hoje = DateTime.Today;

        // ── GERAÇÃO 3 (avós) ────────────────────────────────────────────────
        var avo1 = new Pombo { Anilha = "BR2018-001", Nome = "Atlas", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddYears(-8), Cor = "Azul Barrado", Origem = "Bélgica", Status = StatusPombo.Ativo };
        var avo2 = new Pombo { Anilha = "BR2018-002", Nome = "Aurora", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddYears(-8), Cor = "Branca", Origem = "Holanda", Status = StatusPombo.Ativo };
        var avo3 = new Pombo { Anilha = "BR2018-003", Nome = "Titan", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddYears(-7), Cor = "Vermelho Mosqueado", Origem = "Brasil", Status = StatusPombo.Ativo };
        var avo4 = new Pombo { Anilha = "BR2018-004", Nome = "Ágata", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddYears(-7), Cor = "Cinza", Origem = "Brasil", Status = StatusPombo.Vendido };

        db.Pombos.AddRange(avo1, avo2, avo3, avo4);
        await db.SaveChangesAsync();

        // ── GERAÇÃO 2 (pais) ────────────────────────────────────────────────
        var pai1 = new Pombo { Anilha = "BR2021-010", Nome = "Falcão", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddYears(-5), Cor = "Azul Barrado", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = avo1.Id, MaeId = avo2.Id };
        var mae1 = new Pombo { Anilha = "BR2021-011", Nome = "Íris", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddYears(-5), Cor = "Branca Mosqueada", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = avo3.Id, MaeId = avo4.Id };
        var pai2 = new Pombo { Anilha = "BR2022-020", Nome = "Trovão", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddYears(-4), Cor = "Vermelho", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = avo1.Id, MaeId = avo2.Id };
        var mae2 = new Pombo { Anilha = "BR2022-021", Nome = "Estrela", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddYears(-4), Cor = "Azul", Origem = "Argentina", Status = StatusPombo.Ativo, PaiId = avo3.Id, MaeId = avo4.Id };

        db.Pombos.AddRange(pai1, mae1, pai2, mae2);
        await db.SaveChangesAsync();

        // ── GERAÇÃO 1 (correntes) ────────────────────────────────────────────
        var p1 = new Pombo { Anilha = "BR2024-001", Nome = "Thunder", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddYears(-2), Cor = "Azul Barrado", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = pai1.Id, MaeId = mae1.Id };
        var p2 = new Pombo { Anilha = "BR2024-002", Nome = "Luna", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddYears(-2), Cor = "Branca", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = pai1.Id, MaeId = mae1.Id };
        var p3 = new Pombo { Anilha = "BR2024-003", Nome = "Bolt", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddMonths(-20), Cor = "Vermelho Mosqueado", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = pai2.Id, MaeId = mae2.Id };
        var p4 = new Pombo { Anilha = "BR2024-004", Nome = "Nova", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddMonths(-20), Cor = "Cinza Barrada", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = pai2.Id, MaeId = mae2.Id };
        var p5 = new Pombo { Anilha = "BR2025-005", Nome = "Storm", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddMonths(-14), Cor = "Azul", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = pai1.Id, MaeId = mae2.Id };
        var p6 = new Pombo { Anilha = "BR2025-006", Nome = "Celeste", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddMonths(-14), Cor = "Branca Azulada", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = pai2.Id, MaeId = mae1.Id };
        var p7 = new Pombo { Anilha = "BR2025-007", Nome = "Flash", Sexo = SexoPombo.Macho, DataNascimento = hoje.AddMonths(-10), Cor = "Vermelho", Origem = "Brasil", Status = StatusPombo.Ativo, PaiId = pai1.Id, MaeId = mae2.Id };
        var p8 = new Pombo { Anilha = "BR2025-008", Nome = "Vega", Sexo = SexoPombo.Femea, DataNascimento = hoje.AddMonths(-10), Cor = "Malhada", Origem = "Brasil", Status = StatusPombo.Falecido, PaiId = pai2.Id, MaeId = mae1.Id };

        db.Pombos.AddRange(p1, p2, p3, p4, p5, p6, p7, p8);
        await db.SaveChangesAsync();

        var ativos = new[] { p1, p2, p3, p4, p5, p6, p7 };

        // ── COMPETIÇÕES ──────────────────────────────────────────────────────
        var comp1 = new Competicao { Nome = "Copa Primavera 2025", Data = hoje.AddMonths(-5), Local = "São Paulo, SP", Distancia = 350, Observacoes = "Condições de vento favoráveis" };
        var comp2 = new Competicao { Nome = "Grande Prêmio Sul 2025", Data = hoje.AddMonths(-4), Local = "Curitiba, PR", Distancia = 500 };
        var comp3 = new Competicao { Nome = "Desafio Centro-Oeste", Data = hoje.AddMonths(-3), Local = "Brasília, DF", Distancia = 420, Observacoes = "Chuva no percurso" };
        var comp4 = new Competicao { Nome = "Clássico Paulista", Data = hoje.AddMonths(-2), Local = "Campinas, SP", Distancia = 280 };
        var comp5 = new Competicao { Nome = "Copa Outono 2026", Data = hoje.AddMonths(-1), Local = "Ribeirão Preto, SP", Distancia = 310 };
        var comp6 = new Competicao { Nome = "Campeonato Nacional 2026", Data = hoje.AddDays(15), Local = "Belo Horizonte, MG", Distancia = 600, Observacoes = "Competição mais importante do ano" };
        var comp7 = new Competicao { Nome = "Copa Inverno 2026", Data = hoje.AddMonths(2), Local = "Porto Alegre, RS", Distancia = 550 };

        db.Competicoes.AddRange(comp1, comp2, comp3, comp4, comp5, comp6, comp7);
        await db.SaveChangesAsync();

        // Resultados para competições passadas
        db.ResultadosCompeticao.AddRange(
            // Copa Primavera
            new ResultadoCompeticao { CompeticaoId = comp1.Id, PomboId = p1.Id, Posicao = 1 },
            new ResultadoCompeticao { CompeticaoId = comp1.Id, PomboId = p3.Id, Posicao = 2 },
            new ResultadoCompeticao { CompeticaoId = comp1.Id, PomboId = p5.Id, Posicao = 3 },
            new ResultadoCompeticao { CompeticaoId = comp1.Id, PomboId = p7.Id, Posicao = 4 },
            // Grande Prêmio Sul
            new ResultadoCompeticao { CompeticaoId = comp2.Id, PomboId = p3.Id, Posicao = 1 },
            new ResultadoCompeticao { CompeticaoId = comp2.Id, PomboId = p1.Id, Posicao = 2 },
            new ResultadoCompeticao { CompeticaoId = comp2.Id, PomboId = p5.Id, Posicao = 4 },
            new ResultadoCompeticao { CompeticaoId = comp2.Id, PomboId = p7.Id, Posicao = 3 },
            // Desafio Centro-Oeste
            new ResultadoCompeticao { CompeticaoId = comp3.Id, PomboId = p5.Id, Posicao = 1 },
            new ResultadoCompeticao { CompeticaoId = comp3.Id, PomboId = p7.Id, Posicao = 2 },
            new ResultadoCompeticao { CompeticaoId = comp3.Id, PomboId = p3.Id, Posicao = 3 },
            // Clássico Paulista
            new ResultadoCompeticao { CompeticaoId = comp4.Id, PomboId = p1.Id, Posicao = 1, Observacoes = "Recorde de percurso" },
            new ResultadoCompeticao { CompeticaoId = comp4.Id, PomboId = p5.Id, Posicao = 2 },
            new ResultadoCompeticao { CompeticaoId = comp4.Id, PomboId = p7.Id, Posicao = 3 },
            new ResultadoCompeticao { CompeticaoId = comp4.Id, PomboId = p3.Id, Posicao = 5 },
            // Copa Outono
            new ResultadoCompeticao { CompeticaoId = comp5.Id, PomboId = p7.Id, Posicao = 1 },
            new ResultadoCompeticao { CompeticaoId = comp5.Id, PomboId = p1.Id, Posicao = 2 },
            new ResultadoCompeticao { CompeticaoId = comp5.Id, PomboId = p3.Id, Posicao = 4 },
            new ResultadoCompeticao { CompeticaoId = comp5.Id, PomboId = p5.Id, Posicao = 3 }
        );
        await db.SaveChangesAsync();

        // ── ACASALAMENTOS ────────────────────────────────────────────────────
        db.Acasalamentos.AddRange(
            new Acasalamento
            {
                MachoId = p1.Id, FemeaId = p2.Id,
                DataUniao = hoje.AddMonths(-4),
                QuantidadeOvos = 2, FilhotesNascidos = 2,
                PrevisaoNascimento = hoje.AddMonths(-3).AddDays(18),
                Status = StatusAcasalamento.Concluido,
                Observacoes = "Filhotes saudáveis, boa conformação"
            },
            new Acasalamento
            {
                MachoId = p3.Id, FemeaId = p4.Id,
                DataUniao = hoje.AddMonths(-3),
                QuantidadeOvos = 2, FilhotesNascidos = 1,
                PrevisaoNascimento = hoje.AddMonths(-2).AddDays(18),
                Status = StatusAcasalamento.Concluido,
                Observacoes = "Um ovo não eclodiu"
            },
            new Acasalamento
            {
                MachoId = p5.Id, FemeaId = p6.Id,
                DataUniao = hoje.AddMonths(-2),
                QuantidadeOvos = 2, FilhotesNascidos = 0,
                PrevisaoNascimento = hoje.AddMonths(-1).AddDays(18),
                Status = StatusAcasalamento.EmAndamento
            },
            new Acasalamento
            {
                MachoId = p7.Id, FemeaId = p2.Id,
                DataUniao = hoje.AddMonths(-1),
                QuantidadeOvos = 0, FilhotesNascidos = 0,
                PrevisaoNascimento = hoje.AddDays(18),
                Status = StatusAcasalamento.Planejado
            },
            new Acasalamento
            {
                MachoId = p1.Id, FemeaId = p4.Id,
                DataUniao = hoje.AddDays(-10),
                QuantidadeOvos = 0, FilhotesNascidos = 0,
                PrevisaoNascimento = hoje.AddDays(28),
                Status = StatusAcasalamento.Planejado,
                Observacoes = "Cruzamento experimental de linhagens"
            }
        );
        await db.SaveChangesAsync();

        // ── REGISTROS DE SAÚDE ───────────────────────────────────────────────
        var registros = new List<RegistroSaude>();

        // Vacinas passadas (aparecem nos gráficos dos últimos 6 meses)
        foreach (var (p, mesesAtras) in new[] { (p1, 5), (p2, 5), (p3, 5), (p4, 5) })
            registros.Add(new RegistroSaude { PomboId = p.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Vacina Newcastle", Data = hoje.AddMonths(-mesesAtras), ProximaDose = hoje.AddMonths(-mesesAtras + 6), Status = StatusRegistroSaude.Concluido });

        foreach (var (p, mesesAtras) in new[] { (p5, 4), (p6, 4), (p7, 4) })
            registros.Add(new RegistroSaude { PomboId = p.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Vacina Paramixovírus", Data = hoje.AddMonths(-mesesAtras), ProximaDose = hoje.AddMonths(-mesesAtras + 6), Status = StatusRegistroSaude.Concluido });

        foreach (var (p, mesesAtras) in new[] { (p1, 3), (p3, 3), (p5, 3) })
            registros.Add(new RegistroSaude { PomboId = p.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Varicela aviária", Data = hoje.AddMonths(-mesesAtras), ProximaDose = hoje.AddMonths(-mesesAtras + 12), Status = StatusRegistroSaude.Concluido });

        // Exames e tratamentos
        registros.Add(new RegistroSaude { PomboId = p1.Id, Tipo = TipoRegistroSaude.Exame, Descricao = "Check-up pré-temporada", Data = hoje.AddMonths(-2), Status = StatusRegistroSaude.Concluido, Observacoes = "Ótimo estado físico" });
        registros.Add(new RegistroSaude { PomboId = p3.Id, Tipo = TipoRegistroSaude.Exame, Descricao = "Check-up pré-temporada", Data = hoje.AddMonths(-2), Status = StatusRegistroSaude.Concluido });
        registros.Add(new RegistroSaude { PomboId = p5.Id, Tipo = TipoRegistroSaude.Exame, Descricao = "Check-up pré-temporada", Data = hoje.AddMonths(-2), Status = StatusRegistroSaude.Concluido });
        registros.Add(new RegistroSaude { PomboId = p7.Id, Tipo = TipoRegistroSaude.Exame, Descricao = "Exame parasitológico", Data = hoje.AddMonths(-1), Status = StatusRegistroSaude.Concluido, Observacoes = "Resultado negativo" });

        // Tratamentos em andamento (status Agendado = aparece em "Em Tratamento")
        registros.Add(new RegistroSaude { PomboId = p2.Id, Tipo = TipoRegistroSaude.Tratamento, Descricao = "Tratamento Tricomoníase", Data = hoje.AddDays(-7), ProximaDose = hoje.AddDays(7), Status = StatusRegistroSaude.Agendado, Observacoes = "Repetir em 7 dias" });
        registros.Add(new RegistroSaude { PomboId = p4.Id, Tipo = TipoRegistroSaude.Medicamento, Descricao = "Antibiótico — Ronidazol", Data = hoje.AddDays(-3), ProximaDose = hoje.AddDays(4), Status = StatusRegistroSaude.Agendado });

        // Vacinas futuras próximas (aparecem na agenda)
        registros.Add(new RegistroSaude { PomboId = p1.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Reforço Newcastle", Data = hoje.AddMonths(-1), ProximaDose = hoje.AddDays(5), Status = StatusRegistroSaude.Agendado });
        registros.Add(new RegistroSaude { PomboId = p2.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Reforço Paramixovírus", Data = hoje.AddMonths(-1), ProximaDose = hoje.AddDays(8), Status = StatusRegistroSaude.Agendado });
        registros.Add(new RegistroSaude { PomboId = p3.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Reforço Newcastle", Data = hoje.AddMonths(-1), ProximaDose = hoje.AddDays(10), Status = StatusRegistroSaude.Agendado });
        registros.Add(new RegistroSaude { PomboId = p5.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Varicela aviária — reforço", Data = hoje.AddMonths(-1), ProximaDose = hoje.AddDays(20), Status = StatusRegistroSaude.Agendado });
        registros.Add(new RegistroSaude { PomboId = p6.Id, Tipo = TipoRegistroSaude.Exame, Descricao = "Exame de sangue completo", Data = hoje, ProximaDose = hoje.AddDays(30), Status = StatusRegistroSaude.Agendado });
        registros.Add(new RegistroSaude { PomboId = p7.Id, Tipo = TipoRegistroSaude.Vacina, Descricao = "Reforço Paramixovírus", Data = hoje.AddMonths(-1), ProximaDose = hoje.AddDays(35), Status = StatusRegistroSaude.Agendado });

        db.RegistrosSaude.AddRange(registros);
        await db.SaveChangesAsync();
    }
}
