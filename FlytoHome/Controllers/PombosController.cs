using FlytoHome.Data;
using FlytoHome.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PombosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        var query = db.Pombos.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Nome.Contains(search) || p.Anilha.Contains(search));
        var pombos = await query
            .Select(p => new {
                p.Id, p.Anilha, p.Nome, p.Sexo, p.DataNascimento, p.Cor, p.Origem, p.Status,
                p.PaiId, PaiNome = p.Pai != null ? p.Pai.Nome : null,
                p.MaeId, MaeNome = p.Mae != null ? p.Mae.Nome : null
            }).ToListAsync();
        return Ok(pombos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await db.Pombos
            .Include(x => x.Pai)
            .Include(x => x.Mae)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound();
        return Ok(p);
    }

    [HttpGet("{id}/pedigree")]
    public async Task<IActionResult> GetPedigree(int id)
    {
        var pombo = await db.Pombos.FindAsync(id);
        if (pombo == null) return NotFound();

        async Task<object?> BuildTree(int? pomboId, int depth)
        {
            if (pomboId == null || depth <= 0) return null;
            var p = await db.Pombos.FindAsync(pomboId);
            if (p == null) return null;
            return new
            {
                p.Id, p.Anilha, p.Nome, p.Sexo, p.Cor,
                Pai = await BuildTree(p.PaiId, depth - 1),
                Mae = await BuildTree(p.MaeId, depth - 1)
            };
        }

        var tree = new
        {
            pombo.Id, pombo.Anilha, pombo.Nome, pombo.Sexo, pombo.Cor,
            Pai = await BuildTree(pombo.PaiId, 3),
            Mae = await BuildTree(pombo.MaeId, 3)
        };
        return Ok(tree);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Pombo pombo)
    {
        db.Pombos.Add(pombo);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = pombo.Id }, pombo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Pombo pombo)
    {
        if (id != pombo.Id) return BadRequest();
        db.Entry(pombo).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var pombo = await db.Pombos.FindAsync(id);
        if (pombo == null) return NotFound();
        db.Pombos.Remove(pombo);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
