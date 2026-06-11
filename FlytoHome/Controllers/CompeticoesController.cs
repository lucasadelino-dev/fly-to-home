using FlytoHome.Data;
using FlytoHome.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompeticoesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var competicoes = await db.Competicoes
            .Include(c => c.Resultados)
            .ThenInclude(r => r.Pombo)
            .ToListAsync();
        return Ok(competicoes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await db.Competicoes.Include(x => x.Resultados).ThenInclude(r => r.Pombo)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (c == null) return NotFound();
        return Ok(c);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Competicao competicao)
    {
        db.Competicoes.Add(competicao);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = competicao.Id }, competicao);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Competicao competicao)
    {
        if (id != competicao.Id) return BadRequest();
        db.Entry(competicao).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await db.Competicoes.FindAsync(id);
        if (c == null) return NotFound();
        db.Competicoes.Remove(c);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // Resultados
    [HttpGet("{id}/resultados")]
    public async Task<IActionResult> GetResultados(int id)
    {
        var resultados = await db.ResultadosCompeticao
            .Include(r => r.Pombo)
            .Where(r => r.CompeticaoId == id)
            .OrderBy(r => r.Posicao)
            .ToListAsync();
        return Ok(resultados);
    }

    [HttpPost("{id}/resultados")]
    public async Task<IActionResult> AddResultado(int id, ResultadoCompeticao resultado)
    {
        resultado.CompeticaoId = id;
        db.ResultadosCompeticao.Add(resultado);
        await db.SaveChangesAsync();
        return Ok(resultado);
    }

    [HttpDelete("resultados/{resultadoId}")]
    public async Task<IActionResult> DeleteResultado(int resultadoId)
    {
        var r = await db.ResultadosCompeticao.FindAsync(resultadoId);
        if (r == null) return NotFound();
        db.ResultadosCompeticao.Remove(r);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
