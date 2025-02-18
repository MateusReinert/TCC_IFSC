package main

import (
	database "github.com/MateusReinert/TCC_IFSC/dataBase"
	"github.com/MateusReinert/TCC_IFSC/routes"
)

func main() {
	database.ConnectDB()
	routes.HandleRequest()
}
