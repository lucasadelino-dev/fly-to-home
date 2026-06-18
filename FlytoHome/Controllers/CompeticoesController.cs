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
        try
        {
            db.Competicoes.Add(competicao);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = competicao.Id }, competicao);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Erro ao salvar a competição. Verifique os dados informados." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Competicao competicao)
    {
        if (id != competicao.Id) return BadRequest(new { message = "ID inválido." });
        var existing = await db.Competicoes.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Nome = competicao.Nome;
        existing.Data = competicao.Data;
        existing.Local = competicao.Local;
        existing.Distancia = competicao.Distancia;
        existing.Observacoes = competicao.Observacoes;

        try
        {
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Erro ao atualizar a competição." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await db.Competicoes.FindAsync(id);
        if (c == null) return NotFound();
        try
        {
            db.Competicoes.Remove(c);
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Não é possível remover esta competição pois ela possui resultados vinculados." });
        }
    }

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
        var competicao = await db.Competicoes.FindAsync(id);
        if (competicao == null) return NotFound(new { message = "Competição não encontrada." });

        try
        {
            resultado.CompeticaoId = id;
            db.ResultadosCompeticao.Add(resultado);
            await db.SaveChangesAsync();
            return Ok(resultado);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Erro ao adicionar resultado. Verifique os dados informados." });
        }
    }

    [HttpDelete("resultados/{resultadoId}")]
    public async Task<IActionResult> DeleteResultado(int resultadoId)
    {
        var r = await db.ResultadosCompeticao.FindAsync(resultadoId);
        if (r == null) return NotFound();
        try
        {
            db.ResultadosCompeticao.Remove(r);
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Não é possível remover este resultado." });
        }
    }
}
