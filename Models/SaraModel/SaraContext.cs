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

        public virtual DbSet<AsientoEstado> AsientoEstado { get; set; }
        public virtual DbSet<Asientos> Asientos { get; set; }
        public virtual DbSet<AsientosDetalle> AsientosDetalle { get; set; }
        public virtual DbSet<CentroCosto> CentroCosto { get; set; }
        public virtual DbSet<Clasificacion> Clasificacion { get; set; }
        public virtual DbSet<CompraEstado> CompraEstado { get; set; }
        public virtual DbSet<Compras> Compras { get; set; }
        public virtual DbSet<ComprasDetalle> ComprasDetalle { get; set; }
        public virtual DbSet<Cortes> Cortes { get; set; }
        public virtual DbSet<Cuentas> Cuentas { get; set; }
        public virtual DbSet<Entidades> Entidades { get; set; }
        public virtual DbSet<Familia> Familia { get; set; }
        public virtual DbSet<FormaPago> FormaPago { get; set; }
        public virtual DbSet<Grupos> Grupos { get; set; }
        public virtual DbSet<Inventario> Inventario { get; set; }
        public virtual DbSet<InventarioEstado> InventarioEstado { get; set; }
        public virtual DbSet<Moneda> Moneda { get; set; }
        public virtual DbSet<Naturaleza> Naturaleza { get; set; }
        public virtual DbSet<Presentacion> Presentacion { get; set; }
        public virtual DbSet<Proveedores> Proveedores { get; set; }
        public virtual DbSet<TasaDeCambio> TasaDeCambio { get; set; }
        public virtual DbSet<TipoComprobantes> TipoComprobantes { get; set; }
        public virtual DbSet<TipoCuenta> TipoCuenta { get; set; }
        public virtual DbSet<UnidadMedida> UnidadMedida { get; set; }
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
            modelBuilder.Entity<AsientoEstado>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Asientos>(entity =>
            {
                entity.HasIndex(e => e.CorteId);

                entity.HasIndex(e => e.CuentaId);

                entity.HasIndex(e => e.EntidadId);

                entity.HasIndex(e => e.Fecha);

                entity.HasIndex(e => e.Numero);

                entity.HasIndex(e => e.TipoComprobanteId)
                    .HasName("IX_Asientos_TipoComprobando");

                entity.Property(e => e.Codigo).HasMaxLength(50);

                entity.Property(e => e.Concepto).HasMaxLength(500);

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.Observacion).HasMaxLength(500);

                entity.Property(e => e.PagueseA).HasMaxLength(500);

                entity.Property(e => e.Referencia).HasMaxLength(50);

                entity.HasOne(d => d.Corte)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.CorteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Asientos_Cortes");

                entity.HasOne(d => d.Cuenta)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.CuentaId)
                    .HasConstraintName("FK_Asientos_Cuentas");

                entity.HasOne(d => d.Entidad)
                    .WithMany(p => p.Asientos)
                    .HasForeignKey(d => d.EntidadId)
                    .HasConstraintName("FK_Asientos_Entidades");

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

            modelBuilder.Entity<CompraEstado>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Compras>(entity =>
            {
                entity.HasIndex(e => e.EstadoId);

                entity.HasIndex(e => e.FormaPagoId);

                entity.HasIndex(e => e.ProveedorId);

                entity.Property(e => e.Descuento).HasColumnType("money");

                entity.Property(e => e.Fecha).HasColumnType("datetime");

                entity.Property(e => e.Iva)
                    .HasColumnName("IVA")
                    .HasColumnType("money");

                entity.Property(e => e.Observacion)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.SubTotal).HasColumnType("money");

                entity.Property(e => e.Total).HasColumnType("money");

                entity.HasOne(d => d.Estado)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.EstadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_CompraEstado");

                entity.HasOne(d => d.FormaPago)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.FormaPagoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_FormaPago");

                entity.HasOne(d => d.Proveedor)
                    .WithMany(p => p.Compras)
                    .HasForeignKey(d => d.ProveedorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Compras_Proveedores");
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

            modelBuilder.Entity<Entidades>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Celular).HasMaxLength(8);

                entity.Property(e => e.Direccion).HasMaxLength(300);

                entity.Property(e => e.Identificacion)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Telefono).HasMaxLength(8);
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
                    .IsFixedLength();

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
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

            modelBuilder.Entity<UnidadMedida>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Usuarios>(entity =>
            {
                entity.HasKey(e => e.Username);

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
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
