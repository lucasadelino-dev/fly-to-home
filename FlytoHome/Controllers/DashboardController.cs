using FlytoHome.Data;
using FlytoHome.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var totalPombos = await db.Pombos.CountAsync(p => p.Status == StatusPombo.Ativo);
        var emTratamento = await db.RegistrosSaude
            .Where(r => r.Status == StatusRegistroSaude.Agendado)
            .Select(r => r.PomboId).Distinct().CountAsync();

        var totalCompeticoes = await db.Competicoes.CountAsync();

        var totalResultados = await db.ResultadosCompeticao.CountAsync();
        var vitorias = await db.ResultadosCompeticao.CountAsync(r => r.Posicao == 1);
        var taxaVitoria = totalResultados > 0 ? Math.Round((double)vitorias / totalResultados * 100, 1) : 0;

        // Competições por mês (últimos 6 meses)
        var seisAtras = DateTime.Today.AddMonths(-6);
        var competicoesPorMes = await db.Competicoes
            .Where(c => c.Data >= seisAtras)
            .GroupBy(c => new { c.Data.Year, c.Data.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Total = g.Count() })
            .OrderBy(g => g.Year).ThenBy(g => g.Month)
            .ToListAsync();

        // Atividades recentes
        var recentesAcasalamentos = await db.Acasalamentos
            .Include(a => a.Macho).Include(a => a.Femea)
            .OrderByDescending(a => a.DataUniao).Take(5)
            .Select(a => new { tipo = "Acasalamento", descricao = $"{a.Macho.Nome} x {a.Femea.Nome}", data = a.DataUniao })
            .ToListAsync<object>();

        var recentesVacinas = await db.RegistrosSaude
            .Include(r => r.Pombo)
            .Where(r => r.Tipo == TipoRegistroSaude.Vacina && r.Status == StatusRegistroSaude.Concluido)
            .OrderByDescending(r => r.Data).Take(5)
            .Select(r => new { tipo = "Vacina", descricao = $"{r.Pombo.Nome} – {r.Descricao}", data = r.Data })
            .ToListAsync<object>();

        var atividades = recentesAcasalamentos.Concat(recentesVacinas)
            .OrderByDescending(a => ((dynamic)a).data)
            .Take(8).ToList();

        return Ok(new
        {
            totalPombos,
            emTratamento,
            totalCompeticoes,
            vitorias,
            taxaVitoria,
            competicoesPorMes,
            atividadesRecentes = atividades
        });
    }
}
