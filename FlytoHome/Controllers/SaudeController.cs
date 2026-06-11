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
        db.RegistrosSaude.Add(registro);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = registro.Id }, registro);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, RegistroSaude registro)
    {
        if (id != registro.Id) return BadRequest();
        db.Entry(registro).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var r = await db.RegistrosSaude.FindAsync(id);
        if (r == null) return NotFound();
        db.RegistrosSaude.Remove(r);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
