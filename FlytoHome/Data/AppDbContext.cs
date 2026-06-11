using FlytoHome.Models;
using Microsoft.EntityFrameworkCore;

namespace FlytoHome.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Pombo> Pombos => Set<Pombo>();
    public DbSet<RegistroSaude> RegistrosSaude => Set<RegistroSaude>();
    public DbSet<Competicao> Competicoes => Set<Competicao>();
    public DbSet<ResultadoCompeticao> ResultadosCompeticao => Set<ResultadoCompeticao>();
    public DbSet<Acasalamento> Acasalamentos => Set<Acasalamento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Pombo>(e =>
        {
            e.HasIndex(p => p.Anilha).IsUnique();
            e.HasOne(p => p.Pai)
             .WithMany()
             .HasForeignKey(p => p.PaiId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(p => p.Mae)
             .WithMany()
             .HasForeignKey(p => p.MaeId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Acasalamento>(e =>
        {
            e.HasOne(a => a.Macho)
             .WithMany(p => p.AcasalamentosComMacho)
             .HasForeignKey(a => a.MachoId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.Femea)
             .WithMany(p => p.AcasalamentosComFemea)
             .HasForeignKey(a => a.FemeaId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
