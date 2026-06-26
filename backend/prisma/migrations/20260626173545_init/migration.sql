/*
  Warnings:

  - You are about to drop the `Banco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chofer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactoEmergencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluacionPsicologica` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PagoChofer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonalAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecargaSaldo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RevisionVehicular` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Traslado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehiculo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chofer" DROP CONSTRAINT "Chofer_banco_id_fkey";

-- DropForeignKey
ALTER TABLE "Chofer" DROP CONSTRAINT "Chofer_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "ContactoEmergencia" DROP CONSTRAINT "ContactoEmergencia_chofer_id_fkey";

-- DropForeignKey
ALTER TABLE "EvaluacionPsicologica" DROP CONSTRAINT "EvaluacionPsicologica_chofer_id_fkey";

-- DropForeignKey
ALTER TABLE "EvaluacionPsicologica" DROP CONSTRAINT "EvaluacionPsicologica_evaluador_id_fkey";

-- DropForeignKey
ALTER TABLE "PagoChofer" DROP CONSTRAINT "PagoChofer_chofer_id_fkey";

-- DropForeignKey
ALTER TABLE "PersonalAdmin" DROP CONSTRAINT "PersonalAdmin_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "RecargaSaldo" DROP CONSTRAINT "RecargaSaldo_banco_id_fkey";

-- DropForeignKey
ALTER TABLE "RecargaSaldo" DROP CONSTRAINT "RecargaSaldo_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "RevisionVehicular" DROP CONSTRAINT "RevisionVehicular_evaluador_id_fkey";

-- DropForeignKey
ALTER TABLE "RevisionVehicular" DROP CONSTRAINT "RevisionVehicular_vehiculo_id_fkey";

-- DropForeignKey
ALTER TABLE "Traslado" DROP CONSTRAINT "Traslado_chofer_id_fkey";

-- DropForeignKey
ALTER TABLE "Traslado" DROP CONSTRAINT "Traslado_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_chofer_id_fkey";

-- DropTable
DROP TABLE "Banco";

-- DropTable
DROP TABLE "Chofer";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "ContactoEmergencia";

-- DropTable
DROP TABLE "EvaluacionPsicologica";

-- DropTable
DROP TABLE "PagoChofer";

-- DropTable
DROP TABLE "PersonalAdmin";

-- DropTable
DROP TABLE "RecargaSaldo";

-- DropTable
DROP TABLE "RevisionVehicular";

-- DropTable
DROP TABLE "Traslado";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "Vehiculo";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choferes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "banco_id" INTEGER NOT NULL,
    "nro_cuenta" TEXT NOT NULL,
    "saldo_pendiente" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldo_pagado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "choferes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos_emergencia" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,

    CONSTRAINT "contactos_emergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluaciones_psicologicas" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "aprobado" BOOLEAN NOT NULL,
    "evaluador_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluaciones_psicologicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revisiones_vehiculares" (
    "id" SERIAL NOT NULL,
    "vehiculo_id" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "apto" BOOLEAN NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "evaluador_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revisiones_vehiculares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recargas_saldo" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "banco_id" INTEGER NOT NULL,
    "nro_referencia" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recargas_saldo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traslados" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "traslados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos_chofer" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nro_referencia" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_chofer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_admin" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cedula_key" ON "usuarios"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "choferes_usuario_id_key" ON "choferes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_usuario_id_key" ON "clientes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_nombre_key" ON "bancos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "personal_admin_usuario_id_key" ON "personal_admin"("usuario_id");

-- AddForeignKey
ALTER TABLE "choferes" ADD CONSTRAINT "choferes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choferes" ADD CONSTRAINT "choferes_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "contactos_emergencia_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluaciones_psicologicas" ADD CONSTRAINT "evaluaciones_psicologicas_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluaciones_psicologicas" ADD CONSTRAINT "evaluaciones_psicologicas_evaluador_id_fkey" FOREIGN KEY ("evaluador_id") REFERENCES "personal_admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisiones_vehiculares" ADD CONSTRAINT "revisiones_vehiculares_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisiones_vehiculares" ADD CONSTRAINT "revisiones_vehiculares_evaluador_id_fkey" FOREIGN KEY ("evaluador_id") REFERENCES "personal_admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recargas_saldo" ADD CONSTRAINT "recargas_saldo_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recargas_saldo" ADD CONSTRAINT "recargas_saldo_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traslados" ADD CONSTRAINT "traslados_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traslados" ADD CONSTRAINT "traslados_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_chofer" ADD CONSTRAINT "pagos_chofer_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "choferes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_admin" ADD CONSTRAINT "personal_admin_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
