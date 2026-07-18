-- CreateTable
CREATE TABLE "calificaciones" (
    "id" SERIAL NOT NULL,
    "traslado_id" INTEGER NOT NULL,
    "quien_califica" TEXT NOT NULL DEFAULT 'CLIENTE',
    "calificado_id" INTEGER NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calificaciones_traslado_id_quien_califica_key" ON "calificaciones"("traslado_id", "quien_califica");

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_traslado_id_fkey" FOREIGN KEY ("traslado_id") REFERENCES "traslados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
