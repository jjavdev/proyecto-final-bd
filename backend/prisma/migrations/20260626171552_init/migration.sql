-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CHOFER', 'CLIENTE', 'PERSONAL_ADMIN');

-- CreateTable
CREATE TABLE "Usuario" (
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

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chofer" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "banco_id" INTEGER NOT NULL,
    "nro_cuenta" TEXT NOT NULL,
    "saldo_pendiente" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldo_pagado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chofer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactoEmergencia" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,

    CONSTRAINT "ContactoEmergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluacionPsicologica" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "aprobado" BOOLEAN NOT NULL,
    "evaluador_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluacionPsicologica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionVehicular" (
    "id" SERIAL NOT NULL,
    "vehiculo_id" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "apto" BOOLEAN NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "evaluador_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevisionVehicular_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecargaSaldo" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "banco_id" INTEGER NOT NULL,
    "nro_referencia" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecargaSaldo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traslado" (
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

    CONSTRAINT "Traslado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoChofer" (
    "id" SERIAL NOT NULL,
    "chofer_id" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nro_referencia" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PagoChofer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banco" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Banco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalAdmin" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Chofer_usuario_id_key" ON "Chofer"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_usuario_id_key" ON "Cliente"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Banco_nombre_key" ON "Banco"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalAdmin_usuario_id_key" ON "PersonalAdmin"("usuario_id");

-- AddForeignKey
ALTER TABLE "Chofer" ADD CONSTRAINT "Chofer_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chofer" ADD CONSTRAINT "Chofer_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "Banco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactoEmergencia" ADD CONSTRAINT "ContactoEmergencia_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "Chofer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "Chofer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionPsicologica" ADD CONSTRAINT "EvaluacionPsicologica_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "Chofer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionPsicologica" ADD CONSTRAINT "EvaluacionPsicologica_evaluador_id_fkey" FOREIGN KEY ("evaluador_id") REFERENCES "PersonalAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionVehicular" ADD CONSTRAINT "RevisionVehicular_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionVehicular" ADD CONSTRAINT "RevisionVehicular_evaluador_id_fkey" FOREIGN KEY ("evaluador_id") REFERENCES "PersonalAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecargaSaldo" ADD CONSTRAINT "RecargaSaldo_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecargaSaldo" ADD CONSTRAINT "RecargaSaldo_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "Banco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traslado" ADD CONSTRAINT "Traslado_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traslado" ADD CONSTRAINT "Traslado_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "Chofer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoChofer" ADD CONSTRAINT "PagoChofer_chofer_id_fkey" FOREIGN KEY ("chofer_id") REFERENCES "Chofer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalAdmin" ADD CONSTRAINT "PersonalAdmin_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
