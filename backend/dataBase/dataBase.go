package dataBase

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB  *gorm.DB
	err error
)

func ConnectDB() {

	dsn := "host=aws-0-sa-east-1.pooler.supabase.com user=postgres.lksbcaigmucxemvparbh password='GFIG_2025!@#' dbname=postgres port=5432"

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:      logger.Default.LogMode(logger.Info),
		PrepareStmt: true,
	})
	if err != nil {
		log.Println("Erro ao conectar com banco de dados")
	} else {
		log.Println("Conexão com banco de dados realizada com sucesso")
	}
}
