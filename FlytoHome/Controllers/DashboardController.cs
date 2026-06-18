using FlytoHome.Data;
using FlytoHome.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    private record Atividade(string Tipo, string Descricao, DateTime Data);

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var totalPombos = await db.Pombos.CountAsync(p => p.Status == StatusPombo.Ativo);
        var pombosTotal  = await db.Pombos.CountAsync();

        var emTratamento = await db.RegistrosSaude
            .Where(r => r.Status == StatusRegistroSaude.Agendado)
            .Select(r => r.PomboId).Distinct().CountAsync();

        var totalCompeticoes = await db.Competicoes.CountAsync();
        var totalResultados  = await db.ResultadosCompeticao.CountAsync();
        var vitorias         = await db.ResultadosCompeticao.CountAsync(r => r.Posicao == 1);
        var taxaVitoria      = totalResultados > 0 ? Math.Round((double)vitorias / totalResultados * 100, 1) : 0;

        var acasalamentosAtivos = await db.Acasalamentos
            .CountAsync(a => a.Status != StatusAcasalamento.Concluido);

        var totalFilhotes = await db.Acasalamentos
            .SumAsync(a => (int?)a.FilhotesNascidos) ?? 0;

        var seisAtras = DateTime.Today.AddMonths(-6);

        var competicoesPorMes = await db.Competicoes
            .Where(c => c.Data >= seisAtras)
            .GroupBy(c => new { c.Data.Year, c.Data.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Total = g.Count() })
            .OrderBy(g => g.Year).ThenBy(g => g.Month)
            .ToListAsync();

        var saudePorMes = await db.RegistrosSaude
            .Where(r => r.Data >= seisAtras)
            .GroupBy(r => new { r.Data.Year, r.Data.Month })
            .Select(g => new {
                g.Key.Year,
                g.Key.Month,
                Concluidos = g.Count(x => x.Status == StatusRegistroSaude.Concluido),
                Agendados  = g.Count(x => x.Status == StatusRegistroSaude.Agendado)
            })
            .OrderBy(g => g.Year).ThenBy(g => g.Month)
            .ToListAsync();

        // Próximas competições
        var proximasCompeticoes = await db.Competicoes
            .Where(c => c.Data >= DateTime.Today)
            .OrderBy(c => c.Data)
            .Take(4)
            .Select(c => new { c.Nome, Data = c.Data.ToString("o"), c.Local })
            .ToListAsync();

        // Top performers: pombos com mais 1.º lugares
        var topVencedores = await db.ResultadosCompeticao
            .Where(r => r.Posicao == 1)
            .GroupBy(r => r.PomboId)
            .Select(g => new { PomboId = g.Key, Vitorias = g.Count() })
            .OrderByDescending(g => g.Vitorias)
            .Take(5)
            .ToListAsync();

        var topIds = topVencedores.Select(t => t.PomboId).ToList();
        var topPombosInfo = await db.Pombos
            .Where(p => topIds.Contains(p.Id))
            .Select(p => new { p.Id, p.Nome, p.Anilha })
            .ToListAsync();

        var topPerformers = topVencedores
            .Join(topPombosInfo, t => t.PomboId, p => p.Id,
                  (t, p) => new { p.Nome, p.Anilha, t.Vitorias })
            .OrderByDescending(t => t.Vitorias)
            .ToList();

        // Atividades recentes
        var recentesAcasalamentos = await db.Acasalamentos
            .Include(a => a.Macho).Include(a => a.Femea)
            .OrderByDescending(a => a.DataUniao).Take(5)
            .Select(a => new Atividade("Acasalamento", a.Macho.Nome + " x " + a.Femea.Nome, a.DataUniao))
            .ToListAsync();

        var recentesVacinas = await db.RegistrosSaude
            .Include(r => r.Pombo)
            .Where(r => r.Tipo == TipoRegistroSaude.Vacina && r.Status == StatusRegistroSaude.Concluido)
            .OrderByDescending(r => r.Data).Take(5)
            .Select(r => new Atividade("Vacina", r.Pombo.Nome + " – " + r.Descricao, r.Data))
            .ToListAsync();

        var atividadesRecentes = recentesAcasalamentos
            .Concat(recentesVacinas)
            .OrderByDescending(a => a.Data)
            .Take(8)
            .Select(a => new { a.Tipo, a.Descricao, Data = a.Data.ToString("o") })
            .ToList();

        return Ok(new
        {
            totalPombos,
            pombosTotal,
            emTratamento,
            totalCompeticoes,
            vitorias,
            taxaVitoria,
            acasalamentosAtivos,
            totalFilhotes,
            competicoesPorMes,
            saudePorMes,
            proximasCompeticoes,
            topPerformers,
            atividadesRecentes,
        });
    }
}
