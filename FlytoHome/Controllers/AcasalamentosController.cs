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
        db.Acasalamentos.Add(acasalamento);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = acasalamento.Id }, acasalamento);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Acasalamento acasalamento)
    {
        if (id != acasalamento.Id) return BadRequest();
        db.Entry(acasalamento).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var a = await db.Acasalamentos.FindAsync(id);
        if (a == null) return NotFound();
        db.Acasalamentos.Remove(a);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
