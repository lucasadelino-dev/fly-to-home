using FlytoHome.Data;
using FlytoHome.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SaudeController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? pomboId, [FromQuery] TipoRegistroSaude? tipo)
    {
        var query = db.RegistrosSaude.Include(r => r.Pombo).AsQueryable();
        if (pomboId.HasValue) query = query.Where(r => r.PomboId == pomboId);
        if (tipo.HasValue) query = query.Where(r => r.Tipo == tipo);
        return Ok(await query.ToListAsync());
    }

    [HttpGet("calendario")]
    public async Task<IActionResult> GetCalendario()
    {
        var hoje = DateTime.Today;
        var proximos = await db.RegistrosSaude
            .Include(r => r.Pombo)
            .Where(r => r.ProximaDose.HasValue && r.ProximaDose >= hoje)
            .OrderBy(r => r.ProximaDose)
            .Take(20)
            .ToListAsync();
        return Ok(proximos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var r = await db.RegistrosSaude.Include(x => x.Pombo).FirstOrDefaultAsync(x => x.Id == id);
        if (r == null) return NotFound();
        return Ok(r);
    }

    [HttpPost]
    public async Task<IActionResult> Create(RegistroSaude registro)
    {
        try
        {
            db.RegistrosSaude.Add(registro);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = registro.Id }, registro);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Erro ao salvar o registro de saúde. Verifique os dados informados." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, RegistroSaude registro)
    {
        if (id != registro.Id) return BadRequest(new { message = "ID inválido." });
        var existing = await db.RegistrosSaude.FindAsync(id);
        if (existing == null) return NotFound();

        existing.PomboId = registro.PomboId;
        existing.Tipo = registro.Tipo;
        existing.Descricao = registro.Descricao;
        existing.Data = registro.Data;
        existing.ProximaDose = registro.ProximaDose;
        existing.Status = registro.Status;
        existing.Observacoes = registro.Observacoes;

        try
        {
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Erro ao atualizar o registro de saúde." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var r = await db.RegistrosSaude.FindAsync(id);
        if (r == null) return NotFound();
        try
        {
            db.RegistrosSaude.Remove(r);
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Não é possível remover este registro de saúde." });
        }
    }
}
