using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlytoHome.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Competicoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Local = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Distancia = table.Column<double>(type: "float", nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competicoes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pombos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Anilha = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sexo = table.Column<int>(type: "int", nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Cor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Origem = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    PaiId = table.Column<int>(type: "int", nullable: true),
                    MaeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pombos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pombos_Pombos_MaeId",
                        column: x => x.MaeId,
                        principalTable: "Pombos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pombos_Pombos_PaiId",
                        column: x => x.PaiId,
                        principalTable: "Pombos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Acasalamentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MachoId = table.Column<int>(type: "int", nullable: false),
                    FemeaId = table.Column<int>(type: "int", nullable: false),
                    DataUniao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuantidadeOvos = table.Column<int>(type: "int", nullable: false),
                    FilhotesNascidos = table.Column<int>(type: "int", nullable: false),
                    PrevisaoNascimento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Acasalamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Acasalamentos_Pombos_FemeaId",
                        column: x => x.FemeaId,
                        principalTable: "Pombos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Acasalamentos_Pombos_MachoId",
                        column: x => x.MachoId,
                        principalTable: "Pombos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RegistrosSaude",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PomboId = table.Column<int>(type: "int", nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProximaDose = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosSaude", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosSaude_Pombos_PomboId",
                        column: x => x.PomboId,
                        principalTable: "Pombos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResultadosCompeticao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompeticaoId = table.Column<int>(type: "int", nullable: false),
                    PomboId = table.Column<int>(type: "int", nullable: false),
                    Posicao = table.Column<int>(type: "int", nullable: true),
                    Tempo = table.Column<TimeSpan>(type: "time", nullable: true),
                    Observacoes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResultadosCompeticao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResultadosCompeticao_Competicoes_CompeticaoId",
                        column: x => x.CompeticaoId,
                        principalTable: "Competicoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResultadosCompeticao_Pombos_PomboId",
                        column: x => x.PomboId,
                        principalTable: "Pombos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Acasalamentos_FemeaId",
                table: "Acasalamentos",
                column: "FemeaId");

            migrationBuilder.CreateIndex(
                name: "IX_Acasalamentos_MachoId",
                table: "Acasalamentos",
                column: "MachoId");

            migrationBuilder.CreateIndex(
                name: "IX_Pombos_Anilha",
                table: "Pombos",
                column: "Anilha",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pombos_MaeId",
                table: "Pombos",
                column: "MaeId");

            migrationBuilder.CreateIndex(
                name: "IX_Pombos_PaiId",
                table: "Pombos",
                column: "PaiId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosSaude_PomboId",
                table: "RegistrosSaude",
                column: "PomboId");

            migrationBuilder.CreateIndex(
                name: "IX_ResultadosCompeticao_CompeticaoId",
                table: "ResultadosCompeticao",
                column: "CompeticaoId");

            migrationBuilder.CreateIndex(
                name: "IX_ResultadosCompeticao_PomboId",
                table: "ResultadosCompeticao",
                column: "PomboId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Acasalamentos");

            migrationBuilder.DropTable(
                name: "RegistrosSaude");

            migrationBuilder.DropTable(
                name: "ResultadosCompeticao");

            migrationBuilder.DropTable(
                name: "Competicoes");

            migrationBuilder.DropTable(
                name: "Pombos");
        }
    }
}
