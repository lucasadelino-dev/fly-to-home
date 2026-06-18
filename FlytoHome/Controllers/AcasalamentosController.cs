using FlytoHome.Data;
using FlytoHome.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AcasalamentosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await db.Acasalamentos
            .Include(a => a.Macho)
            .Include(a => a.Femea)
            .ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var a = await db.Acasalamentos.Include(x => x.Macho).Include(x => x.Femea)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (a == null) return NotFound();
        return Ok(a);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Acasalamento acasalamento)
    {
        try
        {
            db.Acasalamentos.Add(acasalamento);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = acasalamento.Id }, acasalamento);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Erro ao salvar o acasalamento. Verifique os dados informados." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Acasalamento acasalamento)
    {
        if (id != acasalamento.Id) return BadRequest(new { message = "ID inválido." });
        var existing = await db.Acasalamentos.FindAsync(id);
        if (existing == null) return NotFound();

        existing.MachoId = acasalamento.MachoId;
        existing.FemeaId = acasalamento.FemeaId;
        existing.DataUniao = acasalamento.DataUniao;
        existing.QuantidadeOvos = acasalamento.QuantidadeOvos;
        existing.FilhotesNascidos = acasalamento.FilhotesNascidos;
        existing.PrevisaoNascimento = acasalamento.PrevisaoNascimento;
        existing.Status = acasalamento.Status;
        existing.Observacoes = acasalamento.Observacoes;

        try
        {
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Erro ao atualizar o acasalamento." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var a = await db.Acasalamentos.FindAsync(id);
        if (a == null) return NotFound();
        try
        {
            db.Acasalamentos.Remove(a);
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Não é possível remover este acasalamento pois ele possui registros vinculados." });
        }
    }
}
