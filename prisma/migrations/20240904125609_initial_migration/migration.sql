-- CreateTable
CREATE TABLE "farmers" (
    "cpf_cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "state" CHAR(2) NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_modified_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmers_pkey" PRIMARY KEY ("cpf_cnpj")
);

-- CreateTable
CREATE TABLE "farms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "farmer_cpf_cnpj" TEXT NOT NULL,
    "state" CHAR(2) NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "total_area" DECIMAL(10,2) NOT NULL,
    "arable_area" DECIMAL(10,2) NOT NULL,
    "vegetation_area" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_modified_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultures" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "last_modified_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "culture_by_farm" (
    "id" SERIAL NOT NULL,
    "farm_id" INTEGER NOT NULL,
    "culture_id" INTEGER NOT NULL,
    "planted_area" DECIMAL(10,2) NOT NULL,
    "last_modified_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "culture_by_farm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farmers_cpf_cnpj_key" ON "farmers"("cpf_cnpj");

-- CreateIndex
CREATE INDEX "farms_farmer_cpf_cnpj_idx" ON "farms"("farmer_cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "cultures_type_subtype_key" ON "cultures"("type", "subtype");

-- CreateIndex
CREATE UNIQUE INDEX "culture_by_farm_farm_id_culture_id_key" ON "culture_by_farm"("farm_id", "culture_id");

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_farmer_cpf_cnpj_fkey" FOREIGN KEY ("farmer_cpf_cnpj") REFERENCES "farmers"("cpf_cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "culture_by_farm" ADD CONSTRAINT "culture_by_farm_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "culture_by_farm" ADD CONSTRAINT "culture_by_farm_culture_id_fkey" FOREIGN KEY ("culture_id") REFERENCES "cultures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
