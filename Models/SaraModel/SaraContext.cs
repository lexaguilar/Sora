using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Sora.Models.SaraModel
{
    public partial class SaraContext : DbContext
    {
        public SaraContext()
        {
        }

        public SaraContext(DbContextOptions<SaraContext> options)
            : base(options)
        {
        }

        public virtual DbSet<App> App { get; set; }
        public virtual DbSet<AreaExistencias> AreaExistencias { get; set; }
        public virtual DbSet<Areas> Areas { get; set; }
        public virtual DbSet<AsientoEstado> AsientoEstado { get; set; }
        public virtual DbSet<Asientos> Asientos { get; set; }
        public virtual DbSet<AsientosDetalle> AsientosDetalle { get; set; }
        public virtual DbSet<Bancos> Bancos { get; set; }
        public virtual DbSet<CentroCosto> CentroCosto { get; set; }
        public virtual DbSet<Clasificacion> Clasificacion { get; set; }
        public virtual DbSet<Clientes> Clientes { get; set; }
        public virtual DbSet<CompraEstado> CompraEstado { get; set; }
        public virtual DbSet<CompraEtapa> CompraEtapa { get; set; }
        public virtual DbSet<Compras> Compras { get; set; }
        public virtual DbSet<ComprasDetalle> ComprasDetalle { get; set; }
        public virtual DbSet<Cortes> Cortes { get; set; }
        public virtual DbSet<Cuentas> Cuentas { get; set; }
        public virtual DbSet<EntradaEstado> EntradaEstado { get; set; }
        public virtual DbSet<EntradaTipos> EntradaTipos { get; set; }
        public virtual DbSet<Entradas> Entradas { get; set; }
        public virtual DbSet<EntradasDetalle> EntradasDetalle { get; set; }
        public virtual DbSet<Familia> Familia { get; set; }
        public virtual DbSet<FormaPago> FormaPago { get; set; }
        public virtual DbSet<Grupos> Grupos { get; set; }
        public virtual DbSet<Inventario> Inventario { get; set; }
        public virtual DbSet<InventarioEstado> InventarioEstado { get; set; }
        public virtual DbSet<Moneda> Moneda { get; set; }
        public virtual DbSet<Naturaleza> Naturaleza { get; set; }
        public virtual DbSet<Presentacion> Presentacion { get; set; }
        public virtual DbSet<Proveedores> Proveedores { get; set; }
        public virtual DbSet<SalidaEstado> SalidaEstado { get; set; }
        public virtual DbSet<SalidaTipos> SalidaTipos { get; set; }
        public virtual DbSet<Salidas> Salidas { get; set; }
        public virtual DbSet<SalidasDetalle> SalidasDetalle { get; set; }
        public virtual DbSet<TasaDeCambio> TasaDeCambio { get; set; }
        public virtual DbSet<TipoComprobantes> TipoComprobantes { get; set; }
        public virtual DbSet<TipoCuenta> TipoCuenta { get; set; }
        public virtual DbSet<TipoPago> TipoPago { get; set; }
        public virtual DbSet<UnidadMedida> UnidadMedida { get; set; }
        public virtual DbSet<UsuarioEstado> UsuarioEstado { get; set; }
        public virtual DbSet<Usuarios> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=LEX-PC\\PCLEX;Database=Sara;User Id=sa;Password=123;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<App>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Correo)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FullName)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Slogan).HasMaxLength(250);

                entity.Property(e => e.Telefono)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Area)
                    .WithMany(p => p.App)
                    .HasForeignKey(d => d.AreaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_App_Areas");

                entity.HasOne(d => d.CompCtaxPagarCuenta)
                    .WithMany(p => p.AppCompCtaxPagarCuenta)
                    .HasForeignKey(d => d.CompCtaxPagarCuentaId)
                    .HasConstraintName("FK_App_Cuentas7");

                entity.HasOne(d => d.CompIvaAcreditableCuenta)
                    .WithMany(p => p.AppCompIvaAcreditableCuenta)
                    .HasForeignKey(d => d.CompIvaAcreditableCuentaId)
                    .HasConstraintName("FK_App_Cuentas6");

                entity.HasOne(d => d.VtaCajaGeneralCuenta)
                    .WithMany(p => p.AppVtaCajaGeneralCuenta)
                    .HasForeignKey(d => d.VtaCajaGeneralCuentaId)
                    .HasConstraintName("FK_App_Cuentas4");

                entity.HasOne(d => d.VtaClienteCuenta)
                    .WithMany(p => p.AppVtaClienteCuenta)
                    .HasForeignKey(d => d.VtaClienteCuentaId)
                    .HasConstraintName("FK_App_Cuentas5");

                entity.HasOne(d => d.VtaCostoVentaCuenta)
                    .WithMany(p => p.AppVtaCostoVentaCuenta)
                    .HasForeignKey(d => d.VtaCostoVentaCuentaId)
                    .HasConstraintName("FK_App_Cuentas1");

                entity.HasOne(d => d.VtaInventarioCuenta)
                    .WithMany(p => p.AppVtaInventarioCuenta)
                    .HasForeignKey(d => d.VtaInventarioCuentaId)
                    .HasConstraintName("FK_App_Cuentas");

                entity.HasOne(d => d.VtaIvaPorPagarCuenta)
                    .WithMany(p => p.AppVtaIvaPorPagarCuenta)
                    .HasForeignKey(d => d.VtaIvaPorPagarCuentaId)
                    .HasConstraintName("FK_App_Cuentas2");

                entity.HasOne(d => d.VtaVentaCuenta)
                    .WithMany(p => p.AppVtaVentaCuenta)
                    .HasForeignKey(d => d.VtaVentaCuentaId)
                    .HasConstraintName("FK_App_Cuentas3");
            });

            modelBuilder.Entity<AreaExistencias>(entity =>
            {
                entity.HasKey(e => new { e.AreaId, e.InventarioId });

                entity.Property(e => e.CostoPromedio).HasColumnType("money");

                entity.Property(e => e.CostoReal).HasColumnType("money");

                entity.Property(e => e.Precio).HasColumnType("money");

                entity.HasOne(d => d.Area)
                    .WithMany(p => p.AreaExistencias)
                    .HasForeignKey(d => d.AreaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AreaExistencias_Areas");

                entity.HasOne(d => d.Inventario)
                    .WithMany(p => p.AreaExistencias)
                    .HasForeignKey(d => d.InventarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AreaExistencias_Inventario");
            });

            modelBuilder.Entity<Areas>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<AsientoEstado>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Asientos>(entity =>
            {
                entity.HasIndex(e => e.ClienteId);

                entity.HasIndex(e => e.CorteId);

                entity.HasIndex(e => e.CuentaId);

                entity.HasIndex(e => e.Fecha);

                entity.HasIndex(e => e.Id)
                    .HasName("IX_Asientos_MonedaId");

                entity.HasIndex(e => e.Numero);

                entity.HasIndex(e => e.TipoComprobanteId)
                    .HasName("IX_Asientos_TipoComprobando");

                entity.Property(e => e.Codigo).HasMaxLength(50);

                entity.Property(e => e.Concepto).HasMaxLength(500);

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.Observacion).HasMaxLength(500);

                entity.Property(e => e.PagueseA).HasMaxLength(500);

                entity.Property(e => e.Referencia).HasMaxLength(50);

                entity.HasOne(d => d.Cliente)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.ClienteId)
                    .HasConstraintName("FK_Asientos_Clientes");

                entity.HasOne(d => d.Corte)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.CorteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Asientos_Cortes");

                entity.HasOne(d => d.Cuenta)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.CuentaId)
                    .HasConstraintName("FK_Asientos_Cuentas");

                entity.HasOne(d => d.Estado)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.EstadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Asientos_AsientoEstado");

                entity.HasOne(d => d.Moneda)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.MonedaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Asientos_Moneda");

                entity.HasOne(d => d.TipoComprobante)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.TipoComprobanteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Asientos_TipoComprobantes");
            });

            modelBuilder.Entity<AsientosDetalle>(entity =>
            {
                entity.HasIndex(e => e.AsientoId);

                entity.HasIndex(e => e.CentroCostoId)
                    .HasName("IX_AsientosDetalle_CentroCosto");

                entity.HasIndex(e => e.CuentaId);

                entity.Property(e => e.Referencia)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.Asiento)
                    .WithMany(p => p.AsientosDetalle)
                    .HasForeignKey(d => d.AsientoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AsientosDetalle_Asientos");

                entity.HasOne(d => d.CentroCosto)
                    .WithMany(p => p.AsientosDetalle)
                    .HasForeignKey(d => d.CentroCostoId)
                    .HasConstraintName("FK_AsientosDetalle_CentroCosto");
            });

            modelBuilder.Entity<Bancos>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Cuenta)
                    .WithMany(p => p.Bancos)
                    .HasForeignKey(d => d.CuentaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Bancos_Cuentas");
            });

            modelBuilder.Entity<CentroCosto>(entity =>
            {
                entity.Property(e => e.Cuenta)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Clasificacion>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<Clientes>(entity =>
            {
                entity.Property(e => e.Contacto).HasMaxLength(150);

                entity.Property(e => e.Correo).HasMaxLength(50);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Telefono)
                    .HasMaxLength(8)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CompraEstado>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<CompraEtapa>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Compras>(entity =>
            {
                entity.HasIndex(e => e.BancoId);

                entity.HasIndex(e => e.EntradaId);

                entity.HasIndex(e => e.EstadoId);

                entity.HasIndex(e => e.EtapaId);

                entity.HasIndex(e => e.Fecha);

                entity.HasIndex(e => e.FormaPagoId);

                entity.HasIndex(e => e.MonedaId);

                entity.HasIndex(e => e.ProveedorId);

                entity.HasIndex(e => e.TipoPagoId);

                entity.Property(e => e.Descuento).HasColumnType("money");

                entity.Property(e => e.Fecha).HasColumnType("datetime");

                entity.Property(e => e.Iva)
                    .HasColumnName("IVA")
                    .HasColumnType("money");

                entity.Property(e => e.Observacion)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Referencia)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.SubTotal).HasColumnType("money");

                entity.Property(e => e.Total).HasColumnType("money");

                entity.HasOne(d => d.Banco)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.BancoId)
                    .HasConstraintName("FK_Compras_Bancos");

                entity.HasOne(d => d.Estado)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.EstadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_CompraEstado");

                entity.HasOne(d => d.Etapa)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.EtapaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_CompraEtapa");

                entity.HasOne(d => d.FormaPago)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.FormaPagoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_FormaPago");

                entity.HasOne(d => d.Moneda)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.MonedaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_Moneda");

                entity.HasOne(d => d.Proveedor)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.ProveedorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_Proveedores");

                entity.HasOne(d => d.TipoPago)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.TipoPagoId)
                    .HasConstraintName("FK_Compras_TipoPago");
            });

            modelBuilder.Entity<ComprasDetalle>(entity =>
            {
                entity.HasIndex(e => e.CompraId);

                entity.HasIndex(e => e.InventarioId);

                entity.Property(e => e.Costo).HasColumnType("money");

                entity.Property(e => e.CostoPromedio).HasColumnType("money");

                entity.Property(e => e.DescuentoAverage).HasComment("% de descuento");

                entity.Property(e => e.DescuentoMonto).HasColumnType("money");

                entity.Property(e => e.Documento)
                    .HasMaxLength(15)
                    .HasComment("Numero de factura del proveedor");

                entity.Property(e => e.Importe)
                    .HasColumnType("money")
                    .HasComment("Subtotal menos descuento");

                entity.Property(e => e.IvaMonto).HasColumnType("money");

                entity.Property(e => e.NuevoPrecio).HasColumnType("money");

                entity.Property(e => e.Precio).HasColumnType("money");

                entity.Property(e => e.SubTotal)
                    .HasColumnType("money")
                    .HasComment("Cantidad por el costo");

                entity.Property(e => e.Total)
                    .HasColumnType("money")
                    .HasComment("Importe mas iva");

                entity.Property(e => e.UltimoPrecio).HasColumnType("money");

                entity.HasOne(d => d.Compra)
                    .WithMany(p => p.ComprasDetalle)
                    .HasForeignKey(d => d.CompraId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ComprasDetalle_Compras");

                entity.HasOne(d => d.Inventario)
                    .WithMany(p => p.ComprasDetalle)
                    .HasForeignKey(d => d.InventarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ComprasDetalle_Inventario");
            });

            modelBuilder.Entity<Cortes>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Final).HasColumnType("datetime");

                entity.Property(e => e.Inicio).HasColumnType("datetime");
            });

            modelBuilder.Entity<Cuentas>(entity =>
            {
                entity.HasIndex(e => e.Numero)
                    .HasName("IX_Cuentas");

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Numero)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.Clasificacion)
                    .WithMany(p => p.Cuentas)
                    .HasForeignKey(d => d.ClasificacionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Cuentas_Clasificacion");

                entity.HasOne(d => d.Grupo)
                    .WithMany(p => p.Cuentas)
                    .HasForeignKey(d => d.GrupoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Cuentas_Grupos");

                entity.HasOne(d => d.Naturaleza)
                    .WithMany(p => p.Cuentas)
                    .HasForeignKey(d => d.NaturalezaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Cuentas_Naturaleza");

                entity.HasOne(d => d.TipoCuenta)
                    .WithMany(p => p.Cuentas)
                    .HasForeignKey(d => d.TipoCuentaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Cuentas_TipoCuenta");
            });

            modelBuilder.Entity<EntradaEstado>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<EntradaTipos>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Entradas>(entity =>
            {
                entity.HasIndex(e => e.AreaId);

                entity.HasIndex(e => e.BancoId);

                entity.HasIndex(e => e.EstadoId);

                entity.HasIndex(e => e.Fecha);

                entity.HasIndex(e => e.MonedaId);

                entity.HasIndex(e => e.Numero);

                entity.HasIndex(e => e.TipoId)
                    .HasName("IX_Entradas_TpoId");

                entity.HasIndex(e => e.TipoPagoId);

                entity.Property(e => e.Descuento).HasColumnType("money");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.Iva).HasColumnType("money");

                entity.Property(e => e.Observacion).HasMaxLength(500);

                entity.Property(e => e.SubTotal).HasColumnType("money");

                entity.Property(e => e.Total).HasColumnType("money");

                entity.HasOne(d => d.Area)
                    .WithMany(p => p.Entradas)
                    .HasForeignKey(d => d.AreaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Entradas_Areas");

                entity.HasOne(d => d.Banco)
                    .WithMany(p => p.Entradas)
                    .HasForeignKey(d => d.BancoId)
                    .HasConstraintName("FK_Entradas_Bancos");

                entity.HasOne(d => d.Compra)
                    .WithMany(p => p.Entradas)
                    .HasForeignKey(d => d.CompraId)
                    .HasConstraintName("FK_Entradas_Compras");

                entity.HasOne(d => d.Estado)
                    .WithMany(p => p.Entradas)
                    .HasForeignKey(d => d.EstadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Entradas_EntradaEstado");

                entity.HasOne(d => d.Moneda)
                    .WithMany(p => p.Entradas)
                    .HasForeignKey(d => d.MonedaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Entradas_Moneda");

                entity.HasOne(d => d.Tipo)
                    .WithMany(p => p.Entradas)
                    .HasForeignKey(d => d.TipoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Entradas_EntradaTipos");

                entity.HasOne(d => d.TipoPago)
                    .WithMany(p => p.Entradas)
                    .HasForeignKey(d => d.TipoPagoId)
                    .HasConstraintName("FK_Entradas_TipoPago");
            });

            modelBuilder.Entity<EntradasDetalle>(entity =>
            {
                entity.HasIndex(e => e.EntradaId);

                entity.HasIndex(e => e.InventarioId);

                entity.Property(e => e.Costo).HasColumnType("money");

                entity.Property(e => e.CostoPromedio).HasColumnType("money");

                entity.Property(e => e.DescuentoAverage).HasComment("% de descuento");

                entity.Property(e => e.DescuentoMonto).HasColumnType("money");

                entity.Property(e => e.Importe)
                    .HasColumnType("money")
                    .HasComment("Subtotal menos descuento");

                entity.Property(e => e.IvaMonto).HasColumnType("money");

                entity.Property(e => e.Precio).HasColumnType("money");

                entity.Property(e => e.SubTotal).HasColumnType("money");

                entity.Property(e => e.Total)
                    .HasColumnType("money")
                    .HasComment("Importe mas iva");

                entity.HasOne(d => d.Entrada)
                    .WithMany(p => p.EntradasDetalle)
                    .HasForeignKey(d => d.EntradaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EntradasDetalle_Entradas");

                entity.HasOne(d => d.Inventario)
                    .WithMany(p => p.EntradasDetalle)
                    .HasForeignKey(d => d.InventarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EntradasDetalle_Inventario");
            });

            modelBuilder.Entity<Familia>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Iva).HasColumnName("IVA");
            });

            modelBuilder.Entity<FormaPago>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Grupos>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Inventario>(entity =>
            {
                entity.HasIndex(e => e.EstadoId)
                    .HasName("IX_Inventario_Estado");

                entity.HasIndex(e => e.FamiliaId)
                    .HasName("IX_Inventario_Familia");

                entity.HasIndex(e => e.Nombre);

                entity.HasIndex(e => e.Numero)
                    .IsUnique();

                entity.HasIndex(e => e.PresentacionId)
                    .HasName("IX_Inventario_Presentacion");

                entity.HasIndex(e => e.UnidadMedidaId)
                    .HasName("IX_Inventario_UnidadMedida");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Iva).HasColumnName("IVA");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasOne(d => d.Estado)
                    .WithMany(p => p.Inventario)
                    .HasForeignKey(d => d.EstadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Inventario_InventarioEstado");

                entity.HasOne(d => d.Familia)
                    .WithMany(p => p.Inventario)
                    .HasForeignKey(d => d.FamiliaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Inventario_Familia");

                entity.HasOne(d => d.Presentacion)
                    .WithMany(p => p.Inventario)
                    .HasForeignKey(d => d.PresentacionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Inventario_Presentacion");

                entity.HasOne(d => d.UnidadMedida)
                    .WithMany(p => p.Inventario)
                    .HasForeignKey(d => d.UnidadMedidaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Inventario_UnidadMedida");
            });

            modelBuilder.Entity<InventarioEstado>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Moneda>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Abrev)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.App)
                    .WithMany(p => p.Moneda)
                    .HasForeignKey(d => d.AppId)
                    .HasConstraintName("FK_Moneda_App");
            });

            modelBuilder.Entity<Naturaleza>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<Presentacion>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Proveedores>(entity =>
            {
                entity.Property(e => e.Contacto).HasMaxLength(150);

                entity.Property(e => e.Correo).HasMaxLength(50);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Telefono)
                    .HasMaxLength(8)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SalidaEstado>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<SalidaTipos>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Salidas>(entity =>
            {
                entity.HasIndex(e => e.AreaId);

                entity.HasIndex(e => e.BancoId);

                entity.HasIndex(e => e.ClienteId);

                entity.HasIndex(e => e.EstadoId);

                entity.HasIndex(e => e.Fecha);

                entity.HasIndex(e => e.FormaPagoId);

                entity.HasIndex(e => e.MonedaId);

                entity.HasIndex(e => e.Numero);

                entity.HasIndex(e => e.TipoId);

                entity.HasIndex(e => e.TipoPagoId);

                entity.Property(e => e.Descuento).HasColumnType("money");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.Iva).HasColumnType("money");

                entity.Property(e => e.Observacion).HasMaxLength(500);

                entity.Property(e => e.SubTotal).HasColumnType("money");

                entity.Property(e => e.Total).HasColumnType("money");

                entity.HasOne(d => d.Area)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.AreaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Salidas_Areas");

                entity.HasOne(d => d.Banco)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.BancoId)
                    .HasConstraintName("FK_Salidas_Bancos");

                entity.HasOne(d => d.Cliente)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.ClienteId)
                    .HasConstraintName("FK_Salidas_Clientes");

                entity.HasOne(d => d.Estado)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.EstadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Salidas_SalidaEstado");

                entity.HasOne(d => d.FormaPago)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.FormaPagoId)
                    .HasConstraintName("FK_Salidas_FormaPago");

                entity.HasOne(d => d.Moneda)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.MonedaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Salidas_Moneda");

                entity.HasOne(d => d.Tipo)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.TipoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Salidas_SalidaTipos");

                entity.HasOne(d => d.TipoPago)
                    .WithMany(p => p.Salidas)
                    .HasForeignKey(d => d.TipoPagoId)
                    .HasConstraintName("FK_Salidas_TipoPago");
            });

            modelBuilder.Entity<SalidasDetalle>(entity =>
            {
                entity.HasIndex(e => e.InventarioId);

                entity.HasIndex(e => e.SalidaId);

                entity.Property(e => e.Costo).HasColumnType("money");

                entity.Property(e => e.CostoPromedio).HasColumnType("money");

                entity.Property(e => e.DescuentoMonto).HasColumnType("money");

                entity.Property(e => e.Importe).HasColumnType("money");

                entity.Property(e => e.IvaMonto).HasColumnType("money");

                entity.Property(e => e.Precio).HasColumnType("money");

                entity.Property(e => e.SubTotal).HasColumnType("money");

                entity.Property(e => e.Total).HasColumnType("money");

                entity.HasOne(d => d.Inventario)
                    .WithMany(p => p.SalidasDetalle)
                    .HasForeignKey(d => d.InventarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SalidasDetalle_Inventario");

                entity.HasOne(d => d.Salida)
                    .WithMany(p => p.SalidasDetalle)
                    .HasForeignKey(d => d.SalidaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SalidasDetalle_Salidas");
            });

            modelBuilder.Entity<TasaDeCambio>(entity =>
            {
                entity.HasIndex(e => e.Id)
                    .HasName("IX_TasaDeCambio_Fecha")
                    .IsUnique();

                entity.Property(e => e.Fecha).HasColumnType("date");
            });

            modelBuilder.Entity<TipoComprobantes>(entity =>
            {
                entity.Property(e => e.Abrev)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<TipoCuenta>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<TipoPago>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UnidadMedida>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<UsuarioEstado>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Usuarios>(entity =>
            {
                entity.HasKey(e => e.Username);

                entity.HasIndex(e => e.AreaId)
                    .HasName("IX_Usuarios_Area");

                entity.Property(e => e.Username).HasMaxLength(50);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.HasOne(d => d.Area)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.AreaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Usuarios_Areas");

                entity.HasOne(d => d.Estado)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.EstadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Usuarios_UsuarioEstado");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
